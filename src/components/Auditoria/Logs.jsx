import { useEffect, useState } from "react";
import API from "../../api/api.js";

export const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchUser, setSearchUser] = useState("");
  const [searchAccion, setSearchAccion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // ---------------- FUNCION PARA OBTENER LOGS ----------------
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/Auditoria/logs");
      const logsArray = Array.isArray(res.data?.data) ? res.data.data : [];
      setLogs(logsArray);
      setFilteredLogs(logsArray);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los logs");
      setLogs([]);
      setFilteredLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // ---------------- FILTRADO DE LOGS ----------------
  useEffect(() => {
    if (!Array.isArray(logs)) return setFilteredLogs([]);

    const filtered = logs.filter(l => {
      const fechaLog = l.fecha ? new Date(l.fecha) : null;
      const cumpleFechaInicio = fechaInicio ? fechaLog >= new Date(fechaInicio) : true;
      const cumpleFechaFin = fechaFin ? fechaLog <= new Date(fechaFin + "T23:59:59") : true;

      return (
        (l.nombre_usuario?.toLowerCase() || "").includes(searchUser.toLowerCase()) &&
        (l.accion?.toLowerCase() || "").includes(searchAccion.toLowerCase()) &&
        cumpleFechaInicio &&
        cumpleFechaFin
      );
    });

    setFilteredLogs(filtered);
  }, [searchUser, searchAccion, fechaInicio, fechaFin, logs]);

  // ---------------- RENDER ----------------
  return (
    <div className="logs-module">
      <h2>Logs de Auditoría</h2>

      {error && <p className="error">{error}</p>}

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por usuario..."
          value={searchUser}
          onChange={e => setSearchUser(e.target.value)}
        />
        <input
          type="text"
          placeholder="Buscar por acción..."
          value={searchAccion}
          onChange={e => setSearchAccion(e.target.value)}
        />
        <input
          type="date"
          placeholder="Fecha inicio"
          value={fechaInicio}
          onChange={e => setFechaInicio(e.target.value)}
        />
        <input
          type="date"
          placeholder="Fecha fin"
          value={fechaFin}
          onChange={e => setFechaFin(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Cargando logs...</p>
      ) : filteredLogs.length === 0 ? (
        <p>No hay registros que coincidan con la búsqueda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Fecha</th>
              <th>IP</th>
              <th>Agente</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(l => (
              <tr key={l.id_log}>
                <td>{l.id_log || "-"}</td>
                <td>{l.nombre_usuario || "Desconocido"}</td>
                <td>{l.accion || "-"}</td>
                <td>{l.fecha ? new Date(l.fecha).toLocaleString() : "-"}</td>
                <td>{l.ip || "-"}</td>
                <td>{l.user_agent || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};  