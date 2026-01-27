import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Loading from "./components/ui/Loading";
import AppLayout from "./components/layout/AppLayout";

// Lazy loading das páginas
const Login = lazy(() => import("./pages/public/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Categories = lazy(() => import("./pages/admin/Categories"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const AdminPanel = lazy(() => import("./pages/admin/AdminPanel"));
const NotFound = lazy(() => import("./pages/public/NotFound"));

// Componente para proteger rotas privadas
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

export default function Router() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* ROTA PÚBLICA */}
        <Route path="/login" element={<Login />} />

        {/* ROTAS PRIVADAS (Com o Layout Novo) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout title="Dashboard" subtitle="Visão geral das finanças">
                <Dashboard />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <AppLayout
                title="Categorias"
                subtitle="Gerencie seus grupos de gastos"
              >
                <Categories />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <AppLayout
                title="Configurações"
                subtitle="Personalize sua experiência"
              >
                <Settings />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AppLayout title="Painel Admin" subtitle="Controle do sistema">
                <AdminPanel />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
