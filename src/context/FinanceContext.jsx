import React, { createContext, useState, useEffect } from 'react';
import {
  createTransaction, subscribeToTransactions,
  createRecurringPlan, subscribeToPlans,
  removePlan, updatePlan
} from '../services/finance';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // AGORA COMEÇAM VAZIOS
  const [allTransactions, setAllTransactions] = useState([]);
  const [loanPlans, setLoanPlans] = useState([]);

  // --- 1. CONEXÃO COM FIREBASE (EFEITOS) ---

  useEffect(() => {
    // Inscreve para ouvir Transações
    const unsubscribeTrans = subscribeToTransactions((data) => {
      setAllTransactions(data);
    });

    // Inscreve para ouvir Planos
    const unsubscribePlans = subscribeToPlans((data) => {
      setLoanPlans(data);
    });

    // Limpeza ao fechar o app
    return () => {
      unsubscribeTrans();
      unsubscribePlans();
    };
  }, []);

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

  // --- 3. AÇÕES (Agora chamam o Firebase) ---

  const addTransaction = async (data) => {
    await createTransaction({
      ...data,
      date: data.date || selectedDate
    });
  };

  const addRecurringPlanAction = async (planData) => {
    // Lógica de gerar as parcelas (igual antes, mas prepara para envio)
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

    await createRecurringPlan({
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

    // 1. Atualiza o array de parcelas localmente
    const newInstallments = plan.installments.map(inst => {
      if (inst.number === installmentNumber) return { ...inst, paid: true };
      return inst;
    });

    // 2. Envia atualização para o banco (Plano)
    await updatePlan(loanId, { installments: newInstallments });

    // 3. Cria a transação de saída (Extrato)
    const installment = plan.installments.find(i => i.number === installmentNumber);
    await createTransaction({
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
      addTransaction,
      payInstallment,
      addRecurringPlan: addRecurringPlanAction,
      deletePlan: deletePlanAction
    }}>
      {children}
    </FinanceContext.Provider>
  );
};