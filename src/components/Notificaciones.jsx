const Notificaciones = ({ notificaciones }) => {
  if (!Array.isArray(notificaciones) || notificaciones.length === 0) {
    return <p>No hay notificaciones.</p>;
  }

  return (
    <div className="module-container">
      <h2>Notificaciones</h2>
      <div className="notificaciones-list-rpg">
        {notificaciones.map(n => (
          <div 
            key={n.id_notificacion} 
            className={`notificacion-card-rpg ${n.leida ? "leida" : "noleida"}`}
          >
            <p>{n.mensaje}</p>
            <small>{new Date(n.fecha).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notificaciones;
