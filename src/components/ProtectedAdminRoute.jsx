import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    // No autenticado
    return <Navigate to="/login" />;
  }

  if (user?.rol !== "Administrador") {
    // Autenticado pero no admin
    return <Navigate to="/" />;
  }

  // Es admin
  return children;
}