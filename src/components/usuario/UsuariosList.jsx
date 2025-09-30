import { useEffect, useState, useContext } from "react";
import API from "../../api/api.js";
import { AuthContext } from "../../context/AuthContext.js";

export const UsuariosList = () => {
  const { user, logout } = useContext(AuthContext); // Asumo que tienes función logout
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "conquistador",
    activo: true,
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ----------------- FUNCION PARA CARGAR USUARIOS -----------------
  const fetchUsuarios = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/usuarios"); // Token se envía automáticamente desde API.js
      setUsuarios(res.data.data || []);
      setFilteredUsuarios(res.data.data || []);
    } catch (err) {
      console.error("Error al cargar usuarios:", err.response?.data || err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("No tienes permisos o tu sesión expiró. Redirigiendo al login...");
        // Opcional: cerrar sesión automáticamente
        setTimeout(() => {
          logout(); // elimina token y user del contexto
        }, 1500);
      } else {
        setError("Error al cargar usuarios.");
      }

      setUsuarios([]);
      setFilteredUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  // ----------------- EFFECT PARA CARGAR USUARIOS -----------------
  useEffect(() => {
    fetchUsuarios();
  }, [user]);

  // ----------------- FILTRO DE BUSQUEDA -----------------
  useEffect(() => {
    const filtered = usuarios.filter(
      (u) =>
        u.nombre.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.rol || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.activo ? "activo" : "inactivo").includes(search.toLowerCase())
    );
    setFilteredUsuarios(filtered);
  }, [search, usuarios]);

  // ----------------- CREAR O EDITAR USUARIO -----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/usuarios/${editId}`, formData);
      } else {
        await API.post("/usuarios/register", formData);
      }
      fetchUsuarios(); // recarga automática
      setFormData({ nombre: "", email: "", password: "", rol: "conquistador", activo: true });
      setShowForm(false);
      setEditId(null);
    } catch (err) {
      console.error("Error guardando usuario:", err.response?.data || err);
      alert(err.response?.data?.message || "Error al guardar usuario");
    }
  };

  // ----------------- EDITAR USUARIO -----------------
  const handleEdit = (usuario) => {
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      password: "",
      rol: usuario.rol,
      activo: usuario.activo,
    });
    setEditId(usuario.id_usuario);
    setShowForm(true);
  };

  // ----------------- ACTIVAR / DESACTIVAR -----------------
  const handleEstado = async (usuario) => {
    try {
      await API.patch(`/usuarios/${usuario.id_usuario}/estado`, { activo: !usuario.activo });
      setUsuarios(
        usuarios.map((u) =>
          u.id_usuario === usuario.id_usuario ? { ...u, activo: !u.activo } : u
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error al cambiar estado del usuario");
    }
  };

  return (
    <div className="module-container">
      <h2>Usuarios</h2>

      <div className="usuarios-filtros">
        <input
          type="text"
          placeholder="Buscar por nombre, email, rol o estado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn-crear"
          onClick={() => {
            setShowForm(true);
            setEditId(null);
          }}
        >
          Crear Usuario
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Cargando usuarios...</p>}

      {showForm && (
        <form className="usuario-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder={editId ? "Nueva contraseña (opcional)" : "Contraseña"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!editId}
          />
          <select value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value })}>
            <option value="conquistador">Conquistador</option>
            <option value="administrador">Administrador</option>
            
          </select>
          <label>
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
            />{" "}
            Activo
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="usuarios-card">
        {filteredUsuarios.length === 0 && !loading && !error && <p>No hay usuarios registrados.</p>}
        {filteredUsuarios.length > 0 && (
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((u) => (
                <tr key={u.id_usuario}>
                  <td>{u.id_usuario}</td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{u.rol}</td>
                  <td>{u.activo ? "✅ Activo" : "❌ Inactivo"}</td>
                  <td>
                    <button className="btn-modificar" onClick={() => handleEdit(u)}>
                      Modificar
                    </button>
                    <button className="btn-desactivar" onClick={() => handleEstado(u)}>
                      {u.activo ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
