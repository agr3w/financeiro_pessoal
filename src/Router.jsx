import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/public/Login";
import Settings from "./pages/admin/Settings";
import { useAuth } from "./context/AuthContext";
import Categories from "./pages/admin/Categories";

// Componente para proteger rotas privadas
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  // Enquanto o firebase verifica o login, pode retornar null ou um spinner
  // Aqui assumimos que se user for null, vai pro login
  return user ? children : <Navigate to="/login" />;
};

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route path="/categories" element={
        <PrivateRoute><Categories /></PrivateRoute>
      } />
    </Routes>
  );
}