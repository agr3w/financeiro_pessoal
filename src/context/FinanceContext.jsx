import React, { createContext, useState, useEffect } from 'react';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  // 1. Estado Global de Data (Começa hoje)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 2. Banco de Transações "Infinito" (No futuro virá do Firebase)
  const [allTransactions, setAllTransactions] = useState([
    // Exemplo: Salário de Janeiro
    { id: 1, label: 'Salário', amount: 3500, type: 'income', category: 'Salário', date: new Date(2026, 0, 5) }, // Jan
    // Exemplo: Mercado em Fevereiro (Simulando futuro)
    { id: 2, label: 'Mercado Futuro', amount: 600, type: 'expense', category: 'Alimentação', date: new Date(2026, 1, 10) }, // Fev
  ]);

  // 3. Banco de Planos Recorrentes (Empréstimos/Parcelados)
  // Estrutura inteligente: O 'installments' diz exatamente quando vence cada parcela
  const [loanPlans, setLoanPlans] = useState([
    { 
      id: 'loan_nubank', 
      title: 'Empréstimo Nubank', 
      totalDebt: 1000, 
      installments: [
        { number: 1, amount: 250, dueDate: new Date(2026, 0, 20), paid: false }, // Jan
        { number: 2, amount: 250, dueDate: new Date(2026, 1, 20), paid: false }, // Fev
        { number: 3, amount: 250, dueDate: new Date(2026, 2, 20), paid: false }, // Mar
        { number: 4, amount: 250, dueDate: new Date(2026, 3, 20), paid: false }, // Abr
      ]
    }
  ]);

  // --- ESTADOS COMPUTADOS (O que aparece na tela) ---
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [monthBalance, setMonthBalance] = useState(0);
  const [monthIncome, setMonthIncome] = useState(0);
  const [monthExpense, setMonthExpense] = useState(0);
  const [monthLoans, setMonthLoans] = useState([]); // Parcelas DO MÊS

  // Função Auxiliar: Verifica se duas datas são do mesmo mês/ano
  const isSameMonth = (d1, d2) => {
    return d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  // EFEITO: Sempre que mudar a DATA ou as TRANSAÇÕES, recalcula tudo
  useEffect(() => {
    // A. Filtra Transações Avulsas
    const currentTrans = allTransactions.filter(t => isSameMonth(new Date(t.date), selectedDate));
    
    // B. Processa Empréstimos para o mês selecionado
    // Transformamos o "Plano" em uma "Visualização de Parcela"
    const currentLoans = loanPlans.map(plan => {
      const installment = plan.installments.find(inst => isSameMonth(new Date(inst.dueDate), selectedDate));
      
      if (!installment) return null; // Esse empréstimo não tem parcela neste mês

      return {
        ...plan, // Dados gerais (Titulo)
        currentInstallment: installment, // Dados específicos deste mês (Valor, Pago?)
        isPaid: installment.paid // Atalho visual
      };
    }).filter(Boolean); // Remove os nulos

    // C. Calcula Totais
    const inc = currentTrans.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const exp = currentTrans.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    
    setFilteredTransactions(currentTrans);
    setMonthLoans(currentLoans);
    setMonthIncome(inc);
    setMonthExpense(exp);
    setMonthBalance(inc - exp);

  }, [selectedDate, allTransactions, loanPlans]);

  // --- AÇÕES ---

  const addTransaction = (data) => {
    // Se a transação não tiver data, usa a data selecionada no calendário
    const transactionDate = data.date || selectedDate;
    
    setAllTransactions(prev => [
      { ...data, id: Date.now(), date: transactionDate }, 
      ...prev
    ]);
  };

  // 1. Função Inteligente para criar Planos Parcelados
  const addRecurringPlan = (planData) => {
    /* planData espera: { 
         title: "Notebook", 
         totalAmount: 3000, 
         installmentsCount: 10, 
         startDate: "2026-02-15",
         category: "Compras"
       }
    */

    const installmentValue = planData.totalAmount / planData.installmentsCount;
    const newInstallments = [];
    const start = new Date(planData.startDate);

    // Loop para gerar as N parcelas
    for (let i = 0; i < planData.installmentsCount; i++) {
        // Clona a data para não alterar a referência
        const date = new Date(start);
        // Adiciona 'i' meses na data inicial (Lógica de Mês Seguinte)
        date.setMonth(start.getMonth() + i);

        newInstallments.push({
            number: i + 1,
            amount: installmentValue,
            dueDate: date,
            paid: false
        });
    }

    const newPlan = {
        id: Date.now(), // ID único
        title: planData.title,
        totalDebt: parseFloat(planData.totalAmount),
        category: planData.category,
        installments: newInstallments
    };

    setLoanPlans(prev => [...prev, newPlan]);
  };

  // 2. Função para Remover um Plano (Caso tenha errado)
  const deletePlan = (planId) => {
    setLoanPlans(prev => prev.filter(p => p.id !== planId));
  };

  const payInstallment = (loanId, installmentNumber) => {
    // 1. Atualiza o Plano de Empréstimo (Marca parcela como paga)
    setLoanPlans(prevPlans => prevPlans.map(plan => {
      if (plan.id !== loanId) return plan;

      const newInstallments = plan.installments.map(inst => {
        if (inst.number === installmentNumber) return { ...inst, paid: true };
        return inst;
      });

      return { ...plan, installments: newInstallments };
    }));

    // 2. Gera a transação de saída no extrato
    const plan = loanPlans.find(p => p.id === loanId);
    const installment = plan.installments.find(i => i.number === installmentNumber);
    
    addTransaction({
      label: `Parcela ${installmentNumber} - ${plan.title}`,
      amount: installment.amount,
      type: 'expense',
      category: 'Contas',
      date: selectedDate // Importante: Usa a data que estamos olhando
    });
  };

  return (
    <FinanceContext.Provider value={{ 
      selectedDate, setSelectedDate, // Exporta o controle de data
      transactions: filteredTransactions, // Exporta JÁ FILTRADO
      loans: monthLoans, // Exporta JÁ FILTRADO
      balance: monthBalance, 
      income: monthIncome, 
      expense: monthExpense, 
      addTransaction, 
      payInstallment,
      addRecurringPlan, // <--- Novo
      deletePlan // <--- Novo
    }}>
      {children}
    </FinanceContext.Provider>
  );
};