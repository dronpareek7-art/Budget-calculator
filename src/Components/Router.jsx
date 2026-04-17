import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";
import { lazy } from "react";
const Calculator = lazy(() => import("../pages/Calculator"));
const Analytics = lazy(() => import("../pages/Analytics"));
const Profile = lazy(() => import("../pages/Profile"));
const Login = lazy(() => import("../pages/Login"));

const Router = ({ transactions, setTransactions, user, setUser }) => {
  return (
    <BrowserRouter>
      {user && (
        <Navbar
          user={user}
          setUser={setUser}
          setTransactions={setTransactions}
        />
      )}
      <Suspense fallback={<h2>Loading...</h2>}>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Calculator
                  transactions={transactions}
                  setTransactions={setTransactions}
                  user={user}
                  setUser={setUser}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute user={user}>
                <Analytics transactions={transactions} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile user={user} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
