import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
import {
  listarMisionesUsuario,
  listarMisionesUnidadUsuario,
  listarInsignias,
  rankingIndividual,
  rankingUnidad,
  infoUnidad,
  listarNotificaciones,
  resumenTemporada,
  infoUsuario
} from "../api/apiConquistador.js";

import { SidebarConquistador } from "../components/SidebarConquistador.jsx";
import { HeaderConquistado } from "../components/HeaderConquistador.jsx";
import MisionList from "../components/MisionList.jsx";
import Insignias from "../components/Insignias.jsx";
import RankingIndividual from "../components/RankingIndividual.jsx";
import RankingUnidad from "../components/RankingUnidad.jsx";
import UnidadInfo from "../components/UnidadInfo.jsx";
import Notificaciones from "../components/Notificaciones.jsx";
import TemporadaResumen from "../components/TemporadaResumen.jsx";
import { AvatarModal } from "../components/AvatarModal.jsx";
import { TiendaRPG } from "../components/TiendaRPG.jsx";

import "../style.css";

const rangos = [
  "Novato","Recluta","Soldado","Guerrero","Veterano",
  "Héroe","Campeón","Maestro","Élite","Leyenda"
];

const colorXP = (nivel) => {
  switch (nivel) {
    case 1: return "#a0a0a0";
    case 2: return "#28a745";
    case 3: return "#007bff";
    case 4: return "#dc3545";
    case 5: return "#fd7e14";
    case 6: return "#ffd700";
    case 7: return "#6f42c1";
    case 8: return "#17a2b8";
    case 9: return "linear-gradient(90deg, #dfe9f3, #ffffff)";
    case 10: return "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)";
    default: return "#28a745";
  }
};

