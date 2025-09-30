import React from "react";
import { 
  FaTasks,          // Misiones
  FaAward,          // Insignias
  FaUserAlt,        // Ranking Individual
  FaUsers,          // Ranking Unidad
  FaInfoCircle,     // Información de Unidad
  FaBell,           // Notificaciones
  FaCalendarAlt,    // Resumen de Temporada


} from "react-icons/fa";

export const SidebarConquistador = ({ setModuloActivo, moduloActivo }) => {
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
    <div className="sidebar">
      {botones.map((btn) => (
        <button
          key={btn.name}
          className={moduloActivo === btn.name ? "active" : ""}
          onClick={() => setModuloActivo(btn.name)}
        >
          <span className="icon">{btn.icon}</span>
          <span className="label">{btn.label}</span>
        </button>
      ))}
    </div>
  );
};
