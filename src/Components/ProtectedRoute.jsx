import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
  if (user === undefined) {
    return <h2>Loading...</h2>;
  }

  if (user === null) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;