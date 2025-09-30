import { useState } from "react";
import EvidenciaUpload from "./EvidenciaUpload.jsx";

const MisionCard = ({ mision }) => {
  const [mostrarEvidencia, setMostrarEvidencia] = useState(false);

  if (!mision || typeof mision !== "object") {
    console.error("MisionCard: mision inválida", mision);
    return <div className="mision-card">Datos de misión no disponibles</div>;
  }

  return (
    <div className="mision-card">
      <h4>{mision.nombre || "Nombre no disponible"}</h4>
      <p>{mision.descripcion || "Descripción no disponible"}</p>
      <p><strong>Tipo:</strong> {mision.tipo || "N/A"}</p>
      <p><strong>Dificultad:</strong> {mision.dificultad || "N/A"}</p>
      <p>
        <strong>Recompensas:</strong> XP: {mision.xp ?? 0}, Monedas: {mision.monedas ?? 0}, Gemas: {mision.gemas ?? 0}
      </p>
      <p><strong>Estado:</strong> {mision.estado || "desconocido"}</p>
      {mision.fecha_inicio && <p><strong>Inicio:</strong> {mision.fecha_inicio}</p>}
      {mision.fecha_fin && <p><strong>Fin:</strong> {mision.fecha_fin}</p>}

      <button onClick={() => setMostrarEvidencia(!mostrarEvidencia)}>
        {mostrarEvidencia ? "Cerrar Subir Evidencia" : "Subir Evidencia"}
      </button>

      {mostrarEvidencia && <EvidenciaUpload idMision={mision.id_mision} />}
    </div>
  );
};

export default MisionCard;
