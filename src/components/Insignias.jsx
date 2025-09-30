const Insignias = ({ insignias }) => {
  if (!Array.isArray(insignias)) {
    console.error("Insignias: insignias no es un array", insignias);
    return <p>Error cargando insignias.</p>;
  }

  return (
    <div className="module-container">
      <h2>Insignias</h2>
      <div className="insignias-list-rpg">
        {insignias.length > 0 ? insignias.map(i => (
          <div key={i.id_insignia} className="insignia-card-rpg">
            <img src={i.imagen} alt={i.nombre} />
            <p>{i.nombre}</p>
          </div>
        )) : <p>No hay insignias disponibles</p>}
      </div>
    </div>
  );
};

export default Insignias;
