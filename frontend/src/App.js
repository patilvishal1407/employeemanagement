import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import EquipmentList from "./components/EquipmentList";
import EquipmentForm from "./components/EquipmentForm";
import WorkOrderList from "./components/WorkOrderList";
import WorkOrderForm from "./components/WorkOrderForm";
import Layout from "./components/layout/Layout";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import { ToastProvider } from "./context/ToastContext";

function RoleRedirect() {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  // Redirect based on maintenance app roles
  if (user.role === "manager" || user.role === "supervisor") {
    return <Navigate to="/equipment" replace />;
  }
  return <Navigate to="/workorders" replace />;
}

function ProtectedRoute({ children }) {
  const { token, loading } = React.useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RoleRedirect />} />
            {/* Maintenance app */}
            <Route path="equipment" element={<EquipmentList />} />
            <Route path="equipment/new" element={<EquipmentForm />} />
            <Route path="equipment/:id" element={<EquipmentForm />} />
            <Route path="workorders" element={<WorkOrderList />} />
            <Route path="workorders/new" element={<WorkOrderForm />} />
            <Route path="workorders/:id" element={<WorkOrderForm />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>

            <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
