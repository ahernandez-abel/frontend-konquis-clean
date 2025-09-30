// src/components/Header.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
import { FaSignOutAlt } from "react-icons/fa";

export const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="header">
      <div>
        Bienvenido, <span style={{ color: "#ffdd57" }}>{user?.nombre || "Admin"}</span>
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
    </div>
  );
};
