import React, { createContext, useState, useEffect } from "react";
import {
  collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc,
  serverTimestamp, orderBy, getDoc
} from 'firebase/firestore';
import { db } from '../services/firebase'; // Certifique-se que o caminho está correto
import { useAuth } from "./AuthContext";

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const { user } = useAuth();
  
  // --- ESTADOS GLOBAIS DE DADOS ---
  const [allTransactions, setAllTransactions] = useState([]);
  const [loanPlans, setLoanPlans] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [partnerData, setPartnerData] = useState(null); // Dados do parceiro
  
  // --- ESTADOS DE SISTEMA E UI ---
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appsStatus, setAppsStatus] = useState({ maintenanceMode: false });
  const [loading, setLoading] = useState(true);

  // --- CÁLCULOS VISUAIS (FILTRADOS POR MÊS) ---
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [monthBalance, setMonthBalance] = useState(0);
  const [monthIncome, setMonthIncome] = useState(0);
  const [monthExpense, setMonthExpense] = useState(0);
  const [monthLoans, setMonthLoans] = useState([]);

  // --- 1. BUSCA DE DADOS CONJUNTOS (EU + PARCEIRO) ---
  useEffect(() => {
    if (!user) {
      setAllTransactions([]);
      setLoanPlans([]);
      setCustomCategories([]);
      setPartnerData(null);
      return;
    }

    setLoading(true);

    let unsubTrans = () => {};
    let unsubPlans = () => {};
    let unsubCats = () => {};

    const setupListeners = async () => {
        let uidsToFetch = [user.uid];

        try {
            // Busca dados do usuário para ver se tem parceiro
            const userDocRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userDocRef);
            
            if (userSnap.exists() && userSnap.data().partnerUid) {
                const pUid = userSnap.data().partnerUid;
                uidsToFetch.push(pUid);
                
                // Pega info do parceiro para display
                const partnerSnap = await getDoc(doc(db, 'users', pUid));
                if (partnerSnap.exists()) {
                    setPartnerData(partnerSnap.data());
                }
            } else {
                setPartnerData(null);
            }
        } catch (error) {
            console.error("Erro ao buscar parceiro:", error);
        }

        // A. TRANSAÇÕES (Query com 'in' para pegar dos dois)
        const qTrans = query(
            collection(db, 'transactions'),
            where('uid', 'in', uidsToFetch)
        );

        unsubTrans = onSnapshot(qTrans, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Converte timestamp do Firestore para Date JS
                date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(doc.data().date)
            }));
            // Ordena localmente pois 'in' queries limitam orderBy
            list.sort((a, b) => b.date - a.date);
            setAllTransactions(list);
        });

        // B. PLANOS RECORRENTES
        const qPlans = query(
            collection(db, 'recurringPlans'), 
            where('uid', 'in', uidsToFetch)
        );
        unsubPlans = onSnapshot(qPlans, (snapshot) => {
            const list = snapshot.docs.map(doc => {
                 const data = doc.data();
                 // Garante que sub-arrays de installments tenham Datas corretas
                 const installments = (data.installments || []).map(inst => ({
                     ...inst,
                     dueDate: inst.dueDate?.toDate ? inst.dueDate.toDate() : new Date(inst.dueDate)
                 }));
                 return { id: doc.id, ...data, installments };
            });
            setLoanPlans(list);
        });

        // C. CATEGORIAS (Customizadas apenas do usuário logado pra não poluir)
        // Se quiser compartilhar categorias, mude para 'in' uidsToFetch
        const qCats = query(collection(db, 'categories'), where('uid', '==', user.uid));
        unsubCats = onSnapshot(qCats, (snapshot) => {
            setCustomCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        setLoading(false);
    };

    setupListeners();

    // D. DADOS DO SISTEMA (Globais)
    const qSys = doc(db, 'system', 'config');
    const unsubSys = onSnapshot(qSys, (doc) => {
        if (doc.exists()) setAppsStatus(doc.data());
    });

    const qNotif = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    const unsubNotif = onSnapshot(qNotif, (snapshot) => {
        setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
        unsubTrans();
        unsubPlans();
        unsubCats();
        unsubSys();
        unsubNotif();
    };

  }, [user]);

  // --- 2. LÓGICA DE FILTRAGEM (MÊS SELECIONADO) ---
  const isSameMonth = (d1, d2) => {
    // Helper para garantir formato Date
    const ensureDate = (input) => {
      if (!input) return new Date(); 
      if (input instanceof Date) return input;
      // Se for string YYYY-MM
      if (typeof input === 'string' && input.length === 7) {
        const [y, m] = input.split('-');
        return new Date(parseInt(y), parseInt(m) - 1, 15);
      }
      return new Date(input);
    };

    const date1 = ensureDate(d1);
    const date2 = ensureDate(d2);

    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) return false;

    return (
      date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
    );
  };

  useEffect(() => {
    // Filtra transações do mês visualizado
    const currentTrans = allTransactions.filter((t) =>
      isSameMonth(t.date, selectedDate),
    );

    // Filtra parcelas do mês visualizado
    const currentLoans = loanPlans
      .map((plan) => {
        const findInstallment = plan.installments?.find((inst) => 
            isSameMonth(inst.dueDate, selectedDate)
        );
        
        if (!findInstallment) return null;
        return {
          ...plan,
          currentInstallment: findInstallment,
          isPaid: findInstallment.paid,
        };
      })
      .filter(Boolean);

    // Calcula totais
    const inc = currentTrans
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0);
    const exp = currentTrans
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);

    setFilteredTransactions(currentTrans);
    setMonthLoans(currentLoans);
    setMonthIncome(inc);
    setMonthExpense(exp);
    setMonthBalance(inc - exp);
  }, [selectedDate, allTransactions, loanPlans]);


  // --- 3. AÇÕES (CRUD no Firestore) ---

  const addTransaction = async (data) => {
    if (!user) return;
    try {
        await addDoc(collection(db, 'transactions'), {
          ...data,
          date: data.date || new Date(), // Garante que é Date
          uid: user.uid, // Sempre salva com meu ID
          createdAt: serverTimestamp(),
          ownerName: user.displayName || user.email // Opcional: Pra saber quem criou
        });
    } catch (e) { console.error(e); }
  };
  
  const editTransaction = async (id, data) => {
      try {
        await updateDoc(doc(db, 'transactions', id), data);
      } catch (e) { console.error(e); }
  };

  const removeTransaction = async (id) => {
      try {
        await deleteDoc(doc(db, 'transactions', id));
      } catch (e) { console.error(e); }
  };

  // --- LÓGICA DE RECORRÊNCIA ---
  const addMonthsNoOverflow = (date, months) => {
    const newDate = new Date(date);
    const originalDay = date.getDate();
    newDate.setDate(1);
    newDate.setMonth(newDate.getMonth() + months);
    const lastDayOfNewMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
    newDate.setDate(Math.min(originalDay, lastDayOfNewMonth));
    return newDate;
  };

  const addRecurringPlan = async (planData) => {
    if (!user) return;
    const { amount, installmentsCount, type } = planData;
    const isSubscription = type === "subscription";
    let installmentValue;
    let totalCount;

    if (isSubscription) {
      installmentValue = parseFloat(amount);
      totalCount = 60; // 5 anos
    } else {
      totalCount = parseInt(installmentsCount, 10) || 1;
      installmentValue = parseFloat(amount) / totalCount;
    }

    const newInstallments = [];
    // Garante data inicial correta para cálculos
    const startStr = planData.startDate; 
    // Se vier string YYYY-MM-DD
    const start = new Date(startStr + "T12:00:00"); 

    for (let i = 0; i < totalCount; i++) {
        const date = addMonthsNoOverflow(start, i);
        newInstallments.push({
            number: i + 1,
            amount: installmentValue,
            dueDate: date, // É salvo como Timestamp pelo Firebase SDK automaticamente se for Date valid
            paid: false,
        });
    }

    await addDoc(collection(db, 'recurringPlans'), {
      uid: user.uid,
      title: planData.title,
      totalDebt: parseFloat(amount),
      category: planData.category,
      type: type || "loan",
      installments: newInstallments,
      createdAt: serverTimestamp()
    });
  };

  const deletePlan = async (planId) => {
      await deleteDoc(doc(db, 'recurringPlans', planId));
  };

  const payInstallment = async (loanId, installmentNumber) => {
    const plan = loanPlans.find((p) => p.id === loanId);
    if (!plan) return;

    // Atualiza status localmente no array
    const newInstallments = plan.installments.map((inst) => {
      if (inst.number === installmentNumber) return { ...inst, paid: true };
      return inst;
    });

    // Atualiza no banco
    await updateDoc(doc(db, 'recurringPlans', loanId), { installments: newInstallments });

    // Cria a transação de despesa
    const installment = plan.installments.find((i) => i.number === installmentNumber);
    
    // IMPORTANTE: Usa a data selecionada para a transação aparecer no mês atual visualizado, 
    // ou usa a data de vencimento da parcela (installment.dueDate). Decisão de business.
    // Usaremos selectedDate para garantir UX fluida.
    
    // Tratamento de data seguro se selectedDate for string ou Date
    let transDate = selectedDate instanceof Date ? selectedDate : new Date();
    if (typeof selectedDate === 'string') {
         const [y,m] = selectedDate.split('-');
         transDate = new Date(parseInt(y), parseInt(m)-1, 15);
    }

    await addTransaction({
      label: `Parcela ${installmentNumber} - ${plan.title}`,
      amount: installment.amount,
      type: "expense",
      category: plan.category || "Contas",
      date: transDate,
    });
  };

  // --- CATEGORIAS ---
  const defaultCategories = [
    { id: "Alimentação", label: "Alimentação", iconKey: "food", color: "#FFAB91"},
    { id: "Transporte", label: "Transporte", iconKey: "transport", color: "#90CAF9"},
    { id: "Compras", label: "Compras", iconKey: "shopping", color: "#CE93D8" },
    { id: "Contas", label: "Contas", iconKey: "bills", color: "#EF9A9A" },
  ];
  const allCategories = [...defaultCategories, ...customCategories];

  const addCategory = async (catData) => {
      if (user) await addDoc(collection(db, 'categories'), { ...catData, uid: user.uid });
  };
  const editCategory = async (catId, newData) => {
      await updateDoc(doc(db, 'categories', catId), newData);
  };
  const removeCategory = async (catId) => {
      await deleteDoc(doc(db, 'categories', catId));
  };

  // --- ADMIN SYSTEM ---
  const toggleMaintenanceMode = async () => {
    // Isso requer regra de segurança permitindo escrita em 'system/config'
    // ou cloud function. Aqui assumimos modo admin liberado ou regra permissiva.
    await updateDoc(doc(db, 'system', 'config'), { maintenanceMode: !appsStatus.maintenanceMode });
  };

  const sendNotification = async (data) => await addDoc(collection(db, 'notifications'), { ...data, createdAt: serverTimestamp() });
  const deleteNotification = async (id) => await deleteDoc(doc(db, 'notifications', id));

  return (
    <FinanceContext.Provider
      value={{
        // Estados
        selectedDate, setSelectedDate,
        transactions: filteredTransactions,
        loans: monthLoans,
        balance: monthBalance,
        income: monthIncome,
        expense: monthExpense,
        categories: allCategories,
        notifications,
        maintenanceMode: appsStatus.maintenanceMode,
        partnerData,
        loading,

        // Ações Transações
        addTransaction,
        editTransaction,
        removeTransaction,
        
        // Ações Planos
        addRecurringPlan,
        deletePlan,
        payInstallment,

        // Ações Categorias
        addCategory,
        editCategory,
        removeCategory,

        // Ações Admin
        toggleMaintenanceMode,
        sendNotification,
        deleteNotification,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
