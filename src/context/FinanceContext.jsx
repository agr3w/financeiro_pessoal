import React, { createContext, useState, useEffect } from 'react';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  // 1. Estado das Transações (Começa com alguns dados de exemplo)
  const [transactions, setTransactions] = useState([
    { id: 1, label: 'Salário', amount: 3500, type: 'income', category: 'bills', date: new Date() },
    { id: 2, label: 'Mercado', amount: 450, type: 'expense', category: 'food', date: new Date() },
  ]);

  // 2. Estado dos Empréstimos (Baseado no seu desenho)
  const [loans, setLoans] = useState([
    { 
      id: 'loan_nubank', 
      title: 'Empréstimo Nubank', 
      totalDebt: 900, 
      paidAmount: 0, 
      nextDueDate: '01/02',
      nextInstallmentValue: 250 
    }
  ]);

  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  // 3. Recalcula Saldo automaticamente sempre que houver mudança
  useEffect(() => {
    const inc = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
    
    setIncome(inc);
    setExpense(exp);
    setBalance(inc - exp);
  }, [transactions]);

  // --- AÇÕES ---

  // Adicionar Transação Simples
  const addTransaction = (newTransaction) => {
    setTransactions(prev => [
      { ...newTransaction, id: Date.now(), date: new Date() }, 
      ...prev
    ]);
  };

  // Pagar Parcela (A INTEGRAÇÃO INTELIGENTE)
  const payInstallment = (loanId) => {
    // 1. Achar o empréstimo
    const loanIndex = loans.findIndex(l => l.id === loanId);
    const loan = loans[loanIndex];

    if (!loan) return;

    // 2. Atualizar o empréstimo (aumentar o pago)
    const updatedLoans = [...loans];
    updatedLoans[loanIndex] = {
      ...loan,
      paidAmount: loan.paidAmount + loan.nextInstallmentValue,
      // Lógica simples para jogar a data pra frente (mock)
      nextDueDate: '01/03' 
    };
    setLoans(updatedLoans);

    // 3. O PULO DO GATO: Criar a transação de despesa automaticamente
    addTransaction({
      label: `Parcela ${loan.title}`,
      amount: loan.nextInstallmentValue,
      type: 'expense',
      category: 'bills', // Categoria Contas
      date: new Date()
    });
  };

  return (
    <FinanceContext.Provider value={{ 
      transactions, 
      loans, 
      balance, 
      income, 
      expense, 
      addTransaction, 
      payInstallment 
    }}>
      {children}
    </FinanceContext.Provider>
  );
};