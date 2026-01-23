import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Loading from "./components/ui/Loading";

// --- LAZY IMPORTS (Carregamento Dinâmico) ---
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const Categories = lazy(() => import("./pages/admin/Categories"));
const Login = lazy(() => import("./pages/public/Login"));
const NotFound = lazy(() => import("./pages/public/NotFound"));
const AdminPanel = lazy(() => import("./pages/admin/AdminPanel"));

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  // Se o user estiver undefined (ainda carregando auth), poderia mostrar loading também
  return user ? children : <Navigate to="/login" />;
};

export default function Router() {
  return (
    // Suspense envolve TODAS as rotas para mostrar o Loading enquanto o arquivo baixa
    <Suspense fallback={<Loading message="Organizando suas finanças..." />}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />

        <Route path="/settings" element={
          <PrivateRoute><Settings /></PrivateRoute>
        } />

        <Route path="/categories" element={
          <PrivateRoute><Categories /></PrivateRoute>
        } />

        <Route path="*" element={<NotFound />} />

        <Route path="/admin" element={
          <PrivateRoute><AdminPanel /></PrivateRoute>
        } />

      </Routes>
    </Suspense>
  );
}