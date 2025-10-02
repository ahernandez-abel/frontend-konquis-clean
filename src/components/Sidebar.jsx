// src/components/Sidebar.jsx
import React from "react";
import { FaUsers, FaBoxes, FaRocket, FaTrophy, FaShoppingCart, FaClipboardList, FaCog } from "react-icons/fa";

export const Sidebar = ({ setModuloActivo, drawerOpen, setDrawerOpen }) => {
  const botones = [
    { name: "usuarios", label: "Usuarios", icon: <FaUsers /> },
    { name: "unidades", label: "Unidades", icon: <FaBoxes /> },
    { name: "misiones", label: "Misiones", icon: <FaRocket /> },
    { name: "gamificacion", label: "Gamificación", icon: <FaTrophy /> },
    { name: "tienda", label: "Tienda", icon: <FaShoppingCart /> },
    { name: "auditoria", label: "Auditoría", icon: <FaClipboardList /> },
    { name: "configuracion", label: "Configuración", icon: <FaCog /> },
  ];

  const [activo, setActivo] = React.useState("usuarios");

  const handleClick = (name) => {
    setActivo(name);
    setModuloActivo(name);
    setDrawerOpen(false); // cierra menú en móvil
  };

  return (
    <>
      <div className={`sidebar ${drawerOpen ? "active" : ""}`}>
        {botones.map((btn) => (
          <button
            key={btn.name}
            className={activo === btn.name ? "active" : ""}
            onClick={() => handleClick(btn.name)}
          >
            <span style={{ marginRight: "10px" }}>{btn.icon}</span>
            {btn.label}
          </button>
        ))}
      </div>

      {/* Overlay para móvil */}
      <div 
        className={`overlay ${drawerOpen ? "show" : ""}`} 
        onClick={() => setDrawerOpen(false)}
      ></div>
    </>
  );
};
