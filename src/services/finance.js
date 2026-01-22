import { db } from './firebase';
import { 
  collection, addDoc, deleteDoc, updateDoc, doc, 
  onSnapshot, query, orderBy, where, Timestamp 
} from 'firebase/firestore';

// --- TRANSAÇÕES ---

// userId é obrigatório agora para vincular o dado ao usuário
export const createTransaction = async (userId, data) => { 
  try {
    await addDoc(collection(db, "transactions"), {
      ...data,
      userId, // Salva o dono do dado
      date: Timestamp.fromDate(new Date(data.date)),
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Erro ao criar transação:", error);
  }
};

export const subscribeToTransactions = (userId, callback) => {
  if (!userId) return () => {}; // Se não tiver usuário, não faz nada (segurança)

  // FILTRO DE SEGURANÇA: where("userId", "==", userId)
  const q = query(
    collection(db, "transactions"), 
    where("userId", "==", userId), 
    orderBy("date", "desc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    }));
    callback(data);
  });
};

// --- PLANOS RECORRENTES ---

export const createRecurringPlan = async (userId, planData) => {
  try {
    const sanitizedInstallments = planData.installments.map(inst => ({
      ...inst,
      dueDate: Timestamp.fromDate(new Date(inst.dueDate))
    }));

    await addDoc(collection(db, "recurring_plans"), {
      ...planData,
      userId, // Salva o dono
      installments: sanitizedInstallments,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Erro ao criar plano:", error);
  }
};

export const subscribeToPlans = (userId, callback) => {
  if (!userId) return () => {}; 

  const q = query(
    collection(db, "recurring_plans"), 
    where("userId", "==", userId), 
    orderBy("createdAt", "desc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => {
      const raw = doc.data();
      return {
        id: doc.id,
        ...raw,
        installments: raw.installments.map(inst => ({
          ...inst,
          dueDate: inst.dueDate.toDate() // Converte timestamp de volta para Date
        }))
      };
    });
    callback(data);
  });
};

// --- OPERAÇÕES GERAIS (Update/Delete) ---
// Estas funções operam pelo ID do documento, então não precisam mudar a assinatura,
// mas as regras de segurança do Firebase (Firestore Rules) devem garantir que só o dono edite.

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

export const removePlan = async (planId) => {
  try {
    await deleteDoc(doc(db, "recurring_plans", planId));
  } catch (error) {
    console.error("Erro ao deletar:", error);
  }
};

// Adicionando suporte para deletar transações também (caso precise no futuro)
export const removeTransaction = async (transactionId) => {
  try {
    await deleteDoc(doc(db, "transactions", transactionId));
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
  }
};

// --- CATEGORIAS PERSONALIZADAS ---

export const createCategory = async (userId, categoryData) => {
  /* categoryData: { label: "Jogos", color: "#FF0000", iconKey: "game" } */
  try {
    await addDoc(collection(db, "categories"), {
      ...categoryData,
      userId,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
  }
};

export const subscribeToCategories = (userId, callback) => {
  if (!userId) return () => {}; 
  
  const q = query(
    collection(db, "categories"), 
    where("userId", "==", userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

export const removeCategory = async (categoryId) => {
  try {
    await deleteDoc(doc(db, "categories", categoryId));
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
  }
};