const ConquistadorDashboard = () => {
  const [misionesIndividuales, setMisionesIndividuales] = useState([]);
  const [misionesUnidad, setMisionesUnidad] = useState([]);
  const [insignias, setInsignias] = useState([]);
  const [rankingInd, setRankingInd] = useState([]);
  const [rankingUni, setRankingUni] = useState([]);
  const [unidad, setUnidad] = useState({});
  const [notificaciones, setNotificaciones] = useState([]);
  const [temporada, setTemporada] = useState({});
  const [usuario, setUsuario] = useState({ avatar: "/default-avatar.png", xp: 0, nivel: 1 });
  const [moduloActivo, setModuloActivo] = useState("perfil"); // PERFIL inicial
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [tiendaOpen, setTiendaOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          misionesIndRes,
          misionesUniRes,
          insigniasRes,
          rankingIndRes,
          rankingUniRes,
          unidadRes,
          notificacionesRes,
          temporadaRes,
          usuarioRes
        ] = await Promise.all([
          listarMisionesUsuario(),
          listarMisionesUnidadUsuario(),
          listarInsignias(),
          rankingIndividual(),
          rankingUnidad(),
          infoUnidad(),
          listarNotificaciones(),
          resumenTemporada(),
          infoUsuario()
        ]);

        setMisionesIndividuales(misionesIndRes.data?.data?.individuales || []);
        setMisionesUnidad(misionesUniRes.data?.data || []);
        setInsignias(insigniasRes.data || []);
        setRankingInd(rankingIndRes.data || []);

        const unidadesRaw = rankingUniRes.data?.data || [];
        const unidades = unidadesRaw.map(u => ({
          id_unidad: u.id_unidad,
          nombre_unidad: u.nombre_unidad || u.nombre,
          ranking: (u.ranking || []).map(m => ({
            id_usuario: m.id_usuario,
            nombre: m.nombre,
            misiones_completadas: m.misiones_completadas || 0
          }))
        }));
        setRankingUni(unidades);

        setUnidad(unidadRes.data?.data || {});
        setNotificaciones(notificacionesRes.data?.data || {});
        setTemporada(temporadaRes.data?.data || {});

        const usuarioData = usuarioRes.data?.data || {};
        setUsuario({
          ...usuarioData,
          avatar: usuarioData.avatar || "/default-avatar.png"
        });

      } catch (err) {
        console.error("Error cargando datos del dashboard:", err);
      }
    };

    fetchData();
  }, []);

  const actualizarAvatar = (url) => setUsuario(prev => ({ ...prev, avatar: url }));

  const handleModuloActivo = (modulo) => {
    if (modulo === "tienda") setTiendaOpen(true);
    else setModuloActivo(modulo);
  };

  const misionesCompletadasCount =
    (misionesIndividuales.filter(m => m.estado === "completada").length || 0) +
    (misionesUnidad.filter(m => m.estado === "completada").length || 0);

  const xpActual = usuario.xp % 1000;
  const xpMax = 1000;
  const porcentajeXP = Math.min(100, (xpActual / xpMax) * 100);

  const renderModulo = () => {
    switch (moduloActivo) {
      case "perfil":
        return (
          <div className="perfil-rpg">
            <div className="avatar-section">
              <img
                src={usuario.avatar || "/default-avatar.png"}
                alt="Avatar"
              />
              <h2>{usuario.nombre || user?.nombre || "Conquistador"}</h2>
              <p>{rangos[usuario.nivel - 1] || "Novato"}</p>
              <div className="barra-xp-container">
                <div className="barra-xp">
                  <div className="progreso-xp" style={{ width: `${porcentajeXP}%`, background: colorXP(usuario.nivel) }}></div>
                  <span>{xpActual} / {xpMax} XP</span>
                </div>
              </div>
              <div className="botones-avatar">
                <button onClick={() => setAvatarModalOpen(true)}>Cambiar Avatar</button>
                <button onClick={() => setTiendaOpen(true)}>Tienda</button>
              </div>
            </div>
            <div className="stats-section">
              <div className="stat-card">🎯 Misiones: {misionesCompletadasCount}</div>
              <div className="stat-card">🏅 Insignias: {insignias.length}</div>
              <div className="stat-card">💰 Monedas: {usuario.monedas || 0}</div>
              <div className="stat-card">💎 Gemas: {usuario.gemas || 0}</div>
            </div>
          </div>
        );
      case "misiones":
        return <MisionList misionesIndividuales={misionesIndividuales} misionesUnidad={misionesUnidad} usuario={usuario} setUsuario={setUsuario} />;
      case "insignias": return <Insignias insignias={insignias} />;
      case "rankingIndividual": return <RankingIndividual ranking={rankingInd} />;
      case "rankingUnidad": return <RankingUnidad ranking={rankingUni} />;
      case "unidad": return <UnidadInfo unidad={unidad} />;
      case "notificaciones": return <Notificaciones notificaciones={notificaciones} />;
      case "temporada": return <TemporadaResumen temporada={temporada} />;
      default: return <MisionList misionesIndividuales={misionesIndividuales} misionesUnidad={misionesUnidad} usuario={usuario} setUsuario={setUsuario} />;
    }
  };

  return (
    <div className="dashboard-container">
      <SidebarConquistador
        setModuloActivo={handleModuloActivo}
        moduloActivo={moduloActivo}
        drawerOpen={sidebarOpen}
        setDrawerOpen={setSidebarOpen}
      />

      <div className="main-content">
        <HeaderConquistado toggleSidebar={toggleSidebar} mostrarHamburguesa={moduloActivo !== "perfil"} />
        <div className="modulo-rpg">{renderModulo()}</div>
      </div>

      {avatarModalOpen && <AvatarModal onClose={() => setAvatarModalOpen(false)} actualizarAvatar={actualizarAvatar} />}
      {tiendaOpen && <TiendaRPG onClose={() => setTiendaOpen(false)} unidad={unidad} setUnidad={setUnidad} insignias={insignias} setInsignias={setInsignias} />}
    </div>
  );
};

export default ConquistadorDashboard;
