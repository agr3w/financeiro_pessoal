import { db } from './firebase';
import { 
  collection, addDoc, deleteDoc, updateDoc, doc, // Removido 'fs' daqui
  onSnapshot, query, where, Timestamp, setDoc 
} from 'firebase/firestore';

// --- TRANSAÇÕES ---

export const createTransaction = async (userId, data) => {
  try {
    await addDoc(collection(db, "transactions"), {
      ...data,
      userId,
      date: Timestamp.fromDate(new Date(data.date)),
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Erro ao criar transação:", error);
  }
};

export const subscribeToTransactions = (userId, callback) => {
  // REMOVIDO: orderBy("date", "desc") para evitar erro de índice
  const q = query(
    collection(db, "transactions"), 
    where("userId", "==", userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date ? doc.data().date.toDate() : new Date()
    }));
    
    // ORDENAÇÃO NO CLIENTE (Mais seguro para projetos iniciais)
    // Do mais recente para o mais antigo
    data.sort((a, b) => b.date - a.date);
    
    callback(data);
  });
};

// --- PLANOS RECORRENTES (AQUI ESTAVA O PROBLEMA PRINCIPAL) ---

export const createRecurringPlan = async (userId, planData) => {
  try {
    // Sanitizar as datas das parcelas para Timestamp do Firestore
    const sanitizedInstallments = planData.installments.map(inst => ({
      ...inst,
      dueDate: Timestamp.fromDate(new Date(inst.dueDate))
    }));

    await addDoc(collection(db, "recurring_plans"), {
      ...planData,
      userId,
      installments: sanitizedInstallments,
      createdAt: Timestamp.now()
    });
    console.log("Plano criado com sucesso no banco!");
  } catch (error) {
    console.error("Erro CRÍTICO ao criar plano:", error);
  }
};

export const subscribeToPlans = (userId, callback) => {
  // REMOVIDO: orderBy("createdAt", "desc")
  const q = query(
    collection(db, "recurring_plans"), 
    where("userId", "==", userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => {
      const raw = doc.data();
      return {
        id: doc.id,
        ...raw,
        // Converte datas das parcelas de volta para JS Date
        installments: raw.installments ? raw.installments.map(inst => ({
          ...inst,
          dueDate: inst.dueDate.toDate()
        })) : []
      };
    });

    // Ordena por data de criação (se existir)
    data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    callback(data);
  }, (error) => {
    console.error("Erro ao buscar planos:", error); // Log de erro no console
  });
};

export const updatePlan = async (planId, newData) => {
  try {
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
    console.error("Erro ao deletar plano:", error);
  }
};

// --- CATEGORIAS ---

export const createCategory = async (userId, categoryData) => {
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
  const q = query(collection(db, "categories"), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Ordena alfabeticamente
    data.sort((a, b) => a.label.localeCompare(b.label));
    callback(data);
  });
};

export const updateCategory = async (categoryId, newData) => {
  try {
    const docRef = doc(db, "categories", categoryId);
    await updateDoc(docRef, newData);
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
  }
};

export const removeCategory = async (categoryId) => {
  try {
    await deleteDoc(doc(db, "categories", categoryId));
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
  }
};

// --- SISTEMA DE NOTIFICAÇÕES GLOBAIS ---

// Criar Notificação (Só o Admin vai usar)
export const createSystemNotification = async (data) => {
  try {
    await addDoc(collection(db, "system_notifications"), {
      ...data,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Erro ao criar notificação:", error);
  }
};

// Ler Notificações (Todos usam)
export const subscribeToSystemNotifications = (callback) => {
  // Pega todas, ordenadas por data
  const q = query(
    collection(db, "system_notifications")
    // Sem 'orderBy' no banco para evitar aquele erro de índice, ordenamos no front
  );
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date()
    }));
    
    // Ordena: Mais recentes primeiro
    data.sort((a, b) => b.createdAt - a.createdAt);
    
    callback(data);
  });
};

// Deletar Notificação (Admin)
export const removeSystemNotification = async (id) => {
  try {
    await deleteDoc(doc(db, "system_notifications", id));
  } catch (error) {
    console.error("Erro ao deletar notificação:", error);
  }
};

// --- CONFIGURAÇÕES GLOBAIS DO SISTEMA ---

// Atualizar status de manutenção (Admin)
export const updatesystemSettings = async (settings) => {
  try {
    // Usamos setDoc com merge para criar se não existir ou atualizar
    await setDoc(doc(db, "system_settings", "general"), settings, { merge: true });
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
  }
};

// Ler configurações (Todas as telas)
export const subscribeToSystemSettings = (callback) => {
  return onSnapshot(doc(db, "system_settings", "general"), (docSnapshot) => {
    if (docSnapshot.exists()) {
      callback(docSnapshot.data());
    } else {
      // Valor padrão se não existir no banco ainda
      callback({ maintenanceMode: false });
    }
  });
};