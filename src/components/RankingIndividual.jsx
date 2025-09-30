import { useState, useEffect, useMemo } from "react";
import { FaMedal } from "react-icons/fa";
import { rankingIndividual as fetchRankingIndividual } from "../api/apiConquistador.js";

const medallaInfo = (pos) => {
  switch (pos) {
    case 0: return { color: "#FFD700", label: "Oro" };
    case 1: return { color: "#C0C0C0", label: "Plata" };
    case 2: return { color: "#CD7F32", label: "Bronce" };
    default: return { color: "#444", label: "" };
  }
};

// Definimos los nombres de niveles RPG
const rangos = [
  "Novato","Recluta","Soldado","Guerrero","Veterano",
  "Héroe","Campeón","Maestro","Élite","Leyenda"
];

const RankingIndividual = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getRanking = async () => {
      try {
        const res = await fetchRankingIndividual();
        if (res.data && Array.isArray(res.data.data)) {
          setRanking(res.data.data);
        }
      } catch (err) {
        console.error("Error al cargar ranking:", err);
      } finally {
        setLoading(false);
      }
    };
    getRanking();
  }, []);

  const filteredRanking = useMemo(() => {
    return ranking
      .filter(u => (u.nombre || "").toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (b.xp || 0) - (a.xp || 0));
  }, [ranking, search]);

  if (loading) return <p>Cargando ranking...</p>;
  if (filteredRanking.length === 0) return <p>No hay datos de ranking individual.</p>;

  return (
    <div className="module-container" style={{ marginTop: "20px" }}>
      <h2 style={{ color: "#ffd700", fontFamily: "'Cinzel', serif" }}>
        🏆 Ranking Individual
      </h2>

      <div style={{ margin: "10px 0" }}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "8px",
            border: "2px solid #ffd700",
            background: "#1b1b1b",
            color: "#fff",
            width: "100%",
            fontFamily: "'Cinzel', serif"
          }}
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#1b1b1b" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px", borderBottom: "2px solid #ffd700" }}>Posición</th>
              <th style={{ padding: "10px", borderBottom: "2px solid #ffd700" }}>Nombre</th>
              <th style={{ padding: "10px", borderBottom: "2px solid #ffd700" }}>XP Total</th>
              <th style={{ padding: "10px", borderBottom: "2px solid #ffd700" }}>Nivel</th>
            </tr>
          </thead>
          <tbody>
            {filteredRanking.map((u, index) => {
              const medalla = medallaInfo(index);
              // Convertimos número de nivel a texto
              const nivelTexto = rangos[(u.nivel || 1) - 1] || "Novato";

              return (
                <tr
                  key={`${u.id_usuario}-${index}`}
                  style={{
                    background: index < 3 ? medalla.color + "33" : "#1b1b1b",
                    color: "#fff",
                    textAlign: "center",
                    borderBottom: "1px solid #333",
                    fontWeight: index < 3 ? "bold" : "normal"
                  }}
                >
                  <td>
                    {index < 3
                      ? <FaMedal color={medalla.color} title={medalla.label} />
                      : index + 1}
                  </td>
                  <td>{u.nombre}</td>
                  <td>{u.xp || 0}</td>
                  <td>{nivelTexto}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingIndividual;
