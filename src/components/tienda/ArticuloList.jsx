import { useEffect, useState } from "react";
import API from "../../api/api.js";

export const ArticuloList = () => {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nuevoArticulo, setNuevoArticulo] = useState({
    nombre: "",
    descripcion: "",
    costo_monedas: 0,
    costo_gemas: 0,
    stock: 0,
    imagen: null,
  });

  const [editando, setEditando] = useState(null); // ID en edición
  const [previewImg, setPreviewImg] = useState(null); // imagen seleccionada para preview

  const fetchArticulos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/tienda", { headers: { Authorization: `Bearer ${token}` } });
      const dataArray = Array.isArray(res.data?.data) ? res.data.data : [];
      setArticulos(dataArray);
    } catch (err) {
      console.error(err);
      setError("Error cargando los artículos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticulos();
  }, []);

  const handleCrearOEditarArticulo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("nombre", nuevoArticulo.nombre);
      formData.append("descripcion", nuevoArticulo.descripcion);
      formData.append("costo_monedas", nuevoArticulo.costo_monedas);
      formData.append("costo_gemas", nuevoArticulo.costo_gemas);
      formData.append("stock", nuevoArticulo.stock);
      if (nuevoArticulo.imagen) formData.append("imagen", nuevoArticulo.imagen);

      if (editando) {
        await API.put(`/tienda/${editando}`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        alert("Artículo actualizado correctamente");
      } else {
        await API.post("/tienda", formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        alert("Artículo creado correctamente");
      }

      setNuevoArticulo({ nombre: "", descripcion: "", costo_monedas: 0, costo_gemas: 0, stock: 0, imagen: null });
      setEditando(null);
      fetchArticulos();
    } catch (err) {
      console.error(err);
      alert("Error guardando el artículo");
    }
  };

  const handleEditar = (articulo) => {
    setNuevoArticulo({
      nombre: articulo.nombre,
      descripcion: articulo.descripcion,
      costo_monedas: articulo.costo_monedas,
      costo_gemas: articulo.costo_gemas,
      stock: articulo.stock,
      imagen: null,
    });
    setEditando(articulo.id_articulo);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este artículo?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/tienda/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchArticulos();
      alert("Artículo eliminado correctamente");
    } catch (err) {
      console.error(err);
      alert("Error eliminando el artículo");
    }
  };

  if (loading) return <p style={{ color: "#fff" }}>Cargando artículos...</p>;
  if (error) return <p style={{ color: "#ff4c4c" }}>{error}</p>;

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      
      {/* Panel de formulario */}
      <div style={{
        flex: "1 1 350px",
        background: "rgba(0,0,0,0.7)",
        padding: "20px",
        borderRadius: "25px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
        border: "2px solid #ffd700",
        height: "fit-content"
      }}>
        <h2 style={{ color: "#ffd700", textShadow: "1px 1px #000" }}>
          {editando ? "Editar Artículo" : "Crear Artículo"}
        </h2>
        <form onSubmit={handleCrearOEditarArticulo} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label style={{ color: "#fff" }}>Nombre</label>
          <input type="text" value={nuevoArticulo.nombre}
            onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, nombre: e.target.value })}
            required
            style={{ padding: "12px", borderRadius: "15px", border: "1px solid #ffd700",
                     background: "rgba(255,255,255,0.05)", color: "#fff" }} />

          <label style={{ color: "#fff" }}>Descripción</label>
          <textarea value={nuevoArticulo.descripcion}
            onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, descripcion: e.target.value })}
            style={{ padding: "12px", borderRadius: "15px", border: "1px solid #ffd700",
                     background: "rgba(255,255,255,0.05)", color: "#fff" }} />

          <label style={{ color: "#fff" }}>Costo en Monedas</label>
          <input type="number" value={nuevoArticulo.costo_monedas}
            onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, costo_monedas: Number(e.target.value) })}
            style={{ padding: "12px", borderRadius: "15px", border: "1px solid #ffd700",
                     background: "rgba(255,255,255,0.05)", color: "#fff" }} />

          <label style={{ color: "#fff" }}>Costo en Gemas</label>
          <input type="number" value={nuevoArticulo.costo_gemas}
            onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, costo_gemas: Number(e.target.value) })}
            style={{ padding: "12px", borderRadius: "15px", border: "1px solid #ffd700",
                     background: "rgba(255,255,255,0.05)", color: "#fff" }} />

          <label style={{ color: "#fff" }}>Stock</label>
          <input type="number" value={nuevoArticulo.stock}
            onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, stock: Number(e.target.value) })}
            style={{ padding: "12px", borderRadius: "15px", border: "1px solid #ffd700",
                     background: "rgba(255,255,255,0.05)", color: "#fff" }} />

          <label style={{ color: "#fff" }}>Imagen</label>
          <input type="file" accept="image/*"
            onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, imagen: e.target.files[0] })}
            style={{ padding: "8px", borderRadius: "15px", border: "1px solid #ffd700",
                     background: "rgba(255,255,255,0.05)", color: "#fff" }} />

          <button type="submit" style={{
            padding: "12px", borderRadius: "20px", border: "none",
            background: "linear-gradient(90deg, #ffd700, #ffb700)",
            color: "#111", fontWeight: "bold", cursor: "pointer", marginTop: "10px"
          }}>
            {editando ? "Guardar Cambios" : "Crear Artículo"}
          </button>
        </form>
      </div>

      {/* Panel de Inventario */}
      <div style={{
        flex: "3 1 800px",
        background: "rgba(0,0,0,0.7)",
        padding: "20px",
        borderRadius: "25px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
        border: "2px solid #ffd700",
        maxHeight: "85vh",
        overflowY: "auto"
      }}>
        <h2 style={{ color: "#ffd700", textShadow: "1px 1px #000" }}>Inventario</h2>
        {articulos.length === 0 ? (
          <p style={{ color: "#fff" }}>No hay artículos.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ffd700" }}>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Monedas</th>
                <th>Gemas</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {articulos.map((a) => (
                <tr key={a.id_articulo} style={{ borderBottom: "1px solid #555" }}>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    <img
                      src={`http://localhost:5000${a.imagen}`}
                      alt={a.nombre}
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        border: "2px solid #ffd700",
                        borderRadius: "10px",
                        cursor: "pointer"
                      }}
                      onClick={() => setPreviewImg(`http://localhost:5000${a.imagen}`)}
                      onError={(e) => e.currentTarget.src = "https://via.placeholder.com/120?text=No+Img"}
                    />
                  </td>
                  <td>{a.nombre}</td>
                  <td>{a.descripcion}</td>
                  <td>{a.costo_monedas}</td>
                  <td>{a.costo_gemas}</td>
                  <td>{a.stock}</td>
                  <td>
                    <button onClick={() => handleEditar(a)} style={{
                      padding: "8px 14px", borderRadius: "15px", border: "none",
                      background: "linear-gradient(90deg, #ffd700, #ffb700)",
                      color: "#111", fontWeight: "bold", cursor: "pointer", marginRight: "5px"
                    }}>
                      Editar
                    </button>
                    <button onClick={() => handleEliminar(a.id_articulo)} style={{
                      padding: "8px 14px", borderRadius: "15px", border: "none",
                      background: "linear-gradient(90deg, #ff4c4c, #ff1a1a)",
                      color: "#fff", fontWeight: "bold", cursor: "pointer"
                    }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de vista previa */}
      {previewImg && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 1000
        }}
          onClick={() => setPreviewImg(null)}
        >
          <img src={previewImg} alt="preview" style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "15px", border: "3px solid #ffd700" }} />
        </div>
      )}
    </div>
  );
};
