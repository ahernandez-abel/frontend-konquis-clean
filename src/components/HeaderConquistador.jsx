// src/components/HeaderConquistado.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
import { FaSignOutAlt, FaBars } from "react-icons/fa";

export const HeaderConquistado = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="header">
      {/* Botón hamburguesa móvil */}
      <button onClick={toggleSidebar} className="hamburger-header">
        <FaBars />
      </button>

      <div>
        Bienvenido, <span className="user-name">{user?.nombre || "Conquistador"}</span>
      </div>

      <button onClick={logout} className="logout-btn">
        <FaSignOutAlt /> Cerrar sesión
      </button>

      <style>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #1b1b1b;
          color: #fff;
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .user-name { color: #ffdd57; }
        .hamburger-header { display: none; font-size: 1.5rem; color: #ffd700; background: none; border: none; cursor: pointer; }
        .logout-btn {
          background: rgba(255,221,87,0.2);
          border: none;
          border-radius: 12px;
          padding: 8px 12px;
          color: #111;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: all 0.3s ease;
        }
        .logout-btn:hover { background: #ffdd57; }
        @media (max-width: 768px) {
          .hamburger-header { display: inline-block; }
        }
      `}</style>
    </div>
  );
};
