import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
import { FaSignOutAlt, FaBars } from "react-icons/fa";

export const HeaderConquistado = ({ toggleSidebar, mostrarHamburguesa = true }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="header">
      {mostrarHamburguesa && (
        <button onClick={toggleSidebar} className="hamburger-header"><FaBars /></button>
      )}
      <div>Bienvenido, <span className="user-name">{user?.nombre || "Conquistador"}</span></div>
      <button onClick={logout} className="logout-btn"><FaSignOutAlt /> Cerrar sesión</button>
    </div>
  );
};
