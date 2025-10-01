import React, { useState } from "react";
import { 
  FaTasks,          
  FaAward,          
  FaUserAlt,        
  FaUsers,          
  FaInfoCircle,     
  FaBell,           
  FaCalendarAlt,    
  FaBars
} from "react-icons/fa";

export const SidebarConquistador = ({ setModuloActivo, moduloActivo }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FaBars />
        </div>
        {botones.map((btn) => (
          <button
            key={btn.name}
            className={`sidebar-btn ${moduloActivo === btn.name ? "active" : ""}`}
            onClick={() => setModuloActivo(btn.name)}
          >
            <span className="icon">{btn.icon}</span>
            {sidebarOpen && <span className="label">{btn.label}</span>}
          </button>
        ))}
      </div>

      <style>{`
        .sidebar {
          background: #1b1b1b;
          color: #fff;
          width: 220px;
          min-width: 60px;
          transition: width 0.3s;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          position: relative;
        }

        .sidebar.closed {
          width: 60px;
        }

        .sidebar-toggle {
          display: none;
          padding: 15px;
          font-size: 1.5rem;
          cursor: pointer;
          text-align: center;
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
          white-space: nowrap;
        }

        .sidebar-btn:hover {
          background: #333;
        }

        .sidebar-btn.active {
          background: #28a745;
          color: #fff;
        }

        .sidebar-btn .icon {
          font-size: 1.2rem;
          margin-right: 10px;
          display: flex;
          justify-content: center;
          width: 25px;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .sidebar {
            position: fixed;
            z-index: 1000;
            height: 100%;
            top: 0;
            left: 0;
            transform: translateX(0);
            width: ${sidebarOpen ? "220px" : "0"};
          }

          .sidebar-toggle {
            display: block;
            position: absolute;
            top: 10px;
            right: -45px;
            background: #1b1b1b;
            border-radius: 5px;
          }
        }

        @media (max-width: 768px) {
          .sidebar-btn .label {
            font-size: 0.8rem;
          }
          .sidebar-btn { padding: 10px; }
        }

        @media (max-width: 480px) {
          .sidebar-btn .label { display: none; }
          .sidebar { width: ${sidebarOpen ? "150px" : "0"}; }
        }
      `}</style>
    </>
  );
};
