import React, { createContext, useState, useEffect } from 'react';
import {
  createTransaction, subscribeToTransactions,
  createRecurringPlan, subscribeToPlans,
  removePlan, updatePlan,
  // Novos imports para categorias
  createCategory, subscribeToCategories, removeCategory, updateCategory // <-- importado updateCategory
} from '../services/finance';
// 1. Importar o hook de autenticação
import { useAuth } from './AuthContext';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  // 2. Pegar o usuário logado
  const { user } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allTransactions, setAllTransactions] = useState([]);
  const [loanPlans, setLoanPlans] = useState([]);
  const [customCategories, setCustomCategories] = useState([]); // Novo estado

  // CATEGORIAS PADRÃO (Ícones e Cores)
  const defaultCategories = [
    { id: 'Alimentação', label: 'Alimentação', iconKey: 'food', color: '#FFAB91' },
    { id: 'Transporte', label: 'Transporte', iconKey: 'transport', color: '#90CAF9' },
    { id: 'Compras', label: 'Compras', iconKey: 'shopping', color: '#CE93D8' },
    { id: 'Contas', label: 'Contas', iconKey: 'bills', color: '#EF9A9A' },
  ];

  // --- 1. CONEXÃO COM FIREBASE (EFEITOS) ---

  useEffect(() => {
    // Se não tiver usuário logado, não busca nada e limpa os estados
    if (!user) {
        setAllTransactions([]);
        setLoanPlans([]);
        setCustomCategories([]); // Limpa categorias
        return;
    }

    // 3. Passar user.uid como primeiro argumento (CORREÇÃO DO ERRO)
    const unsubscribeTrans = subscribeToTransactions(user.uid, (data) => {
      setAllTransactions(data);
    });

    const unsubscribePlans = subscribeToPlans(user.uid, (data) => {
      setLoanPlans(data);
    });

    // Subscrição de Categorias
    const unsubscribeCats = subscribeToCategories(user.uid, (data) => {
      setCustomCategories(data);
    });

    return () => {
      unsubscribeTrans();
      unsubscribePlans();
      unsubscribeCats();
    };
  // 4. Adicionar 'user' nas dependências para refazer a conexão quando logar/deslogar
  }, [user]);

  // Lista Final (Padrão + Customizadas)
  const allCategories = [...defaultCategories, ...customCategories];

  // --- 2. CÁLCULOS VISUAIS (Mantém a lógica de timeline local) ---

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

    // B. Filtra Planos (Lógica igual a anterior)
    const currentLoans = loanPlans.map(plan => {
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

  // --- 3. AÇÕES (Atualizadas para enviar o userId) ---

  // Ações
  const addTransaction = async (data) => {
    if (!user) return; // Segurança

    // Passar user.uid primeiro
    await createTransaction(user.uid, {
      ...data,
      date: data.date || selectedDate
    });
  };

  const addCategoryAction = async (catData) => {
     if(!user) return;
     await createCategory(user.uid, catData);
  };
  
  // NOVA AÇÃO DE EDITAR
  const editCategoryAction = async (catId, newData) => {
     await updateCategory(catId, newData);
  };

  const removeCategoryAction = async (catId) => {
     await removeCategory(catId);
  };

  const addRecurringPlanAction = async (planData) => {
    if (!user) return;

    const installmentValue = planData.totalAmount / planData.installmentsCount;
    const newInstallments = [];
    const start = new Date(planData.startDate);

    for (let i = 0; i < planData.installmentsCount; i++) {
        const date = new Date(start);
        date.setMonth(start.getMonth() + i);
        newInstallments.push({
          number: i + 1,
          amount: installmentValue,
          dueDate: date,
          paid: false
        });
    }

    // Passar user.uid primeiro
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
    if (!user) return; // Segurança
    const plan = loanPlans.find(p => p.id === loanId);
    if (!plan) return;

    // 1. Atualiza o array de parcelas localmente
    const newInstallments = plan.installments.map(inst => {
      if (inst.number === installmentNumber) return { ...inst, paid: true };
      return inst;
    });

    // 2. Envia atualização para o banco (Plano)
    await updatePlan(loanId, { installments: newInstallments });

    // 3. Cria a transação de saída (Extrato)
    const installment = plan.installments.find(i => i.number === installmentNumber);
    
    // Passar user.uid também na criação da despesa automática
    await createTransaction(user.uid, {
      label: `Parcela ${installmentNumber} - ${plan.title}`,
      amount: installment.amount,
      type: 'expense',
      category: 'Contas',
      date: selectedDate
    });
  };

  return (
    <FinanceContext.Provider value={{
      selectedDate, setSelectedDate,
      transactions: filteredTransactions,
      loans: monthLoans,
      balance: monthBalance,
      income: monthIncome,
      expense: monthExpense,
      categories: allCategories, // Exporta a lista completa
      addTransaction,
      payInstallment,
      addRecurringPlan: addRecurringPlanAction,
      deletePlan: deletePlanAction,
      addCategory: addCategoryAction,
      editCategory: editCategoryAction, // <-- exportado aqui
      removeCategory: removeCategoryAction
    }}>
      {children}
    </FinanceContext.Provider>
  );
};