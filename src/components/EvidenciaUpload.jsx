import { useState } from "react";
import { subirEvidencia } from "../api/apiConquistador.js";

const EvidenciaUploadModal = ({ idMision, onClose }) => {
  const [tipo, setTipo] = useState("foto");
  const [archivo, setArchivo] = useState(null); // archivo físico
  const [urlArchivo, setUrlArchivo] = useState(""); // opcional URL
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("id_mision", idMision);
      formData.append("tipo", tipo);

      if (archivo) {
        formData.append("archivo", archivo); // Multer reconoce "archivo"
      } else if (urlArchivo.trim() !== "") {
        formData.append("url_archivo", urlArchivo);
      } else {
        setMensaje("❌ Debes subir un archivo o ingresar una URL");
        return;
      }

      await subirEvidencia(formData, true); // true indica que es multipart/form-data
      setMensaje("✅ Evidencia subida correctamente");
      setArchivo(null);
      setUrlArchivo("");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al subir evidencia");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}
    >
      <div
        style={{
          background: "linear-gradient(145deg, #1b1b1b, #2a2a2a)",
          border: "2px solid #ffd700",
          borderRadius: "12px",
          padding: "20px",
          width: "400px",
          maxWidth: "90%",
          boxShadow: "0 0 20px #ffd700",
          position: "relative",
          color: "#fff",
          fontFamily: "'Cinzel', serif"
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "18px",
            color: "#ffd700",
            cursor: "pointer"
          }}
        >
          ✖
        </button>

        <h3 style={{ color: "#ffd700", marginBottom: "15px" }}>Subir Evidencia</h3>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label style={{ fontWeight: "bold" }}>Tipo de evidencia:</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={{
              padding: "5px 10px",
              borderRadius: "8px",
              border: "2px solid #ffd700",
              background: "#000",
              color: "#ffd700"
            }}
          >
            <option value="foto">Foto</option>
            <option value="video">Video</option>
            <option value="texto">Texto</option>
          </select>

          <label style={{ fontWeight: "bold" }}>Archivo desde tu computadora:</label>
          <input
            type="file"
            onChange={(e) => setArchivo(e.target.files[0])}
            style={{
              padding: "5px",
              borderRadius: "8px",
              border: "2px solid #ffd700",
              background: "#000",
              color: "#fff"
            }}
          />

          <label style={{ fontWeight: "bold" }}>O URL del archivo:</label>
          <input
            type="text"
            value={urlArchivo}
            onChange={(e) => setUrlArchivo(e.target.value)}
            placeholder="Ingrese URL del archivo"
            style={{
              padding: "5px 10px",
              borderRadius: "8px",
              border: "2px solid #ffd700",
              background: "#000",
              color: "#fff"
            }}
          />

          <button
            type="submit"
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#ffd700",
              color: "#000",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Subir Evidencia
          </button>
        </form>

        {mensaje && (
          <p style={{ marginTop: "10px", fontWeight: "bold", color: mensaje.includes("Error") ? "#ff4d4d" : "#28a745" }}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};

export default EvidenciaUploadModal;
