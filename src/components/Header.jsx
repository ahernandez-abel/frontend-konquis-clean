// src/components/Header.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
import { FaSignOutAlt } from "react-icons/fa";

export const Header = ({ drawerOpen, setDrawerOpen }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="header">
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* Botón hamburguesa */}
        <div 
          className={`hamburger ${drawerOpen ? "open" : ""}`}
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div>
          Bienvenido, <span className="user-nombre">{user?.nombre || "Admin"}</span>
        </div>
      </div>

      <button className="logout-btn" onClick={logout}>
        <FaSignOutAlt /> Cerrar sesión
      </button>
    </div>
  );
};
