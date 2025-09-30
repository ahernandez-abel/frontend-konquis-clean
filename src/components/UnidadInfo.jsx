const UnidadInfo = ({ unidad }) => {
  if (!unidad) return <p>No perteneces a ninguna unidad.</p>;

  const miembros = unidad.miembros || [];
  const cantidadMiembros = miembros.length;

  const lider = miembros.find(m => m.esLider)?.nombre || "No definido";

  return (
    <div className="module-container">
      <h2>Información de la Unidad</h2>
      <div className="unidad-card-rpg">
        <p>
          <strong>Nombre de la unidad:</strong> {unidad.nombre} {cantidadMiembros > 0 && `(${cantidadMiembros} miembros)`}
        </p>
        <p><strong>Líder:</strong> {lider}</p>
        <p><strong>Miembros:</strong></p>
        {cantidadMiembros > 0 ? (
          <ul>
            {miembros.map(miembro => (
              <li key={miembro.id_usuario}>
                {miembro.nombre} {miembro.esLider && "(Líder)"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No disponible</p>
        )}
        {unidad.descripcion && <p><strong>Descripción:</strong> {unidad.descripcion}</p>}
      </div>
    </div>
  );
};

export default UnidadInfo;
