import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

const ProtectedComponent = ({ children }) => {
  const { user } = useAuth();

  if (!user || user === "null") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedComponent;
