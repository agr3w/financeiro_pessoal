// src/Router.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard"; // Importe o Dashboard aqui

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}