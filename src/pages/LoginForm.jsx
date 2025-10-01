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
      <div className="login-overlay"></div>

      <h1>Konquis Legends</h1>

      <form onSubmit={handleLogin} className="login-form">
        {/* Email */}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <div className="password-wrapper">
          <input
            type={mostrarPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span onClick={() => setMostrarPassword((prev) => !prev)}>
            {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Botón */}
        <button type="submit">Iniciar Sesión</button>

        {/* Error */}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
