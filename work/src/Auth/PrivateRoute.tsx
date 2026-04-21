// src/auth/PrivateRoute.tsx
import React, { type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />;
};
