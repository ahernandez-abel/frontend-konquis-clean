// src/components/gamificacion/Gamificacion.jsx
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bar } from "react-chartjs-2";
import API from "../../api/api.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

export const Gamificacion = () => {
  const [tab, setTab] = useState("rankingUsuarios");
  const [rankingUsuarios, setRankingUsuarios] = useState([]);
  const [rankingUnidades, setRankingUnidades] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({ xp: 0, monedas: 0, gemas: 0, logros: [], misiones: [] });
  const [recursos, setRecursos] = useState({ xp: 0, monedas: 0, gemas: 0 });

  const [temporadas, setTemporadas] = useState([]);
  const [temporadaSeleccionada, setTemporadaSeleccionada] = useState(null);
  const [premio, setPremio] = useState("");
  const [nuevaTemporada, setNuevaTemporada] = useState({ nombre: "", fecha_inicio: "", fecha_fin: "" });

  useEffect(() => {
    fetchRankingUsuarios();
    fetchRankingUnidades();
    fetchTemporadas();
  }, []);

  useEffect(() => {
    if (selectedUser) fetchUserStats(selectedUser);
  }, [selectedUser, rankingUsuarios]);

  // ------------------ Helpers ------------------
  const safeExtractData = (res) => res?.data?.data ?? res?.data ?? [];

  const normalizeUnits = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) return [];
    if (rows[0].ranking) return rows;

    if (rows[0].usuarios) {
      return rows.map(r => ({
        id_unidad: r.id_unidad,
        nombre_unidad: r.nombre_unidad || r.nombre,
        ranking: Array.isArray(r.usuarios)
          ? r.usuarios.map(u => ({
              id_usuario: u.id_usuario,
              nombre: u.nombre || u.nombre_usuario,
              xp: u.xp ?? u.valor ?? u.puntos ?? 0,
              monedas: u.monedas ?? 0,
              gemas: u.gemas ?? 0
            }))
          : []
      }));
    }

    if ("id_usuario" in rows[0]) {
      const map = {};
      rows.forEach(r => {
        const idu = r.id_unidad;
        if (!map[idu]) {
          map[idu] = { id_unidad: idu, nombre_unidad: r.nombre_unidad || r.nombre || `Unidad ${idu}`, ranking: [] };
        }
        map[idu].ranking.push({
          id_usuario: r.id_usuario,
          nombre: r.nombre_usuario || r.nombre || r.email || `Usuario ${r.id_usuario}`,
          xp: r.xp ?? r.valor ?? r.puntos ?? 0,
          monedas: r.monedas ?? 0,
          gemas: r.gemas ?? 0
        });
      });
      return Object.values(map);
    }

    return rows;
  };

  // ------------------ Fetchers ------------------
  const fetchRankingUsuarios = async () => {
    try {
      const res = await API.get("/gamificacion/ranking?criterio=xp&limite=100");
      const data = safeExtractData(res);
      setRankingUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetchRankingUsuarios:", err);
      setRankingUsuarios([]);
    }
  };

  const fetchRankingUnidades = async () => {
    try {
      const res = await API.get("/gamificacion/ranking/unidades");
      const data = safeExtractData(res);
      if (Array.isArray(data) && data.length > 0) {
        setRankingUnidades(normalizeUnits(data));
      } else {
        setRankingUnidades([]);
      }
    } catch (err) {
      console.error("Error fetchRankingUnidades:", err);
      setRankingUnidades([]);
    }
  };

  const fetchTemporadas = async () => {
    try {
      const res = await API.get("/gamificacion/temporadas");
      const data = safeExtractData(res);
      setTemporadas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetchTemporadas:", err);
      setTemporadas([]);
    }
  };

  const fetchUserStats = async (id_usuario) => {
    try {
      const u = rankingUsuarios.find(x => x.id_usuario === id_usuario);
      let xp = u?.xp ?? 0;
      let monedas = u?.monedas ?? 0;
      let gemas = u?.gemas ?? 0;

      let logros = [];
      let misiones = [];
      try {
        const resLogros = await API.get(`/gamificacion/logros/${id_usuario}`);
        logros = safeExtractData(resLogros);
      } catch (err) {
        console.warn("No se pudieron cargar logros:", err);
      }

      try {
        const resMisiones = await API.get(`/gamificacion/misiones/${id_usuario}`);
        misiones = safeExtractData(resMisiones);
      } catch (err) {
        console.warn("No se pudieron cargar misiones:", err);
      }

      if (!u) {
        try {
          const resU = await API.get("/usuarios");
          const usuariosAll = safeExtractData(resU);
          const found = (usuariosAll || []).find(x => x.id_usuario === id_usuario);
          if (found) {
            xp = found.xp ?? xp;
            monedas = found.monedas ?? monedas;
            gemas = found.gemas ?? gemas;
          }
        } catch (err) {}
      }

      setStats({ xp, monedas, gemas, logros, misiones });
    } catch (err) {
      console.error("Error fetchUserStats:", err);
      setStats({ xp: 0, monedas: 0, gemas: 0, logros: [], misiones: [] });
    }
  };
  // ------------------ Actions ------------------
  const handleAsignarRecursos = async () => {
    if (!selectedUser) return alert("Selecciona un usuario primero");
    try {
      await API.post(`/gamificacion/usuarios/recursos`, { id_usuario: selectedUser, ...recursos });
      setRecursos({ xp: 0, monedas: 0, gemas: 0 });
      await fetchUserStats(selectedUser);
      await fetchRankingUsuarios();
      alert("Recursos actualizados");
    } catch (err) {
      console.error("Error asignar recursos:", err);
      alert("Error al asignar recursos");
    }
  };

  const handleValidarLogros = async () => {
    if (!selectedUser) return alert("Selecciona un usuario primero");
    try {
      await API.get(`/gamificacion/usuarios/${selectedUser}/validar-logros`);
      await fetchUserStats(selectedUser);
      alert("Validación de logros ejecutada");
    } catch (err) {
      console.error("Error validar logros:", err);
      alert("Error al validar logros");
    }
  };

  const handleCerrarTemporada = async () => {
    if (!temporadaSeleccionada) return alert("Selecciona una temporada primero");
    try {
      await API.post(`/gamificacion/temporadas/cerrar`, { id_temporada: temporadaSeleccionada });
      await fetchTemporadas();
      await fetchRankingUsuarios();
      await fetchRankingUnidades();
      alert("Temporada cerrada correctamente");
    } catch (err) {
      console.error("Error cerrar temporada:", err);
      alert("Error al cerrar temporada");
    }
  };

  const handleAsignarPremio = async () => {
    if (!temporadaSeleccionada || !premio) return alert("Selecciona temporada y escribe un premio");
    try {
      await API.post(`/gamificacion/temporadas/recompensas`, {
        id_temporada: temporadaSeleccionada,
        descripcion: premio,
        tipo: "Personalizado",
        valor: 0
      });
      setPremio("");
      alert("Premio asignado correctamente");
    } catch (err) {
      console.error("Error asignar premio:", err);
      alert("Error al asignar premio");
    }
  };

  const handleCrearTemporada = async () => {
    if (!nuevaTemporada.nombre) return alert("Escribe un nombre para la temporada");
    try {
      await API.post("/gamificacion/temporadas", {
        nombre: nuevaTemporada.nombre,
        fecha_inicio: nuevaTemporada.fecha_inicio || null,
        fecha_fin: nuevaTemporada.fecha_fin || null
      });
      setNuevaTemporada({ nombre: "", fecha_inicio: "", fecha_fin: "" });
      await fetchTemporadas();
      alert("Temporada creada");
    } catch (err) {
      console.error("Error crear temporada:", err);
      alert("Error al crear temporada");
    }
  };

  // ------------------ Charts ------------------
  const recursosData = {
    labels: ["XP", "Monedas", "Gemas"],
    datasets: [
      {
        label: "Recursos",
        data: [stats.xp, stats.monedas, stats.gemas],
        backgroundColor: ["#ffdd57", "#ffaa33", "#ff66aa"],
        borderRadius: 10
      }
    ]
  };

  // ------------------ Render ------------------
  return (
    <div className="module-container">
      <h1>Gamificación</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button className={tab === "rankingUsuarios" ? "tab-active" : ""} onClick={() => setTab("rankingUsuarios")}>Ranking Individual</button>
        <button className={tab === "rankingUnidades" ? "tab-active" : ""} onClick={() => { setTab("rankingUnidades"); fetchRankingUnidades(); }}>Ranking Unidades</button>
        <button className={tab === "temporadas" ? "tab-active" : ""} onClick={() => { setTab("temporadas"); fetchTemporadas(); }}>Temporadas</button>
      </div>

      {/* Ranking Individual */}
      {tab === "rankingUsuarios" && (
        <div className="ranking-card-rpg">
          <table className="ranking-table-rpg">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>XP</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {(rankingUsuarios || []).map((r, index) => (
                <tr key={r.id_usuario} className="ranking-row-rpg">
                  <td>{index + 1}</td>
                  <td>{r.nombre}</td>
                  <td>
                    <div className="relative w-full bg-gray-600 rounded-full h-4">
                      <div
                        className="bg-yellow-400 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((r.xp ?? 0) / 200 * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-200 mt-1 block">{r.xp ?? 0} XP</span>
                  </td>
                  <td>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-4 py-1 rounded transition duration-200"
                      onClick={() => { setSelectedUser(r.id_usuario); setTab("usuario"); }}
                    >
                      Ver Stats
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ranking Unidades */}
{tab === "rankingUnidades" && (
  <div className="ranking-card-rpg">
    {rankingUnidades.length === 0 ? (
      <p>No hay datos de ranking por unidades. Revisa que el endpoint backend esté disponible.</p>
    ) : (
      <table className="ranking-table-rpg">
        <thead>
          <tr>
            <th>#</th>
            <th>Unidad</th>
            <th>Misiones Completadas</th>
          </tr>
        </thead>
        <tbody>
          {(rankingUnidades || []).slice(0, 10).map((u, idx) => {
            let medallaBg = "";
            if (idx === 0) medallaBg = "bg-yellow-400"; // Oro
            else if (idx === 1) medallaBg = "bg-gray-300"; // Plata
            else if (idx === 2) medallaBg = "bg-yellow-700"; // Bronce

            return (
              <tr key={u.id_unidad} className="ranking-row-rpg">
                <td>
                  <div className="flex items-center gap-2">
                    <span>{idx + 1}</span>
                    {medallaBg && (
                      <span
                        className={`${medallaBg} w-6 h-6 rounded-full flex items-center justify-center text-black font-bold text-sm`}
                      >
                        🏅
                      </span>
                    )}
                  </div>
                </td>
                <td>{u.nombre_unidad}</td>
                <td>
                  <div className="relative w-full bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((u.misiones_completadas ?? 0) * 10, 100)}%`
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-200 mt-1 block">{u.misiones_completadas ?? 0}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </div>
)}


      {/* Sección Usuario */}
      {tab === "usuario" && selectedUser && (
        <div className="ranking-card-rpg" style={{ padding: "16px" }}>
          <h2>Estadísticas del Usuario</h2>

          {/* Gráfico de recursos */}
          <Bar
            data={recursosData}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />

          {/* Asignar / Retirar Recursos */}
          <div style={{ marginTop: "20px" }}>
            <h4>Asignar / Retirar Recursos</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "200px" }}>
              <div>
                <label htmlFor="xp">XP:</label>
                <input
                  id="xp"
                  type="number"
                  value={recursos.xp}
                  onChange={e => setRecursos({ ...recursos, xp: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="monedas">Monedas:</label>
                <input
                  id="monedas"
                  type="number"
                  value={recursos.monedas}
                  onChange={e => setRecursos({ ...recursos, monedas: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="gemas">Gemas:</label>
                <input
                  id="gemas"
                  type="number"
                  value={recursos.gemas}
                  onChange={e => setRecursos({ ...recursos, gemas: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <button className="btn-primary" onClick={handleAsignarRecursos} style={{ marginTop: "10px" }}>
                Aplicar
              </button>
            </div>
          </div>

          {/* Logros */}
          <div style={{ marginTop: "20px" }}>
            <h4>Logros</h4>
            <button className="btn-primary" onClick={handleValidarLogros}>Validar Logros</button>
            <ul>
              {(stats.logros || []).length === 0 && <li>No hay logros encontrados</li>}
              {(stats.logros || []).map(logro => (
                <li key={logro.id_logro || logro.id}>{logro.nombre}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Sección Temporadas */}
      {tab === "temporadas" && (
        <div className="ranking-card-rpg" style={{ padding: "16px" }}>
          <h2>Gestión de Temporadas</h2>

          {/* Selección de temporada y acciones */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginBottom: "16px" }}>
            <select
              value={temporadaSeleccionada || ""}
              onChange={e => setTemporadaSeleccionada(e.target.value)}
              className="input-field"
            >
              <option value="">Selecciona Temporada</option>
              {(temporadas || []).map(t => (
                <option key={t.id_temporada} value={t.id_temporada}>{t.nombre}</option>
              ))}
            </select>

            <button className="btn-primary" onClick={handleCerrarTemporada}>Cerrar Temporada</button>

            <input
              type="text"
              placeholder="Premio"
              value={premio}
              onChange={e => setPremio(e.target.value)}
              className="input-field"
            />
            <button className="btn-primary" onClick={handleAsignarPremio}>Asignar Premio</button>
          </div>

          {/* Crear nueva temporada */}
          <div style={{ borderTop: "1px dashed #ddd", paddingTop: "12px", marginBottom: "20px" }}>
            <h4>Crear Nueva Temporada</h4>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Nombre"
                value={nuevaTemporada.nombre}
                onChange={e => setNuevaTemporada({ ...nuevaTemporada, nombre: e.target.value })}
                className="input-field"
                style={{ flex: "1 1 150px" }}
              />
              <DatePicker
                selected={nuevaTemporada.fecha_inicio ? new Date(nuevaTemporada.fecha_inicio) : null}
                onChange={date => setNuevaTemporada({ ...nuevaTemporada, fecha_inicio: date.toISOString().split('T')[0] })}
                className="input-field"
                placeholderText="Fecha Inicio"
              />
              <DatePicker
                selected={nuevaTemporada.fecha_fin ? new Date(nuevaTemporada.fecha_fin) : null}
                onChange={date => setNuevaTemporada({ ...nuevaTemporada, fecha_fin: date.toISOString().split('T')[0] })}
                className="input-field"
                placeholderText="Fecha Fin"
              />
              <button className="btn-primary" onClick={handleCrearTemporada}>Crear Temporada</button>
            </div>
          </div>

          {/* Rangos históricos */}
          <div>
            <h4>Rangos Históricos</h4>
            {(temporadas || []).length === 0 ? (
              <p>No hay temporadas registradas.</p>
            ) : (
              (temporadas || [])
                .filter(t => String(t.id_temporada) === String(temporadaSeleccionada))
                .map(t => (
                  <table key={t.id_temporada} className="ranking-table-rpg">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Usuario</th>
                        <th>Puntos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(t.rangos || []).map((r, idx) => (
                        <tr key={r.id_usuario || r.usuario_id} className="ranking-row-rpg">
                          <td>{idx + 1}</td>
                          <td>{r.usuario_nombre || r.nombre || r.usuario_id}</td>
                          <td>{r.puntos}</td>
                        </tr>
                      ))}
                      {(t.rangos || []).length === 0 && (
                        <tr><td colSpan={3}>No hay usuarios en esta temporada</td></tr>
                      )}
                    </tbody>
                  </table>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
