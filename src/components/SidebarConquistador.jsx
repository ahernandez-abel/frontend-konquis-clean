// src/components/SidebarConquistador.jsx
import React from "react";
import { FaTasks, FaAward, FaUserAlt, FaUsers, FaInfoCircle, FaBell, FaCalendarAlt, FaTimes } from "react-icons/fa";

export const SidebarConquistador = ({ setModuloActivo, moduloActivo, drawerOpen, setDrawerOpen }) => {
  const botones = [
    { name: "misiones", label: "Misiones", icon: <FaTasks /> },
    { name: "insignias", label: "Insignias", icon: <FaAward /> },
    { name: "rankingIndividual", label: "Ranking Individual", icon: <FaUserAlt /> },
    { name: "rankingUnidad", label: "Ranking Unidad", icon: <FaUsers /> },
    { name: "unidad", label: "Mi Unidad", icon: <FaInfoCircle /> },
    { name: "notificaciones", label: "Notificaciones", icon: <FaBell /> },
    { name: "temporada", label: "Resumen de Temporada", icon: <FaCalendarAlt /> },
  ];

  return (
    <>
      <div className={`sidebar ${drawerOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button className="close-btn" onClick={() => setDrawerOpen(false)}>
            <FaTimes />
          </button>
        </div>
        {botones.map((btn) => (
          <button
            key={btn.name}
            className={`sidebar-btn ${moduloActivo === btn.name ? "active" : ""}`}
            onClick={() => {
              setModuloActivo(btn.name);
              setDrawerOpen(false);
            }}
          >
            <span className="icon">{btn.icon}</span>
            <span className="label">{btn.label}</span>
          </button>
        ))}
      </div>

      <div 
        className={`overlay ${drawerOpen ? "show" : ""}`} 
        onClick={() => setDrawerOpen(false)}
      ></div>

      <style>{`
        /* --- SIDEBAR DESKTOP --- */
        .sidebar {
          background: #1b1b1b;
          color: #fff;
          width: 220px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 100;
          transition: transform 0.3s ease;
        }
        .sidebar-btn {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          border: none;
          background: none;
          color: #fff;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .sidebar-btn:hover { background: #333; }
        .sidebar-btn.active { background: #28a745; color: #fff; }
        .sidebar-btn .icon { font-size: 1.2rem; margin-right: 10px; width: 25px; text-align: center; }

        /* --- DRAWER MÓVIL --- */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open { transform: translateX(0); }
          .overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 99;
          }
          .overlay.show { display: block; }
          .sidebar-header { display: flex; justify-content: flex-end; padding: 10px; }
          .close-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
        }
      `}</style>
    </>
  );
};
