// src/router/AppRouter.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/dashboard.jsx";
import ConquistadorDashboard from "../pages/ConquistadorDashboard.jsx";

export const AppRouter = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Si no está logueado → login */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />

        {/* Si es admin → dashboard admin */}
        <Route
          path="/dashboard/*"
          element={
            user ? (
              user.rol === "administrador" ? (
                <Dashboard />
              ) : (
                <Navigate to="/conquistador" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Si es conquistador → dashboard conquistador */}
        <Route
          path="/conquistador/*"
          element={
            user ? (
              user.rol === "conquistador" ? (
                <ConquistadorDashboard />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Default → si no existe la ruta */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};
