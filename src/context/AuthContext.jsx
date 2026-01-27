import React, { createContext, useState, useEffect, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { checkAdminPermission } from "../services/finance"; // <--- Importe a função

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // <--- Novo Estado
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    // Limpa estado ao sair
    setIsAdmin(false);
    return signOut(auth);
  };

  // --- FUNÇÕES DE SEGURANÇA ---

  // Alterar Senha
  const updateUserPassword = async (currentPassword, newPassword) => {
    if (!user) throw new Error("Usuário não autenticado");

    // 1. Re-autenticar para garantir segurança
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );
    await reauthenticateWithCredential(user, credential);

    // 2. Atualizar senha
    await updatePassword(user, newPassword);
  };

  // Deletar Conta
  const deleteUserAccount = async (currentPassword) => {
    if (!user) throw new Error("Usuário não autenticado");

    // 1. Re-autenticar
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );
    await reauthenticateWithCredential(user, credential);

    // 2. Deletar
    await deleteUser(user);
  };

  // --- REGRAS DE AUTENTICAÇÃO E ADMIN ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Verifica no banco (ou lista hardcoded) se é admin
        // Essa chamada é assíncrona, por isso o async/await dentro do callback
        const adminStatus = await checkAdminPermission(currentUser.email);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }

      // Só libera o carregamento da tela depois de definir se é admin ou não
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    user,
    isAdmin, // <--- Exporta para o resto do app usar
    signup,
    login,
    logout,
    updateUserPassword,
    deleteUserAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
