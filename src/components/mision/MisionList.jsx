import { useEffect, useState } from "react";
import API from "../../api/api.js";
import { toast } from "react-toastify";

export const MisionList = ({ user }) => {
  const [misiones, setMisiones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [activeTab, setActiveTab] = useState("lista"); // "lista" o "crear"
  const [editingMision, setEditingMision] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipo: "fija",
    dificultad: "normal",
    xp: 0,
    monedas: 0,
    gemas: 0,
    max_intentos: 1,
    fecha_inicio: "",
    fecha_fin: "",
    asignados_usuarios: [],
    asignados_unidades: [],
    activa: true
  });

  const [filterEstado, setFilterEstado] = useState("todas");
  const [filterTipo, setFilterTipo] = useState("todas");
  const [search, setSearch] = useState("");
  const [searchUsuario, setSearchUsuario] = useState("");
  const [searchMision, setSearchMision] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      if (user.rol === "administrador") {
        await fetchMisionesAdmin();
        await fetchUsuarios();
        await fetchUnidades();
      } else {
        await fetchMisionesUsuario();
      }
    };

    fetchData();
  }, [user]);

  const fetchMisionesAdmin = async () => {
    try {
      const res = await API.get("/misiones");
      setMisiones(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setMisiones([]);
    }
  };

  const fetchMisionesUsuario = async () => {
    try {
      const res = await API.get("/misiones/usuario");
      setMisiones(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setMisiones([]);
    }
  };

  const fetchUsuarios = async () => {
  try {
    const res = await API.get("/usuarios");
    // Excluir administradores
    const usuariosFiltrados = (res.data.data || []).filter(u => u.rol !== "administrador");
    setUsuarios(usuariosFiltrados);
  } catch (err) {
    console.error(err);
    setUsuarios([]);
  }
};
  const fetchUnidades = async () => {
    try {
      const res = await API.get("/unidades");
      setUnidades(res.data.data || []);
    } catch (err) {
      console.error(err);
      setUnidades([]);
    }
  };

  const filteredMisiones = misiones.filter(m => {
    const hoy = new Date();
    const fechaFin = m.fecha_fin ? new Date(m.fecha_fin) : null;
    const vencida = fechaFin && hoy > fechaFin;

    const matchesEstado =
      filterEstado === "completadas" ? !!m.fecha_completada :
      filterEstado === "pendientes" ? !m.fecha_completada && !vencida : true;

    const matchesTipo = filterTipo === "todas" ? true : m.tipo === filterTipo;
    const matchesSearch = search ? m.nombre?.toLowerCase().includes(search.toLowerCase()) : true;
    const matchesUsuario = searchUsuario ? m.usuario_nombre?.toLowerCase().includes(searchUsuario.toLowerCase()) : true;
    const matchesMision = searchMision ? m.mision_asignacion?.toLowerCase() === searchMision.toLowerCase() : true;

    const desde = fechaDesde ? new Date(fechaDesde) : null;
    const hasta = fechaHasta ? new Date(fechaHasta) : null;
    const matchesFecha = (!desde || new Date(m.fecha_inicio) >= desde) && (!hasta || (fechaFin && fechaFin <= hasta));

    return matchesEstado && matchesTipo && matchesSearch && matchesUsuario && matchesMision && matchesFecha;
  });

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta misión?")) return;
    try {
      await API.delete(`/misiones/${id}`);
      setMisiones(prev => prev.filter(m => m.id_mision !== id));
      toast.success("Misión eliminada");
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar la misión");
    }
  };

  const handleValidar = async (mision) => {
    const hoy = new Date();
    const fechaFin = mision.fecha_fin ? new Date(mision.fecha_fin) : null;
    const vencida = fechaFin && hoy > fechaFin;

    if (mision.fecha_completada || vencida) {
      toast.info("Esta misión no se puede validar");
      return;
    }

    try {
      const payload = {
        id_mision: Number(mision.id_mision),
        id_usuario: Number(mision.id_usuario),
        id_validador: Number(user.id_usuario)
      };
      const res = await API.post("/misiones/validar", payload);
      if (res.data.success) {
        toast.success(res.data.message);
        const mActualizada = res.data.data;
        setMisiones(prev =>
          prev.map(m =>
            m.id_mision === mActualizada.id_mision && m.id_usuario === mActualizada.id_usuario
              ? { ...m, estado: "completada", xp: mActualizada.xp, monedas: mActualizada.monedas, gemas: mActualizada.gemas, fecha_completada: new Date() }
              : m
          )
        );
      } else {
        toast.info(res.data.message || "No se pudo validar la misión");
      }
    } catch (error) {
      console.error("Error handleValidar:", error);
      toast.error(error.response?.data?.message || "Ocurrió un error al validar la misión.");
    }
  };

  const handleEdit = (mision) => {
    setEditingMision(mision);
    setFormData({
      nombre: mision.nombre,
      descripcion: mision.descripcion || "",
      tipo: mision.tipo,
      dificultad: mision.dificultad || "normal",
      xp: mision.xp || 0,
      monedas: mision.monedas || 0,
      gemas: mision.gemas || 0,
      max_intentos: mision.max_intentos || 1,
      fecha_inicio: mision.fecha_inicio ? new Date(mision.fecha_inicio).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      fecha_fin: mision.fecha_fin ? new Date(mision.fecha_fin).toISOString().split("T")[0] : "",
      asignados_usuarios: mision.asignados_usuarios || [],
      asignados_unidades: mision.asignados_unidades || [],
      activa: mision.activa
    });
    setActiveTab("crear");
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (editingMision) {
        await API.put(`/misiones/${editingMision.id_mision}`, payload);
        toast.success("Misión actualizada");
        fetchMisionesAdmin();
      } else {
        await API.post("/misiones", payload);
        toast.success("Misión creada");
        fetchMisionesAdmin();
      }
      setFormData({
        nombre: "",
        descripcion: "",
        tipo: "fija",
        dificultad: "normal",
        xp: 0,
        monedas: 0,
        gemas: 0,
        max_intentos: 1,
        fecha_inicio: "",
        fecha_fin: "",
        asignados_usuarios: [],
        asignados_unidades: [],
        activa: true
      });
      setEditingMision(null);
      setActiveTab("lista");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar la misión");
    }
  };

  const toggleSeleccionTodos = (tipo) => {
    if (tipo === "usuarios") {
      setFormData({...formData, asignados_usuarios: formData.asignados_usuarios.length === usuarios.length ? [] : usuarios.map(u => u.id_usuario)});
    } else {
      setFormData({...formData, asignados_unidades: formData.asignados_unidades.length === unidades.length ? [] : unidades.map(u => u.id_unidad)});
    }
  };

  return (
    <div className="module-container">
      <h2>Misiones</h2>
      <div className="tabs">
        <button className={activeTab==="lista" ? "active" : ""} onClick={()=>setActiveTab("lista")}>Lista</button>
        {user.rol==="administrador" && (
          <button className={activeTab==="crear" ? "active" : ""} onClick={()=>{setActiveTab("crear"); setEditingMision(null);}}>Crear Misiones</button>
        )}
      </div>

      {activeTab==="lista" && (
        <>
          <div className="misiones-filtros">
            <input type="text" placeholder="Buscar por nombre..." value={search} onChange={e=>setSearch(e.target.value)} />
            <input type="text" placeholder="Buscar por usuario..." value={searchUsuario} onChange={e=>setSearchUsuario(e.target.value)} />
            <select value={searchMision} onChange={e=>setSearchMision(e.target.value)}>
              <option value="">Todos</option>
              <option value="individual">Individual</option>
              <option value="unidad">Por unidad</option>
            </select>
            <select value={filterEstado} onChange={e=>setFilterEstado(e.target.value)}>
              <option value="todas">Todas</option>
              <option value="completadas">Completadas</option>
              <option value="pendientes">Pendientes</option>
            </select>
            <select value={filterTipo} onChange={e=>setFilterTipo(e.target.value)}>
              <option value="todas">Todos los tipos</option>
              <option value="fija">Fija</option>
              <option value="semanal">Semanal</option>
              <option value="temporada">Por temporada</option>
            </select>
            <input type="date" value={fechaDesde} onChange={e=>setFechaDesde(e.target.value)} />
            <input type="date" value={fechaHasta} onChange={e=>setFechaHasta(e.target.value)} />
          </div>

          <table className="misiones-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>XP</th>
                <th>Monedas</th>
                <th>Gemas</th>
                <th>Fecha inicio</th>
                <th>Fecha límite</th>
                <th>Estado</th>
                <th>Misión</th>
                <th>Usuario asignado</th>
                {user.rol==="administrador" && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filteredMisiones.map(m => {
                const hoy = new Date();
                const fechaFin = m.fecha_fin ? new Date(m.fecha_fin) : null;
                const vencida = fechaFin && hoy > fechaFin;
                const estadoTexto = m.fecha_completada ? "Completado" : vencida ? "Vencida" : "Pendiente";

                return (
                  <tr key={`${m.id_mision}-${m.id_usuario}`}>
                    <td>{m.id_mision}</td>
                    <td>{m.nombre}</td>
                    <td>{m.tipo}</td>
                    <td>{m.xp}</td>
                    <td>{m.monedas}</td>
                    <td>{m.gemas}</td>
                    <td>{m.fecha_inicio ? new Date(m.fecha_inicio).toLocaleDateString() : "-"}</td>
                    <td>{m.fecha_fin ? new Date(m.fecha_fin).toLocaleDateString() : "-"}</td>
                    <td>{estadoTexto}</td>
                    <td>{m.mision_asignacion}</td>
                    <td>{m.usuario_nombre}</td>
                    {user.rol==="administrador" && (
                      <td>
                        <button onClick={()=>handleEdit(m)} disabled={m.fecha_completada || vencida}>Editar</button>
                        <button onClick={()=>handleValidar(m)} disabled={m.fecha_completada || vencida}>Validar</button>
                        <button onClick={()=>handleEliminar(m.id_mision)} disabled={m.fecha_completada || vencida}>Eliminar</button>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
      )}

      {activeTab==="crear" && user.rol==="administrador" && (
        <form className="misiones-form" onSubmit={handleFormSubmit}>
          <label>Nombre</label>
          <input type="text" value={formData.nombre} onChange={e=>setFormData({...formData,nombre:e.target.value})} required />
          <label>Descripción</label>
          <textarea value={formData.descripcion} onChange={e=>setFormData({...formData,descripcion:e.target.value})} />
          <label>Tipo</label>
          <select value={formData.tipo} onChange={e=>setFormData({...formData,tipo:e.target.value})}>
            <option value="fija">Fija</option>
            <option value="semanal">Semanal</option>
            <option value="temporada">Por temporada</option>
          </select>
          <label>Dificultad</label>
          <select value={formData.dificultad} onChange={e=>setFormData({...formData,dificultad:e.target.value})}>
            <option value="facil">Fácil</option>
            <option value="normal">Normal</option>
            <option value="dificil">Difícil</option>
            <option value="epica">Épica</option>
          </select>
          <label>XP</label>
          <input type="number" value={formData.xp} onChange={e=>setFormData({...formData,xp:Number(e.target.value)})} min={0} />
          <label>Monedas</label>
          <input type="number" value={formData.monedas} onChange={e=>setFormData({...formData,monedas:Number(e.target.value)})} min={0} />
          <label>Gemas</label>
          <input type="number" value={formData.gemas} onChange={e=>setFormData({...formData,gemas:Number(e.target.value)})} min={0} />
          <label>Max intentos</label>
          <input type="number" value={formData.max_intentos} onChange={e=>setFormData({...formData,max_intentos:Number(e.target.value)})} min={1} />
          <label>Fecha inicio</label>
          <input type="date" value={formData.fecha_inicio} onChange={e=>setFormData({...formData,fecha_inicio:e.target.value})} />
          <label>Fecha límite</label>
          <input type="date" value={formData.fecha_fin} onChange={e=>setFormData({...formData,fecha_fin:e.target.value})} />

          {/* Asignar a usuarios */}
          <label>Asignar a usuarios</label>
          <button type="button" onClick={() => toggleSeleccionTodos("usuarios")}>
            {formData.asignados_usuarios.length === usuarios.length ? "Deseleccionar todos" : "Seleccionar todos"}
          </button>
          <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #555", padding: "10px", borderRadius: "8px" }}>
            {usuarios.map(u => (
              <div key={u.id_usuario}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.asignados_usuarios.includes(u.id_usuario)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          asignados_usuarios: [...formData.asignados_usuarios, u.id_usuario]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          asignados_usuarios: formData.asignados_usuarios.filter(id => id !== u.id_usuario)
                        });
                      }
                    }}
                  />
                  {u.nombre}
                </label>
              </div>
            ))}
          </div>

          {/* Asignar a unidades */}
          <label>Asignar a unidades</label>
          <button type="button" onClick={() => toggleSeleccionTodos("unidades")}>
            {formData.asignados_unidades.length === unidades.length ? "Deseleccionar todos" : "Seleccionar todos"}
          </button>
          <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #555", padding: "10px", borderRadius: "8px" }}>
            {unidades.map(u => (
              <div key={u.id_unidad}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.asignados_unidades.includes(u.id_unidad)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          asignados_unidades: [...formData.asignados_unidades, u.id_unidad]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          asignados_unidades: formData.asignados_unidades.filter(id => id !== u.id_unidad)
                        });
                      }
                    }}
                  />
                  {u.nombre}
                </label>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit">{editingMision ? "Actualizar" : "Crear"}</button>
            <button type="button" onClick={()=>setActiveTab("lista")}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
};
