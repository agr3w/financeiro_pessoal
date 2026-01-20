import { db } from './firebase';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, orderBy } from 'firebase/firestore';

// 1. Adicionar Transação Rápida (Smart Add)
export const addTransaction = async (userId, data) => {
  /* data espera: { 
      amount: number, 
      category: string, 
      type: 'income' | 'expense', 
      date: timestamp,
      description: string (opcional)
    } 
  */
  try {
    const docRef = await addDoc(collection(db, "transactions"), {
      ...data,
      userId,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar transação: ", error);
  }
};

// 2. Buscar Saldo e Transações
export const getMonthTransactions = async (userId, month, year) => {
  // Lógica para filtrar por data (query do firestore)
  // ...
};

// 3. Abater Parcela de Empréstimo (A mágica da integração)
export const payInstallment = async (userId, loanId, installmentValue, transactionData) => {
  // Passo A: Cria a transação de saída no extrato
  await addTransaction(userId, transactionData);

  // Passo B: Atualiza o documento do empréstimo (diminui o saldo devedor)
  const loanRef = doc(db, "recurring_plans", loanId);
  // Aqui você buscaria o doc atual e atualizaria o 'paidAmount'
  // ...
};