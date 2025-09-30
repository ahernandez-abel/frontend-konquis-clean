import { useState, useMemo } from "react";
import { FaMedal } from "react-icons/fa";

const medallaInfo = (pos) => {
  switch (pos) {
    case 0: return { color: "#FFD700", label: "Oro" };
    case 1: return { color: "#C0C0C0", label: "Plata" };
    case 2: return { color: "#CD7F32", label: "Bronce" };
    default: return { color: "#444", label: "" };
  }
};

const RankingUnidad = ({ ranking }) => {
  const [search, setSearch] = useState("");

  if (!Array.isArray(ranking) || ranking.length === 0) {
    return <p style={{ fontFamily: "'Cinzel', serif", color: "#fff" }}>No hay datos de ranking de unidades.</p>;
  }

  // Calculamos solo misiones completadas por unidad
  const sortedUnidades = useMemo(() => {
    return ranking
      .map(u => ({
        ...u,
        // Sumamos directamente misiones_completadas que viene del backend
        totalMisiones: (u.ranking || []).reduce((acc, m) => acc + (m.misiones_completadas || 0), 0)
      }))
      .filter(u => (u.nombre_unidad || "").toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.totalMisiones - a.totalMisiones);
  }, [ranking, search]);

  return (
    <div className="module-container" style={{ fontFamily: "'Cinzel', serif", color: "#fff", marginTop: "20px" }}>
      <h2 style={{ color: "#FFD700", textAlign: "center", marginBottom: "15px" }}>🏰 Ranking de Unidades</h2>

      <div style={{ margin: "10px 0" }}>
        <input
          type="text"
          placeholder="Buscar por unidad..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "8px",
            border: "2px solid #FFD700",
            background: "#1b1b1b",
            color: "#fff",
            width: "100%",
            maxWidth: "300px",
            fontFamily: "'Cinzel', serif",
            outline: "none",
            margin: "0 auto",
            display: "block"
          }}
        />
      </div>

      <div style={{ overflowX: "auto", marginTop: "10px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#1b1b1b" }}>
          <thead>
            <tr style={{ background: "#222", color: "#FFD700", textAlign: "center", fontSize: "12px" }}>
              <th style={{ padding: "10px", borderBottom: "2px solid #FFD700" }}>Posición</th>
              <th style={{ padding: "10px", borderBottom: "2px solid #FFD700" }}>Unidad</th>
              <th style={{ padding: "10px", borderBottom: "2px solid #FFD700" }}>Misiones Completadas</th>
            </tr>
          </thead>
          <tbody>
            {sortedUnidades.map((unidad, idxUnidad) => {
              const medalla = medallaInfo(idxUnidad);
              return (
                <tr
                  key={unidad.id_unidad}
                  style={{
                    background: idxUnidad < 3 ? medalla.color + "33" : "#1b1b1b",
                    color: "#fff",
                    textAlign: "center",
                    borderBottom: "1px solid #333",
                    fontWeight: idxUnidad < 3 ? "bold" : "normal",
                    transition: "0.3s",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                  title={`Unidad: ${unidad.nombre_unidad}`}
                >
                  <td style={{ padding: "8px" }}>
                    {idxUnidad < 3
                      ? <FaMedal color={medalla.color} title={medalla.label} />
                      : idxUnidad + 1}
                  </td>
                  <td>{unidad.nombre_unidad}</td>
                  <td>{unidad.totalMisiones}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingUnidad;
