import React from "react";
import { 
  FaTasks, FaAward, FaUserAlt, FaUsers, 
  FaInfoCircle, FaBell, FaCalendarAlt, FaTimes 
} from "react-icons/fa";

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
      <div className={`sidebar ${drawerOpen ? "active" : ""}`}>
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
    </>
  );
};
