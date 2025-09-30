const TemporadaResumen = ({ temporada }) => {
  if (!temporada || Object.keys(temporada).length === 0) {
    return <p>No hay información de la temporada actual.</p>;
  }

  return (
    <div className="module-container">
      <h2>Resumen de Temporada</h2>

      <div className="temporada-card-rpg">
        <p><strong>Nombre:</strong> {temporada.nombre}</p>
        <p><strong>Fecha de Inicio:</strong> {new Date(temporada.fecha_inicio).toLocaleDateString()}</p>
        <p><strong>Fecha de Fin:</strong> {new Date(temporada.fecha_fin).toLocaleDateString()}</p>
        <p><strong>Misiones Asignadas:</strong> {temporada.misiones_asignadas}</p>
        <p><strong>Misiones Completadas:</strong> {temporada.misiones_completadas}</p>
      </div>
    </div>
  );
};

export default TemporadaResumen;
