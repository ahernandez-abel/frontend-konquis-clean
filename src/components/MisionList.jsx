import { useEffect, useMemo, useState } from "react";
import { FaGem, FaCoins, FaStar, FaUsers } from "react-icons/fa";
import EvidenciaUpload from "./EvidenciaUpload"; // Asegúrate de la ruta correcta

const dificultadColor = {
  facil: "#28a745",
  normal: "#007bff",
  dificil: "#dc3545",
  epica: "#6f42c1"
};

const getColor = (dificultad) => {
  if (!dificultad) return "#fff";
  const key = dificultad.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return dificultadColor[key] || "#fff";
};

const rangos = [
  "Novato","Recluta","Soldado","Guerrero","Veterano",
  "Héroe","Campeón","Maestro","Élite","Leyenda"
];

const MisionList = ({ misionesIndividuales = [], misionesUnidad = [], usuario, setUsuario }) => {
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [filtroTipo, setFiltroTipo] = useState("todas");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  // Combinar y filtrar misiones duplicadas
  const todasMisiones = useMemo(() => {
    const filtradas = misionesIndividuales.filter(mi => 
      !misionesUnidad.some(mu => mu.nombre === mi.nombre && mu.unidad_nombre === mi.unidad_nombre)
    );
    return [
      ...filtradas.map(m => ({ ...m, tipo: "individual" })),
      ...misionesUnidad.map(m => ({ ...m, tipo: "unidad" }))
    ];
  }, [misionesIndividuales, misionesUnidad]);

  // Agrupar misiones por estado y tipo
  const misionesPorGrupo = useMemo(() => {
    const grupos = {
      individualPendientes: [],
      individualCompletadas: [],
      unidadPendientes: [],
      unidadCompletadas: []
    };

    todasMisiones.forEach(m => {
      if (filtroEstado !== "todas" && m.estado !== filtroEstado) return;
      if (filtroTipo !== "todas" && m.tipo !== filtroTipo) return;
      if (fechaDesde && new Date(m.fecha_asignacion) < new Date(fechaDesde)) return;
      if (fechaHasta && new Date(m.fecha_asignacion) > new Date(fechaHasta)) return;

      if (m.tipo === "individual" && m.estado === "pendiente") grupos.individualPendientes.push(m);
      if (m.tipo === "individual" && m.estado === "completada") grupos.individualCompletadas.push(m);
      if (m.tipo === "unidad" && m.estado === "pendiente") grupos.unidadPendientes.push(m);
      if (m.tipo === "unidad" && m.estado === "completada") grupos.unidadCompletadas.push(m);
    });

    return grupos;
  }, [todasMisiones, filtroEstado, filtroTipo, fechaDesde, fechaHasta]);

  // Actualizar progreso del usuario
  useEffect(() => {
    if (!usuario) return;

    let totalXP = 0, totalMonedas = 0, totalGemas = 0;
    todasMisiones.forEach(m => {
      if (m.estado === "completada") {
        totalXP += m.xp || 0;
        totalMonedas += m.monedas || 0;
        totalGemas += m.gemas || 0;
      }
    });

    let nivel = 1;
    let xpRestante = totalXP;
    let xpParaSubir = 1000;
    while (xpRestante >= xpParaSubir) {
      xpRestante -= xpParaSubir;
      nivel++;
      xpParaSubir = Math.floor(xpParaSubir * 1.2);
    }

    setUsuario(prev => {
      const rango = rangos[nivel - 1] || "Novato";
      if (
        prev.xp === xpRestante &&
        prev.xpParaSiguiente === xpParaSubir &&
        prev.nivel === nivel &&
        prev.rango === rango &&
        prev.monedas === totalMonedas &&
        prev.gemas === totalGemas
      ) return prev;

      return {
        ...prev,
        xp: xpRestante,
        xpParaSiguiente: xpParaSubir,
        nivel,
        rango,
        monedas: totalMonedas,
        gemas: totalGemas
      };
    });
  }, [todasMisiones, usuario, setUsuario]);

  return (
    <div className="module-container" style={{ marginTop: "20px" }}>
      <h2 style={{ color: "#ffd700", fontFamily: "'Cinzel', serif" }}>🎯 Misiones</h2>

      {/* FILTROS */}
      <div style={{
        background: "#1b1b1b",
        padding: "15px",
        borderRadius: "10px",
        border: "2px solid #ffd700",
        marginBottom: "20px",
        display: "flex",
        gap: "15px",
        flexWrap: "wrap"
      }}>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} style={estiloSelect}>
          <option value="todas">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="completada">Completadas</option>
        </select>

        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} style={estiloSelect}>
          <option value="todas">Todos los tipos</option>
          <option value="individual">Individual</option>
          <option value="unidad">Por Unidad</option>
        </select>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <label style={{ color: "#fff" }}>Desde:</label>
          <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} style={estiloInput}/>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <label style={{ color: "#fff" }}>Hasta:</label>
          <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} style={estiloInput}/>
        </div>
      </div>

      {/* Secciones de misiones */}
      {Object.entries(misionesPorGrupo).map(([grupo, lista]) => {
        if (lista.length === 0) return null;

        let titulo = "";
        let color = "#fff";
        if (grupo === "individualPendientes") { titulo = "🙋 Misiones Individuales Pendientes"; color = "#28a745"; }
        if (grupo === "individualCompletadas") { titulo = "🙋 Misiones Individuales Completadas"; color = "#ffd700"; }
        if (grupo === "unidadPendientes") { titulo = "🤝 Misiones por Unidad Pendientes"; color = "#00f0ff"; }
        if (grupo === "unidadCompletadas") { titulo = "🤝 Misiones por Unidad Completadas"; color = "#ff69b4"; }

        return (
          <div key={grupo} style={{ marginTop: "25px" }}>
            <h3 style={{ color }}>{titulo}</h3>
            <div style={{ display: "grid", gap: "15px" }}>
              {lista.map((m, idx) => (
                <MisionCard key={idx} mision={m} esUnidad={m.tipo === "unidad"} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Estilos RPG
const estiloSelect = {
  background: "#000",
  color: "#ffd700",
  border: "2px solid #ffd700",
  borderRadius: "8px",
  padding: "5px 10px",
  fontFamily: "'Cinzel', serif"
};

const estiloInput = {
  background: "#000",
  color: "#fff",
  border: "2px solid #ffd700",
  borderRadius: "8px",
  padding: "5px 10px"
};

const MisionCard = ({ mision, esUnidad }) => {
  const [mostrarEvidencia, setMostrarEvidencia] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: esUnidad
          ? "linear-gradient(145deg, #0b1c2d, #12335a)"
          : "linear-gradient(145deg, #1b2d1b, #2a502a)",
        border: esUnidad ? "2px solid #00f0ff" : "2px solid #ffd700",
        borderRadius: "12px",
        padding: "15px",
        boxShadow: esUnidad ? "0 0 15px #00f0ff" : "0 0 15px #ffd700",
        transition: "all 0.3s",
        position: "relative"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <h3 style={{ margin: 0, color: "#ffd700", fontFamily: "'Press Start 2P', cursive" }}>
          {mision.nombre}
        </h3>
        <span style={{ color: getColor(mision.dificultad), fontWeight: "bold" }}>
          {mision.dificultad?.toUpperCase()}
        </span>
      </div>

      <p style={{ margin: "5px 0", color: "#ccc" }}>{mision.descripcion}</p>

      {mision.unidad_nombre && (
        <div style={{ marginBottom: "10px", color: "#00f0ff", fontWeight: "bold" }}>
          <FaUsers /> Unidad: {mision.unidad_nombre}
        </div>
      )}

      <div style={{ display: "flex", gap: "20px", marginTop: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#ffd700" }}>
          <FaStar /> XP: {mision.xp}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#ffd700" }}>
          <FaCoins /> {mision.monedas}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#00f0ff" }}>
          <FaGem /> {mision.gemas}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: mision.estado === "completada" ? "#28a745" : "#ff6b6b" }}>
          {mision.estado === "completada" ? "✔ Completada" : "⏳ Pendiente"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#fff" }}>
          Intentos: {mision.intentos}
        </div>
      </div>

      <div style={{ marginTop: "10px", fontSize: "12px", color: "#aaa" }}>
        Asignada: {mision.fecha_asignacion ? new Date(mision.fecha_asignacion).toLocaleString() : "-"} | 
        Completada: {mision.fecha_completada ? new Date(mision.fecha_completada).toLocaleString() : "-"}
      </div>

      {/* Mostrar botón de evidencia solo si la misión está pendiente */}
      {mision.estado === "pendiente" && (
        <>
          <button
            onClick={() => setMostrarEvidencia(prev => !prev)}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#ffd700",
              color: "#000",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {mostrarEvidencia ? "Cerrar Evidencia" : "Subir Evidencia"}
          </button>

          {mostrarEvidencia && <EvidenciaUpload idMision={mision.id_mision} onClose={() => setMostrarEvidencia(false)} />}
        </>
      )}
    </div>
  );
};

export default MisionList;
