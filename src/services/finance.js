import { db } from './firebase';
import {
  collection, addDoc, doc, deleteDoc, updateDoc,
  onSnapshot, query, orderBy, Timestamp
} from 'firebase/firestore';

// --- TRANSAÇÕES (Ganhos/Gastos) ---

// Adicionar
export const createTransaction = async (data) => {
  try {
    await addDoc(collection(db, "transactions"), {
      ...data,
      date: Timestamp.fromDate(new Date(data.date)), // Converte JS Date para Firestore Timestamp
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Erro ao criar transação:", error);
  }
};

// Ouvir (Realtime)
export const subscribeToTransactions = (callback) => {
  // Pega todas, ordenadas por data. 
  // (Em app grande, filtraríamos por mês aqui, mas para pessoal isso funciona bem)
  const q = query(collection(db, "transactions"), orderBy("date", "desc"));

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate() // Converte de volta para JS Date
    }));
    callback(data);
  });
};

// --- PLANOS RECORRENTES (Parcelados/Empréstimos) ---

// Adicionar Plano
export const createRecurringPlan = async (planData) => {
  /* planData: { title, totalDebt, installments: [...], ... } */
  try {
    // Tratamento de datas dentro das parcelas
    const sanitizedInstallments = planData.installments.map(inst => ({
      ...inst,
      dueDate: Timestamp.fromDate(new Date(inst.dueDate))
    }));

    await addDoc(collection(db, "recurring_plans"), {
      ...planData,
      installments: sanitizedInstallments,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Erro ao criar plano:", error);
  }
};

// Ouvir Planos
export const subscribeToPlans = (callback) => {
  const q = query(collection(db, "recurring_plans"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => {
      const raw = doc.data();
      return {
        id: doc.id,
        ...raw,
        // Converte as datas das parcelas de volta
        installments: raw.installments.map(inst => ({
          ...inst,
          dueDate: inst.dueDate.toDate()
        }))
      };
    });
    callback(data);
  });
};

// Atualizar Plano (Ex: Marcar parcela como paga)
export const updatePlan = async (planId, newData) => {
  try {
    // Se houver parcelas na atualização, precisa sanitizar as datas de novo
    if (newData.installments) {
      newData.installments = newData.installments.map(inst => ({
        ...inst,
        dueDate: inst.dueDate instanceof Date ? Timestamp.fromDate(inst.dueDate) : inst.dueDate
      }));
    }

    const docRef = doc(db, "recurring_plans", planId);
    await updateDoc(docRef, newData);
  } catch (error) {
    console.error("Erro ao atualizar plano:", error);
  }
};

// Deletar Plano
export const removePlan = async (planId) => {
  try {
    await deleteDoc(doc(db, "recurring_plans", planId));
  } catch (error) {
    console.error("Erro ao deletar:", error);
  }
};