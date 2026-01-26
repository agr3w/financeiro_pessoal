import React, { createContext, useState, useEffect } from 'react';
import { 
  createTransaction, subscribeToTransactions, 
  createRecurringPlan, subscribeToPlans, 
  removePlan, updatePlan,
  createCategory, subscribeToCategories, updateCategory, removeCategory,
  updateTransaction, removeTransaction,
  // IMPORTAR AS NOVAS FUNÇÕES
  subscribeToSystemConfig, updateSystemMaintenance,
  subscribeToSystemNotifications, createSystemNotification, removeSystemNotification
} from '../services/finance';
import { useAuth } from './AuthContext';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [allTransactions, setAllTransactions] = useState([]);
  const [loanPlans, setLoanPlans] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);

  // --- NOVOS ESTADOS GLOBAIS ---
  const [appsStatus, setAppsStatus] = useState({ maintenanceMode: false });
  const [notifications, setNotifications] = useState([]);

  // --- ESCUTAR CONFIGURAÇÕES GLOBAIS (Roda independente do usuário estar logado) ---
  useEffect(() => {
    // Escutar status de manutenção
    const unsubConfig = subscribeToSystemConfig((data) => {
        setAppsStatus(data);
    });

    // Escutar notificações públicas
    const unsubNotes = subscribeToSystemNotifications((data) => {
        setNotifications(data);
    });

    return () => {
        unsubConfig();
        unsubNotes();
    };
  }, []); // Array vazio: executa ao abrir o app

  // --- 1. CONEXÃO COM FIREBASE ---
  useEffect(() => {
    if (!user) {
      setAllTransactions([]);
      setLoanPlans([]);
      setCustomCategories([]);
      return;
    }

    const unsubscribeTrans = subscribeToTransactions(user.uid, (data) => setAllTransactions(data));
    const unsubscribePlans = subscribeToPlans(user.uid, (data) => setLoanPlans(data));
    const unsubscribeCats = subscribeToCategories(user.uid, (data) => setCustomCategories(data));

    return () => {
      unsubscribeTrans();
      unsubscribePlans();
      unsubscribeCats();
    };
  }, [user]);

  // --- 2. CÁLCULOS VISUAIS ---
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [monthBalance, setMonthBalance] = useState(0);
  const [monthIncome, setMonthIncome] = useState(0);
  const [monthExpense, setMonthExpense] = useState(0);
  const [monthLoans, setMonthLoans] = useState([]);

  const isSameMonth = (d1, d2) => {
    return d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  useEffect(() => {
    // A. Filtra Transações
    const currentTrans = allTransactions.filter(t => isSameMonth(new Date(t.date), selectedDate));
    
    // B. Filtra Planos
    const currentLoans = loanPlans.map(plan => {
      const installment = plan.installments.find(inst => isSameMonth(new Date(inst.dueDate), selectedDate));
      if (!installment) return null;
      return { ...plan, currentInstallment: installment, isPaid: installment.paid };
    }).filter(Boolean);

    // C. Totais
    const inc = currentTrans.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const exp = currentTrans.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    
    setFilteredTransactions(currentTrans);
    setMonthLoans(currentLoans);
    setMonthIncome(inc);
    setMonthExpense(exp);
    setMonthBalance(inc - exp);

  }, [selectedDate, allTransactions, loanPlans]);

  // --- 3. AÇÕES ---
  const addTransaction = async (data) => {
    if (!user) return;
    await createTransaction(user.uid, { ...data, date: data.date || selectedDate });
  };

  // --- CORREÇÃO DO BUG DE DATAS AQUI ---
  const addMonthsNoOverflow = (date, months) => {
    const newDate = new Date(date);
    const originalDay = date.getDate();
    
    // Seta para o dia 1º para evitar pular mês na mudança
    newDate.setDate(1);
    newDate.setMonth(newDate.getMonth() + months);
    
    // Verifica qual é o último dia do novo mês
    // (Mês + 1, dia 0) pega o último dia do mês atual
    const lastDayOfNewMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
    
    // Se o dia original (ex: 31) for maior que o último dia (ex: 28), usa o 28.
    newDate.setDate(Math.min(originalDay, lastDayOfNewMonth));
    
    return newDate;
  };

  const addRecurringPlanAction = async (planData) => {
    if (!user) return;

    const installmentValue = planData.totalAmount / planData.installmentsCount;
    const newInstallments = [];
    
    // Data base corrigida para meio-dia
    const start = new Date(planData.startDate + 'T12:00:00');

    for (let i = 0; i < planData.installmentsCount; i++) {
        // Usa a nova função segura de datas
        const date = addMonthsNoOverflow(start, i);
        
        newInstallments.push({
            number: i + 1,
            amount: installmentValue,
            dueDate: date,
            paid: false
        });
    }

    await createRecurringPlan(user.uid, {
        title: planData.title,
        totalDebt: parseFloat(planData.totalAmount),
        category: planData.category,
        installments: newInstallments
    });
  };

  const deletePlanAction = async (planId) => { await removePlan(planId); };

  const payInstallment = async (loanId, installmentNumber) => {
    const plan = loanPlans.find(p => p.id === loanId);
    if (!plan) return;

    const newInstallments = plan.installments.map(inst => {
      if (inst.number === installmentNumber) return { ...inst, paid: true };
      return inst;
    });

    await updatePlan(loanId, { installments: newInstallments });

    const installment = plan.installments.find(i => i.number === installmentNumber);
    await createTransaction(user.uid, {
      label: `Parcela ${installmentNumber} - ${plan.title}`,
      amount: installment.amount,
      type: 'expense',
      category: plan.category || 'Contas',
      date: selectedDate
    });
  };

  const defaultCategories = [
    { id: 'Alimentação', label: 'Alimentação', iconKey: 'food', color: '#FFAB91' },
    { id: 'Transporte', label: 'Transporte', iconKey: 'transport', color: '#90CAF9' },
    { id: 'Compras', label: 'Compras', iconKey: 'shopping', color: '#CE93D8' },
    { id: 'Contas', label: 'Contas', iconKey: 'bills', color: '#EF9A9A' },
  ];

  const allCategories = [...defaultCategories, ...customCategories];

  const addCategoryAction = async (catData) => { if(user) await createCategory(user.uid, catData); };
  const editCategoryAction = async (catId, newData) => { await updateCategory(catId, newData); };
  const removeCategoryAction = async (catId) => { await removeCategory(catId); };
  const editTransactionAction = async (id, data) => { await updateTransaction(id, data); };
  const removeTransactionAction = async (id) => { await removeTransaction(id); };

  // --- FUNÇÕES DE ADMIN ---
  const toggleMaintenanceMode = async () => {
    const newStatus = !appsStatus.maintenanceMode;
    await updateSystemMaintenance(newStatus);
  };

  const sendNotification = async (data) => await createSystemNotification(data);
  const deleteNotification = async (id) => await removeSystemNotification(id);

  return (
    <FinanceContext.Provider value={{ 
      selectedDate, setSelectedDate,
      transactions: filteredTransactions,
      loans: monthLoans,
      balance: monthBalance, 
      income: monthIncome, 
      expense: monthExpense, 
      addTransaction, 
      payInstallment,
      addRecurringPlan: addRecurringPlanAction,
      deletePlan: deletePlanAction,
      categories: allCategories,
      addCategory: addCategoryAction,
      editCategory: editCategoryAction,
      removeCategory: removeCategoryAction,
      editTransaction: editTransactionAction,
      removeTransaction: removeTransactionAction,

      // EXPORTAR NOVOS VALORES E FUNÇÕES
      maintenanceMode: appsStatus.maintenanceMode,
      toggleMaintenanceMode,
      notifications,
      sendNotification,
      deleteNotification
    }}>
      {children}
    </FinanceContext.Provider>
  );
};