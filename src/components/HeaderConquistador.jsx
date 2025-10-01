// src/components/HeaderConquistado.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
import { FaSignOutAlt, FaBars } from "react-icons/fa";

export const HeaderConquistado = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="header" style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 20px",
      background: "#1b1b1b",
      color: "#fff",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      {/* Botón hamburguesa móvil */}
      <button 
        onClick={toggleSidebar} 
        className="hamburger-header"
      >
        <FaBars />
      </button>

      <div>
        Bienvenido, <span style={{ color: "#ffdd57" }}>{user?.nombre || "Conquistador"}</span>
      </div>

      <button
        onClick={logout}
        style={{
          background: "rgba(255,221,87,0.2)",
          border: "none",
          borderRadius: "12px",
          padding: "8px 12px",
          color: "#111",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.background = "#ffdd57")}
        onMouseLeave={(e) => (e.target.style.background = "rgba(255,221,87,0.2)")}
      >
        <FaSignOutAlt /> Cerrar sesión
      </button>

      <style>{`
        .hamburger-header { display: none; font-size: 1.5rem; color: #ffd700; background: none; border: none; cursor: pointer; }
        @media (max-width: 768px) {
          .hamburger-header { display: inline-block; }
        }
      `}</style>
    </div>
  );
};
