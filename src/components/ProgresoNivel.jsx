import { useState, useEffect } from "react";
import API from "../api/apiConquistador";

const ProgresoNivel = ({ idUsuario }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchProgreso = async () => {
      try {
        const res = await API.get(`/usuario/${idUsuario}/progreso`);
        setUsuario(res.data.data);
      } catch (err) {
        console.error("Error cargando progreso:", err);
      }
    };
    fetchProgreso();
  }, [idUsuario]);

  if (!usuario) return <p>Cargando progreso...</p>;

  const { nivel, xpActual, xpMax, monedas, gemas } = usuario;
  const porcentaje = Math.min(100, (xpActual / xpMax) * 100);

  return (
    <div className="module-container">
      <h2>Progreso de Nivel</h2>
      <p><strong>Nivel:</strong> {nivel}</p>
      <p><strong>XP:</strong> {xpActual} / {xpMax}</p>

      <div className="barra-progreso-rpg">
        <div
          className="barra-llenado-rpg"
          style={{ width: `${porcentaje}%` }}
        ></div>
      </div>

      <div style={{ marginTop: "10px" }}>
        <p>Monedas: {monedas}</p>
        <p>Gemas: {gemas}</p>
      </div>
    </div>
  );
};

export default ProgresoNivel;
