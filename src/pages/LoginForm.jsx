import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../style.css";

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  try {
    await login(email, password);
  } catch (err) {
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else {
      setError("No se pudo conectar con el servidor");
    }
  }
};



  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/fantasy-7890233_1920.jpg)`,
      }}
    >
      <h1>Konquis Legends</h1>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "91%" }}
        />

        <div style={{ position: "relative", width: "100%", marginTop: "10px" }}>
          <input
            type={mostrarPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              paddingRight: "40px",
              boxSizing: "border-box",
            }}
          />
          <span
            onClick={() => setMostrarPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#fff",
              fontSize: "18px",
            }}
          >
            {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" style={{ marginTop: "15px" }}>
          Iniciar Sesión
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
