import { useEffect, useState } from "react";
import API from "../../api/api.js";

export const Configuracion = () => {
  const [tab, setTab] = useState("configuracion");

  // Estados Configuración
  const [config, setConfig] = useState({});
  const [logo, setLogo] = useState("");
  const [colorTema, setColorTema] = useState("");
  const [notificaciones, setNotificaciones] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Estados Historial
  const [historial, setHistorial] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(true);

  // Estados Reportes
  const [reportes, setReportes] = useState([]);
  const [loadingReportes, setLoadingReportes] = useState(true);

  const [error, setError] = useState(null);

  // Fetch Configuración
  const fetchConfig = async () => {
    try {
      setLoadingConfig(true);
      const res = await API.get("/configuracion");
      setConfig(res.data);
      setLogo(res.data.logo);
      setColorTema(res.data.color_tema);
      setNotificaciones(res.data.notificaciones);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la configuración");
    } finally {
      setLoadingConfig(false);
    }
  };

  const actualizarConfig = async () => {
    try {
      await API.put("/configuracion", { logo, color_tema: colorTema, notificaciones });
      alert("Configuración actualizada");
      fetchConfig();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la configuración");
    }
  };

  // Fetch Historial
  const fetchHistorial = async () => {
    try {
      setLoadingHistorial(true);
      const res = await API.get("/historial");
      setHistorial(res.data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el historial");
    } finally {
      setLoadingHistorial(false);
    }
  };

  // Fetch Reportes
  const fetchReportes = async () => {
    try {
      setLoadingReportes(true);
      const res = await API.get("/reportes");
      setReportes(res.data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar los reportes");
    } finally {
      setLoadingReportes(false);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchHistorial();
    fetchReportes();
  }, []);

  // Render Tabs
  const renderTab = () => {
    switch (tab) {
      case "configuracion":
        return (
          <div>
            {loadingConfig ? (
              <p>Cargando configuración...</p>
            ) : (
              <div>
                <div>
                  <label>Logo URL:</label>
                  <input value={logo} onChange={e => setLogo(e.target.value)} />
                </div>
                <div>
                  <label>Color Tema:</label>
                  <input type="color" value={colorTema} onChange={e => setColorTema(e.target.value)} />
                </div>
                <div>
                  <label>Notificaciones:</label>
                  <input type="checkbox" checked={notificaciones} onChange={e => setNotificaciones(e.target.checked)} />
                </div>
                <button onClick={actualizarConfig}>Actualizar Configuración</button>
              </div>
            )}
          </div>
        );

      case "historial":
        return (
          <div>
            {loadingHistorial ? (
              <p>Cargando historial...</p>
            ) : historial.length === 0 ? (
              <p>No hay transacciones registradas.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Detalle</th>
                    <th>XP</th>
                    <th>Monedas</th>
                    <th>Recompensas</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((h, index) => (
                    <tr key={index}>
                      <td>{h.fecha}</td>
                      <td>{h.tipo}</td>
                      <td>{h.detalle}</td>
                      <td>{h.xp}</td>
                      <td>{h.monedas}</td>
                      <td>{h.recompensas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      case "reportes":
        return (
          <div>
            {loadingReportes ? (
              <p>Cargando reportes...</p>
            ) : reportes.length === 0 ? (
              <p>No hay reportes disponibles.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Conquistador</th>
                    <th>Temporada/Misión</th>
                    <th>Unidad</th>
                    <th>Rango</th>
                    <th>Logros</th>
                    <th>XP</th>
                    <th>Monedas</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.map((r, index) => (
                    <tr key={index}>
                      <td>{r.conquistador}</td>
                      <td>{r.temporada_mision}</td>
                      <td>{r.unidad}</td>
                      <td>{r.rango}</td>
                      <td>{r.logros}</td>
                      <td>{r.xp}</td>
                      <td>{r.monedas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="config-module">
      <h2>Panel de Configuración y Reportes</h2>

      <div className="tab-buttons">
        <button className={tab === "configuracion" ? "active" : ""} onClick={() => setTab("configuracion")}>Configuración</button>
        <button className={tab === "historial" ? "active" : ""} onClick={() => setTab("historial")}>Historial</button>
        <button className={tab === "reportes" ? "active" : ""} onClick={() => setTab("reportes")}>Reportes</button>
      </div>

      {error && <p className="error">{error}</p>}

      {renderTab()}
    </div>
  );
};
