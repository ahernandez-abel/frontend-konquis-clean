import { useEffect, useState } from "react";
import API from "../../api/api.js";

export const UnidadList = () => {
  const [unidades, setUnidades] = useState([]);
  const [filteredUnidades, setFilteredUnidades] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", limite: "", requisitos: "" });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [ranking, setRanking] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Para asignar miembros y líder
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [miembrosSeleccionados, setMiembrosSeleccionados] = useState([]);
  const [usuariosOcupados, setUsuariosOcupados] = useState([]);
  const [liderSeleccionado, setLiderSeleccionado] = useState(null);
  const [searchUsuario, setSearchUsuario] = useState("");

  // -------------------- Fetch Unidades --------------------
  const fetchUnidades = async () => {
    try {
      const res = await API.get("/unidades");
      if (Array.isArray(res.data.data)) {
        setUnidades(res.data.data);
        setFilteredUnidades(res.data.data);
        setErrorMsg("");
      } else {
        setUnidades([]);
        setFilteredUnidades([]);
        setErrorMsg("Formato de datos de unidades incorrecto");
      }
    } catch (err) {
      handleAxiosError(err, "No se pudieron cargar las unidades");
    }
  };

  const fetchRanking = async () => {
    try {
      const res = await API.get("/unidades/ranking");
      if (Array.isArray(res.data.data)) setRanking(res.data.data);
      else setRanking([]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const res = await API.get("/usuarios");
      if (Array.isArray(res.data.data)) {
        const usuariosNoAdmin = res.data.data.filter(
          (u) => !["admin", "administrador"].includes(u.rol)
        );
        setUsuarios(usuariosNoAdmin);
        setUsuariosFiltrados(usuariosNoAdmin);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsuariosOcupados = async () => {
    try {
      const res = await API.get("/unidades/usuarios/ocupados");
      if (Array.isArray(res.data.data)) {
        setUsuariosOcupados(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUnidades();
    fetchRanking();
    fetchUsuarios();
    fetchUsuariosOcupados();
  }, []);

  // -------------------- Filtros --------------------
  useEffect(() => {
    if (!Array.isArray(unidades)) return;
    const filtered = unidades.filter(
      (u) =>
        u.nombre.toLowerCase().includes(search.toLowerCase()) ||
        u.directiva_nombre?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUnidades(filtered);
  }, [search, unidades]);

  useEffect(() => {
    const filtrados = usuarios.filter(
      (u) =>
        u.nombre.toLowerCase().includes(searchUsuario.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchUsuario.toLowerCase())
    );
    setUsuariosFiltrados(filtrados);
  }, [searchUsuario, usuarios]);

  // -------------------- Manejo de errores --------------------
  const handleAxiosError = (err, defaultMsg) => {
    if (err.response) {
      const status = err.response.status;
      const message = err.response.data?.message || defaultMsg;
      setErrorMsg(
        status === 403 ? "No tienes permiso para realizar esta acción" : message
      );
      console.error("Axios error:", status, err.response.data || err.message);
    } else {
      setErrorMsg(defaultMsg);
      console.error("Axios error (sin respuesta):", err.message);
    }
  };

  // -------------------- Crear / Editar --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: formData.nombre,
        limite: formData.limite,
        requisitos: formData.requisitos,
        miembros: miembrosSeleccionados,
        id_directiva: liderSeleccionado,
      };
      if (editId) await API.put(`/unidades/${editId}`, payload);
      else await API.post("/unidades", payload);

      await fetchUnidades();
      setFormData({ nombre: "", limite: "", requisitos: "" });
      setShowForm(false);
      setEditId(null);
      setMiembrosSeleccionados([]);
      setLiderSeleccionado(null);
      setErrorMsg("");
    } catch (err) {
      handleAxiosError(err, "Error al guardar unidad");
    }
  };

  const handleEdit = async (unidad) => {
    setFormData({
      nombre: unidad.nombre,
      limite: unidad.limite,
      requisitos: unidad.requisitos,
    });
    setEditId(unidad.id_unidad);
    setShowForm(true);
    setErrorMsg("");

    try {
      const res = await API.get(`/unidades/${unidad.id_unidad}/miembros`);
      const miembrosActuales = res.data.map((m) => m.id_usuario);
      setMiembrosSeleccionados(miembrosActuales);
      await fetchUsuariosOcupados();
      setLiderSeleccionado(unidad.id_directiva || null);
    } catch (err) {
      console.error("Error al cargar miembros o líder:", err);
    }
  };

  // -------------------- Eliminar --------------------
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta unidad?")) return;
    try {
      await API.delete(`/unidades/${id}`);
      fetchUnidades();
      fetchRanking();
    } catch (err) {
      handleAxiosError(err, "Error al eliminar unidad");
    }
  };

  // -------------------- Asignar miembros y líder --------------------
  const handleAsignarMiembros = async () => {
    try {
      await API.post("/unidades/miembros", {
        idunidad: parseInt(editId, 10),
        miembros: miembrosSeleccionados.map((id) => parseInt(id, 10)),
        id_directiva: liderSeleccionado,
      });
      alert("Miembros y líder asignados correctamente");
      fetchUnidades();
      fetchUsuariosOcupados();
    } catch (err) {
      handleAxiosError(err, "Error al asignar miembros y líder");
    }
  };

  const toggleUsuario = (id_usuario) => {
    if (miembrosSeleccionados.includes(id_usuario)) {
      setMiembrosSeleccionados(
        miembrosSeleccionados.filter((id) => id !== id_usuario)
      );
    } else {
      setMiembrosSeleccionados([...miembrosSeleccionados, id_usuario]);
    }
  };

  const seleccionarTodosUsuarios = () => {
    if (miembrosSeleccionados.length === usuariosFiltrados.length) {
      setMiembrosSeleccionados([]);
    } else {
      setMiembrosSeleccionados(usuariosFiltrados.map((u) => u.id_usuario));
    }
  };

  const getUnidadUsuario = (id_usuario) => {
    const ocup = usuariosOcupados.find((u) => u.id_usuario === id_usuario);
    if (!ocup) return null;
    const unidad = unidades.find((un) => un.id_unidad === ocup.id_unidad);
    return unidad ? unidad.nombre : null;
  };

  const getMedalla = (index) => {
    if (index === 0) return { className: "medalla oro", icon: "🥇" };
    if (index === 1) return { className: "medalla plata", icon: "🥈" };
    if (index === 2) return { className: "medalla bronce", icon: "🥉" };
    return { className: "", icon: "" };
  };

  // -------------------- Render --------------------
  return (
    <div className="module-container">
      <h2>Unidades</h2>
      {errorMsg && <div className="error-msg">{errorMsg}</div>}

      <div className="unidades-filtros">
        <input
          type="text"
          placeholder="Buscar unidad o líder..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setFormData({ nombre: "", limite: "", requisitos: "" });
            setMiembrosSeleccionados([]);
            setLiderSeleccionado(null);
          }}
        >
          Crear Unidad
        </button>
      </div>

      {showForm && (
        <form className="unidad-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Límite"
            value={formData.limite}
            onChange={(e) =>
              setFormData({ ...formData, limite: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Requisitos"
            value={formData.requisitos}
            onChange={(e) =>
              setFormData({ ...formData, requisitos: e.target.value })
            }
          />

          {editId && (
            <div className="asignar-miembros">
              <h4>Asignar Miembros</h4>
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchUsuario}
                onChange={(e) => setSearchUsuario(e.target.value)}
              />
              <button type="button" onClick={seleccionarTodosUsuarios}>
                Seleccionar todos
              </button>
              <ul className="usuarios-list">
                {usuariosFiltrados.map((u) => {
                  const unidadUsuario = getUnidadUsuario(u.id_usuario);
                  const unidadActual = unidades.find(un => un.id_unidad === editId)?.nombre;
                  const ocupadoEnOtraUnidad = unidadUsuario && unidadUsuario !== unidadActual;
                  return (
                    <li key={u.id_usuario}>
                      <label>
                        <input
                          type="checkbox"
                          checked={miembrosSeleccionados.includes(u.id_usuario)}
                          onChange={() => toggleUsuario(u.id_usuario)}
                          disabled={ocupadoEnOtraUnidad}
                        />
                        {u.nombre} ({u.email})
                        {unidadUsuario
                          ? ` - Unidad: ${unidadUsuario}`
                          : " - Libre"}
                      </label>
                    </li>
                  );
                })}
              </ul>

              <label>Líder:</label>
              <select
                value={liderSeleccionado || ""}
                onChange={(e) =>
                  setLiderSeleccionado(parseInt(e.target.value, 10))
                }
              >
                <option value="">-- Seleccione líder --</option>
                {miembrosSeleccionados.map((id_usuario) => {
                  const usuario = usuarios.find(
                    (u) => u.id_usuario === id_usuario
                  );
                  return (
                    <option key={id_usuario} value={id_usuario}>
                      {usuario?.nombre}
                    </option>
                  );
                })}
              </select>
              <button type="button" onClick={handleAsignarMiembros}>
                Guardar Miembros y Líder
              </button>
            </div>
          )}

          <div className="form-actions">
            <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="unidades-card">
        <table className="unidades-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Límite</th>
              <th>Líder</th>
              <th>Miembros</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUnidades.map((u) => (
              <tr key={u.id_unidad}>
                <td>{u.id_unidad}</td>
                <td>{u.nombre}</td>
                <td>{u.limite}</td>
                <td>{u.directiva_nombre || "N/A"}</td>
                <td>{u.miembros_count || 0}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>Editar</button>
                  <button onClick={() => handleEliminar(u.id_unidad)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ranking-card">
        <h3>Ranking de Unidades por Misiones Completadas</h3>
        <table className="ranking-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Unidad</th>
              <th>Total Misiones Completadas</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((r, index) => {
              const medalla = getMedalla(index);
              return (
                <tr key={r.id_unidad} className={medalla.className}>
                  <td>{index + 1}</td>
                  <td>
                    {medalla.icon} {r.unidad}
                  </td>
                  <td>{r.total_misiones_completadas || 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
