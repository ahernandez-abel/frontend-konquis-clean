import { useEffect, useState } from "react";
import API from "../api/apiConquistador.js";
import { FaShoppingCart, FaTrash } from "react-icons/fa";

export const TiendaRPG = ({ onClose, unidad, setUnidad, insignias, setInsignias }) => {
  const [articulos, setArticulos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarCantidad, setMostrarCantidad] = useState(null); // artículo en selección
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ------------------ Cargar carrito guardado ------------------
  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carritoRPG");
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("carritoRPG", JSON.stringify(carrito));
  }, [carrito]);

  // ------------------ Obtener artículos ------------------
  const fetchArticulos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/tienda/usuario", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const articulosArray = Array.isArray(res.data?.data) ? res.data.data : [];
      const articulosConURL = articulosArray.map(a => ({
        ...a,
        imagen: a.imagen ? `http://localhost:5000${a.imagen}` : null
      }));
      setArticulos(articulosConURL);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los artículos.");
      setArticulos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticulos();
  }, []);

  // ------------------ Carrito ------------------
  const confirmarAgregar = () => {
    if (!mostrarCantidad) return;
    const articulo = mostrarCantidad;

    // Buscar si ya está en el carrito
    const existente = carrito.find(item => item.id_articulo === articulo.id_articulo);
    if (existente) {
      setCarrito(prev =>
        prev.map(item =>
          item.id_articulo === articulo.id_articulo
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      );
    } else {
      setCarrito(prev => [...prev, { ...articulo, cantidad }]);
    }

    setMostrarCantidad(null);
    setCantidad(1);
  };

  const eliminarDelCarrito = (index) => {
    setCarrito(prev => prev.filter((_, i) => i !== index));
  };

  const finalizarCompra = async () => {
    try {
      const token = localStorage.getItem("token");
      for (const articulo of carrito) {
        await API.post(
          "/tienda/comprar",
          { id_articulo: articulo.id_articulo, cantidad: articulo.cantidad },
          { headers: { Authorization: token ? `Bearer ${token}` : "" } }
        );
      }
      alert("¡Compra realizada con éxito!");
      setCarrito([]);
      localStorage.removeItem("carritoRPG");
      fetchArticulos();
    } catch (err) {
      console.error(err);
      alert("Error al procesar la compra.");
    }
  };

  // ------------------ Totales ------------------
  const totalMonedas = carrito.reduce((sum, a) => sum + a.costo_monedas * a.cantidad, 0);
  const totalGemas = carrito.reduce((sum, a) => sum + a.costo_gemas * a.cantidad, 0);

  if (loading)
    return <p style={{ color: "#ffd700", textAlign: "center", marginTop: "20px" }}>⚔️ Cargando la tienda mágica...</p>;
  if (error) return <p style={{ color: "#ff4c4c", textAlign: "center" }}>{error}</p>;

  return (
    <div className="modal-backdrop">
      <div
        className="modal-tienda"
        style={{
          maxWidth: "950px",
          padding: "20px",
          borderRadius: "25px",
          background: "linear-gradient(135deg, #1a1a1a, #0d0d0d)",
          border: "3px solid #ffd700",
          position: "relative",
          fontFamily: "'MedievalSharp', cursive"
        }}
      >
        {/* Botón cerrar */}
        <button
          className="close-modal"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            background: "darkred",
            color: "#fff",
            border: "2px solid #000",
            borderRadius: "50%",
            width: "35px",
            height: "35px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          ✖
        </button>

        {/* Carrito */}
        <div
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            cursor: "pointer",
            color: "#ffd700",
            fontSize: "26px"
          }}
          onClick={() => setMostrarCarrito(!mostrarCarrito)}
        >
          <FaShoppingCart />
          {carrito.length > 0 && (
            <span
              style={{
                background: "red",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "12px",
                position: "absolute",
                top: "-8px",
                right: "-10px",
                color: "#fff"
              }}
            >
              {carrito.length}
            </span>
          )}
        </div>

        {/* Título */}
        <h2
          style={{
            color: "#ffd700",
            textAlign: "center",
            marginBottom: "20px",
            textShadow: "0 0 10px #ffcc00, 0 0 20px #ffaa00"
          }}
        >
          🏰 Tienda RPG Épica
        </h2>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "16px",
            justifyItems: "center"
          }}
        >
          {articulos.length === 0 ? (
            <p style={{ color: "#fff", textAlign: "center", gridColumn: "1/-1" }}>
              No hay artículos mágicos disponibles.
            </p>
          ) : (
            articulos.map((a) => (
              <div
                key={a.id_articulo}
                style={{
                  background: "rgba(30, 30, 30, 0.9)",
                  border: "2px solid #ffd700",
                  borderRadius: "15px",
                  width: "100%",
                  textAlign: "center",
                  padding: "12px",
                  boxShadow: "0 0 15px rgba(255,215,0,0.4)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  fontFamily: "'MedievalSharp', cursive"
                }}
              >
                <img
                  src={a.imagen || "https://via.placeholder.com/150?text=No+Img"}
                  alt={a.nombre}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "8px",
                    border: "2px solid #ffd700"
                  }}
                />
                <h4 style={{ color: "#ffd700", marginBottom: "4px" }}>{a.nombre}</h4>
                <p style={{ color: "#fff" }}>💰 {a.costo_monedas} | 💎 {a.costo_gemas}</p>
                <p style={{ color: "#aaa" }}>Stock: {a.stock}</p>
                <button
                  style={{
                    marginTop: "6px",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    border: "2px solid #000",
                    background:
                      a.stock === 0
                        ? "gray"
                        : "linear-gradient(90deg, #ffd700, #ffb700)",
                    color: "#111",
                    fontWeight: "bold",
                    cursor: a.stock === 0 ? "not-allowed" : "pointer",
                    transition: "transform 0.2s ease"
                  }}
                  onClick={() => setMostrarCantidad(a)}
                  disabled={a.stock === 0}
                >
                  {a.stock === 0 ? "Agotado" : "Agregar"}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Panel del carrito */}
        {mostrarCarrito && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              right: "15px",
              width: "320px",
              background: "rgba(15,15,15,0.95)",
              border: "2px solid #ffd700",
              borderRadius: "12px",
              padding: "12px",
              color: "#fff",
              zIndex: 1000
            }}
          >
            <h4 style={{ color: "#ffd700", marginBottom: "10px" }}>🛒 Tu Carrito</h4>
            {carrito.length === 0 ? (
              <p>No hay artículos en el carrito.</p>
            ) : (
              <>
                <ul style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "10px" }}>
                  {carrito.map((item, index) => (
                    <li key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span>
                        {item.nombre} x{item.cantidad}
                      </span>
                      <FaTrash
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={() => eliminarDelCarrito(index)}
                      />
                    </li>
                  ))}
                </ul>
                <p style={{ color: "#ffd700" }}>
                  Total: 💰 {totalMonedas} | 💎 {totalGemas}
                </p>
                <button
                  onClick={finalizarCompra}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "linear-gradient(90deg, #ffd700, #ffb700)",
                    border: "2px solid #000",
                    borderRadius: "8px",
                    color: "#111",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Finalizar compra
                </button>
              </>
            )}
          </div>
        )}

        {/* Modal de cantidad */}
        {mostrarCantidad && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2000
            }}
          >
            <div
              style={{
                background: "#222",
                border: "3px solid #ffd700",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center",
                color: "#fff"
              }}
            >
              <h3 style={{ color: "#ffd700", marginBottom: "10px" }}>
                ¿Cuántos {mostrarCantidad.nombre} deseas?
              </h3>
              <input
                type="number"
                value={cantidad}
                min="1"
                max={mostrarCantidad.stock}
                onChange={(e) => setCantidad(parseInt(e.target.value))}
                style={{
                  padding: "5px",
                  width: "60px",
                  textAlign: "center",
                  borderRadius: "6px",
                  marginBottom: "10px"
                }}
              />
              <div>
                <button
                  onClick={confirmarAgregar}
                  style={{
                    marginRight: "10px",
                    padding: "6px 12px",
                    background: "linear-gradient(90deg, #ffd700, #ffb700)",
                    border: "2px solid #000",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setMostrarCantidad(null)}
                  style={{
                    padding: "6px 12px",
                    background: "darkred",
                    border: "2px solid #000",
                    borderRadius: "6px",
                    cursor: "pointer",
                    color: "#fff"
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
