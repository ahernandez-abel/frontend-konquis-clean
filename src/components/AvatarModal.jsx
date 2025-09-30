import { useState, useEffect } from "react";
import API from "../api/apiConquistador.js";

export const AvatarModal = ({ onClose, actualizarAvatar }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/usuarios/info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.data?.avatar) {
          setPreviewUrl(res.data.data.avatar);
        }
      } catch (err) {
        console.error("Error al cargar avatar:", err);
      }
    };
    fetchUsuario();
  }, []);

  useEffect(() => {
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setSubiendo(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const token = localStorage.getItem("token");
      const res = await API.post("/usuarios/avatar", formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      });

      const avatarUrl = res.data.data.avatar.startsWith("http")
        ? res.data.data.avatar
        : `http://localhost:5000/uploads/avatars/${res.data.data.avatar}`;

      actualizarAvatar(avatarUrl);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error al subir el avatar.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-avatar"
        style={{
          background: "#1e1e1e",
          padding: "25px",
          borderRadius: "14px",
          border: "4px solid #ffd700",
          width: "600px",
          height: "400px",
          display: "flex",
          flexDirection: "row", // <-- avatar a la izquierda, datos a la derecha
          alignItems: "center",
          justifyContent: "flex-start",
          overflowY: "auto",
          fontFamily: "'Press Start 2P', cursive",
        }}
      >
        {/* IZQUIERDA: AVATAR */}
        <div style={{ flex: "0 0 250px", textAlign: "center", marginRight: "30px" }}>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview Avatar"
              style={{
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                border: "3px solid #ffd700",
                objectFit: "cover",
              }}
            />
          )}
        </div>

        {/* DERECHA: DATOS Y BOTONES */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h3 style={{ marginBottom: "20px", color: "#ffd700" }}>Selecciona un avatar</h3>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              marginBottom: "20px",
              padding: "8px",
              borderRadius: "6px",
              background: "#333",
              color: "#fff",
              border: "1px solid #ffd700",
              cursor: "pointer",
              width: "100%",
              textAlign: "center",
            }}
          />

          {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

          <div
            className="modal-buttons"
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "auto",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <button
              onClick={handleUpload}
              disabled={subiendo || !selectedFile}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#28a745",
                color: "#fff",
                cursor: subiendo || !selectedFile ? "not-allowed" : "pointer",
              }}
            >
              {subiendo ? "Subiendo..." : "Subir Avatar"}
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#dc3545",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
