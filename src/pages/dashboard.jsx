import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";

import { Sidebar } from "../components/Sidebar.jsx";
import { Header } from "../components/Header.jsx";

import { UsuariosList } from "../components/usuario/UsuariosList.jsx";
import { UnidadList } from "../components/unidad/UnidadList.jsx";
import { MisionList } from "../components/mision/MisionList.jsx";
import { Gamificacion } from "../components/gamificacion/Gamificacion.jsx";
import { ArticuloList } from "../components/tienda/ArticuloList.jsx";
import { Logs } from "../components/Auditoria/Logs.jsx";
import { Configuracion } from "../components/Configuracion/Configuracion.jsx";

import "../style.css";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [moduloActivo, setModuloActivo] = useState("usuarios");

  const renderModulo = () => {
    switch (moduloActivo) {
      case "usuarios": return <UsuariosList />;
      case "unidades": return <UnidadList />;
      case "misiones": return <MisionList user={user} />;
      case "gamificacion": return <Gamificacion />;
      case "tienda": return <ArticuloList />;
      case "auditoria": return <Logs />;
      case "configuracion": return <Configuracion />;
      default: return <UsuariosList />;
    }
  };

  if (!user) return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>No has iniciado sesión</h2>
      <p>Por favor, ingresa para acceder al Dashboard.</p>
    </div>
  );

  return (
    <div className="dashboard-container">
      <Sidebar setModuloActivo={setModuloActivo} />
      <div className="main-content">
        <Header />
        <div className="modulo-container">
          {renderModulo()}
        </div>
      </div>
    </div>
  );
}
