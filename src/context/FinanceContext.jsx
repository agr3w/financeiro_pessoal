import React, { createContext, useState, useEffect } from 'react';
import { 
  createTransaction, subscribeToTransactions, 
  createRecurringPlan, subscribeToPlans, 
  removePlan, updatePlan,
  createCategory, subscribeToCategories, updateCategory, removeCategory,
  // Novos imports para notificações
  createSystemNotification, subscribeToSystemNotifications, removeSystemNotification,
  updatesystemSettings, subscribeToSystemSettings // <--- Novos Imports
} from '../services/finance';
import { useAuth } from './AuthContext';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [allTransactions, setAllTransactions] = useState([]);
  const [loanPlans, setLoanPlans] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  
  // Novo estado para notificações
  const [notifications, setNotifications] = useState([]);
  
  // Novo estado para configurações globais
  const [systemSettings, setSystemSettings] = useState({ maintenanceMode: false });

  // --- 0. NOTIFICAÇÕES GLOBAIS E SETTINGS ---
  useEffect(() => {
    // Essa inscrição não depende do user.uid, pois são globais (avisos do sistema para todos)
    const unsubscribeNotes = subscribeToSystemNotifications((data) => {
      setNotifications(data);
    });
    
    // Nova subscrição de configurações (independente de login)
    const unsubscribeSettings = subscribeToSystemSettings((data) => {
      setSystemSettings(data);
    });

    return () => {
      unsubscribeNotes();
      unsubscribeSettings();
    };
  }, []); // Roda uma vez na montagem

  // --- 1. CONEXÃO COM FIREBASE (DADOS DO USUÁRIO) ---
  useEffect(() => {
    if (!user) {
      setAllTransactions([]);
      setLoanPlans([]);
      setCustomCategories([]);
      return;
    }

    // Transações
    const unsubscribeTrans = subscribeToTransactions(user.uid, (data) => {
      setAllTransactions(data);
    });

    // Planos (Contas Fixas)
    const unsubscribePlans = subscribeToPlans(user.uid, (data) => {
      setLoanPlans(data);
    });

    // Categorias
    const unsubscribeCats = subscribeToCategories(user.uid, (data) => {
      setCustomCategories(data);
    });

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
    
    // B. Filtra Planos (Parcelas do Mês)
    const currentLoans = loanPlans.map(plan => {
      // Verifica se existe parcela para este mês/ano
      const installment = plan.installments.find(inst => isSameMonth(new Date(inst.dueDate), selectedDate));
      
      if (!installment) return null;

      return {
        ...plan, 
        currentInstallment: installment, 
        isPaid: installment.paid
      };
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

  const addRecurringPlanAction = async (planData) => {
    if (!user) return;

    // Gera parcelas localmente antes de enviar
    const installmentValue = planData.totalAmount / planData.installmentsCount;
    const newInstallments = [];
    
    // IMPORTANTE: Ajuste de fuso horário pode alterar o dia
    // Criamos a data baseada na string YYYY-MM-DD vinda do input
    // Adicionamos 'T12:00:00' para garantir que fique no meio do dia e evite pular dia por timezone
    const start = new Date(planData.startDate + 'T12:00:00');

    for (let i = 0; i < planData.installmentsCount; i++) {
        const date = new Date(start);
        date.setMonth(start.getMonth() + i); // Adiciona meses
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

  const deletePlanAction = async (planId) => {
    await removePlan(planId);
  };

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

  // Categorias
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

  // Ações de NOTIFICAÇÃO (Admin)
  const sendNotification = async (data) => { await createSystemNotification(data); };
  const deleteNotification = async (id) => { await removeSystemNotification(id); };

  // Ações de ADMIN
  const toggleMaintenanceMode = async () => {
    await updatesystemSettings({ maintenanceMode: !systemSettings.maintenanceMode });
  };

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
      // Novos exports de notificação
      notifications,
      sendNotification, 
      deleteNotification,
      // Novos exports
      maintenanceMode: systemSettings.maintenanceMode,
      toggleMaintenanceMode
    }}>
      {children}
    </FinanceContext.Provider>
  );
};