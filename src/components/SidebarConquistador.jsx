import React, { useState } from "react";
import { 
  FaTasks,          
  FaAward,          
  FaUserAlt,        
  FaUsers,          
  FaInfoCircle,     
  FaBell,           
  FaCalendarAlt,    
  FaBars,
  FaTimes
} from "react-icons/fa";

export const SidebarConquistador = ({ setModuloActivo, moduloActivo }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      {/* Botón hamburguesa visible solo en móvil */}
      <div className="hamburger" onClick={() => setDrawerOpen(true)}>
        <FaBars />
      </div>

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
              setDrawerOpen(false); // cierra drawer en móvil al seleccionar
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
        /* HAMBURGUESA */
        .hamburger {
          display: none;
          position: fixed;
          top: 15px;
          left: 15px;
          z-index: 1001;
          background: #1b1b1b;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          color: #fff;
          font-size: 1.5rem;
        }

        .sidebar {
          background: #1b1b1b;
          color: #fff;
          width: 220px;
          height: 100vh;
          display: flex;
          flex-direction: column;
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

        .sidebar-btn .icon {
          font-size: 1.2rem;
          margin-right: 10px;
          display: flex;
          justify-content: center;
          width: 25px;
        }

        /* Drawer móvil */
        @media (max-width: 768px) {
          .hamburger { display: block; }
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 220px;
            transform: translateX(-100%);
            z-index: 1000;
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
          }
          .overlay.show { display: block; }
          .sidebar-header { display: flex; justify-content: flex-end; padding: 10px; }
          .close-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
        }
      `}</style>
    </>
  );
};
