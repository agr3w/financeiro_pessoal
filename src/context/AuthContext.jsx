import React, { createContext, useState, useEffect, useContext } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updatePassword,      // <--- Novo
    deleteUser,          // <--- Novo
    reauthenticateWithCredential, // <--- Novo
    EmailAuthProvider    // <--- Novo
} from "firebase/auth";
import { auth } from "../services/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    // --- NOVAS FUNÇÕES DE SEGURANÇA ---

    // Alterar Senha
    const updateUserPassword = async (currentPassword, newPassword) => {
        if (!user) throw new Error("Usuário não autenticado");

        // 1. Re-autenticar para garantir segurança
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // 2. Atualizar senha
        await updatePassword(user, newPassword);
    };

    // Deletar Conta
    const deleteUserAccount = async (currentPassword) => {
        if (!user) throw new Error("Usuário não autenticado");

        // 1. Re-autenticar
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // 2. Deletar
        await deleteUser(user);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        user,
        signup,
        login,
        logout,
        updateUserPassword, // Exporta nova função
        deleteUserAccount   // Exporta nova função
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};