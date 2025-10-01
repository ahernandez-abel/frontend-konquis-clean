// src/pages/ConquistadorDashboard.jsx
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
  const [moduloActivo, setModuloActivo] = useState("misiones");
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

        // --- USUARIO CON DATOS REALES DE LA DB ---
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

  const actualizarAvatar = (url) => {
    setUsuario(prev => ({ ...prev, avatar: url }));
  };

  const handleModuloActivo = (modulo) => {
    if (modulo === "tienda") setTiendaOpen(true);
    else setModuloActivo(modulo);
  };

  const renderModulo = () => {
    switch (moduloActivo) {
      case "misiones":
        return (
          <MisionList
            misionesIndividuales={misionesIndividuales}
            misionesUnidad={misionesUnidad}
            usuario={usuario}
            setUsuario={setUsuario}
          />
        );
      case "insignias": return <Insignias insignias={insignias} />;
      case "rankingIndividual": return <RankingIndividual ranking={rankingInd} />;
      case "rankingUnidad": return <RankingUnidad ranking={rankingUni} />;
      case "unidad": return <UnidadInfo unidad={unidad} />;
      case "notificaciones": return <Notificaciones notificaciones={notificaciones} />;
      case "temporada": return <TemporadaResumen temporada={temporada} />;
      default: return (
        <MisionList
          misionesIndividuales={misionesIndividuales}
          misionesUnidad={misionesUnidad}
          usuario={usuario}
          setUsuario={setUsuario}
        />
      );
    }
  };

  const misionesCompletadasCount =
    (misionesIndividuales.filter(m => m.estado === "completada").length || 0) +
    (misionesUnidad.filter(m => m.estado === "completada").length || 0);

  // --- CALCULO DE BARRA XP ---
  const xpActual = usuario.xp % 1000;
  const xpMax = 1000;
  const porcentajeXP = Math.min(100, (xpActual / xpMax) * 100);

  
   return (
    <div className="dashboard-container" style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarConquistador setModuloActivo={handleModuloActivo} moduloActivo={moduloActivo} drawerOpen={sidebarOpen} setDrawerOpen={setSidebarOpen} />
      <div className="main-content" style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <HeaderConquistado toggleSidebar={toggleSidebar} />
        
        <div className="rpg-dashboard">
          <div className="perfil-rpg" style={{ display: "flex", gap: "60px", alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* IZQUIERDA: AVATAR */}
            <div className="avatar-section" style={{ flex: "0 0 300px", textAlign: "center" }}>
              <img
                src={usuario.avatar || "/default-avatar.png"}
                alt="Avatar"
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #ffd700",
                  boxShadow: "0 0 25px #ffd700, 0 0 50px #ffd70088",
                  animation: "pulseAvatar 2s infinite"
                }}
              />

              <h2 style={{ margin: "10px 0 5px 0", fontFamily: "'Press Start 2P', cursive", color: "#ffd700" }}>
                {usuario.nombre || user?.nombre || "Conquistador"}
              </h2>
              <p style={{ margin: 0, fontWeight: "bold", color: "#fff" }}>{rangos[usuario.nivel - 1] || "Novato"}</p>

              <div className="barra-xp-container" style={{ margin: "15px auto", width: "260px" }}>
                <div className="barra-xp" style={{ background: "#333", height: "40px", borderRadius: "100px", overflow: "hidden", position: "relative", boxShadow: "0 0 5px #000" }}>
                  <div className="progreso-xp" style={{
                    width: `${porcentajeXP}%`,
                    background: colorXP(usuario.nivel),
                    height: "200%",
                    transition: "width 0.5s"
                  }}></div>
                  <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#fff", fontWeight: "bold", fontFamily: "'Press Start 2P', cursive" }}>
                    {xpActual} / {xpMax} XP
                  </span>
                </div>
              </div>

              <div style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => setAvatarModalOpen(true)} style={{ padding: "10px 14px", borderRadius: "8px", border: "2px solid #ffd700", background: "#1b1b1b", color: "#ffd700", fontWeight: "bold", cursor: "pointer" }}>
                  Cambiar Avatar
                </button>
                <button onClick={() => setTiendaOpen(true)} style={{ padding: "10px 14px", borderRadius: "8px", border: "2px solid #28a745", background: "#1b1b1b", color: "#28a745", fontWeight: "bold", cursor: "pointer" }}>
                  Tienda
                </button>
              </div>
            </div>

            {/* DERECHA: STATS */}
            <div className="stats-section" style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px", minWidth: "250px" }}>
              {[{ label: "🎯 Misiones", valor: misionesCompletadasCount },
                { label: "🏅 Insignias", valor: insignias.length },
                { label: "💰 Monedas", valor: usuario.monedas || 0 },
                { label: "💎 Gemas", valor: usuario.gemas || 0 }].map((stat, i) => (
                <div key={i} className="stat-card" style={{
                  background: "#1b1b1b",
                  padding: "15px",
                  borderRadius: "10px",
                  border: `2px solid ${usuario.nivel >= 9 ? "#fff" : colorXP(usuario.nivel || 1)}`,
                  textAlign: "center",
                  boxShadow: `0 0 8px ${usuario.nivel >= 9 ? "#fff" : colorXP(usuario.nivel || 1)}`,
                  transition: "all 0.3s"
                }}>
                  <span style={{ fontFamily: "'Press Start 2P', cursive", color: usuario.nivel >= 9 ? "#fff" : colorXP(usuario.nivel || 1) }}>
                    {stat.label}
                  </span>
                  <h4 style={{ marginTop: "5px", color: "#fff" }}>{stat.valor}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="modulo-rpg" style={{ marginTop: "30px" }}>
            {renderModulo()}
          </div>
        </div>
      </div>

      {avatarModalOpen && <AvatarModal onClose={() => setAvatarModalOpen(false)} actualizarAvatar={actualizarAvatar} />}
      {tiendaOpen && <TiendaRPG onClose={() => setTiendaOpen(false)} unidad={unidad} setUnidad={setUnidad} insignias={insignias} setInsignias={setInsignias} />}

      <style>{`
        @keyframes pulseAvatar {
          0% { box-shadow: 0 0 10px #ffd700, 0 0 20px #ffd70066; transform: scale(1); }
          50% { box-shadow: 0 0 25px #ffd700, 0 0 50px #ffd70088; transform: scale(1.05); }
          100% { box-shadow: 0 0 10px #ffd700, 0 0 20px #ffd70066; transform: scale(1); }
        }

        /* RESPONSIVE DASHBOARD */
        @media (max-width: 1024px) {
          .perfil-rpg { flex-direction: column; align-items: center; gap: 25px; }
          .avatar-section { flex: none; width: 80%; text-align: center; }
          .avatar-section img { width: 150px !important; height: 150px !important; }
          .barra-xp-container { width: 90% !important; }
          .stats-section { grid-template-columns: 1fr 1fr !important; width: 100%; }
          .stat-card { padding: 10px !important; font-size: 0.9rem !important; }
        }

        @media (max-width: 768px) {
          .avatar-section img { width: 130px !important; height: 130px !important; }
          .stat-card h4 { font-size: 1rem !important; }
        }

        @media (max-width: 480px) {
          .avatar-section img { width: 110px !important; height: 110px !important; }
          .stat-card { font-size: 0.8rem !important; padding: 8px !important; }
          .barra-xp-container { width: 95% !important; }
        }

        /* TABLA ADAPTABLE */
        .modulo-rpg table {
          width: 100%;
          table-layout: auto;
          overflow-x: auto;
          display: block;
        }
        .modulo-rpg th, .modulo-rpg td { padding: 8px; text-align: left; }
      `}</style>
    </div>
  );
};

export default ConquistadorDashboard;
