// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import API from "../api/api.js"; // API base para login
import { jwtDecode } from "jwt-decode"; // ✅ Named export corregido

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------------------- LOGIN --------------------
  const login = async (email, password) => {
    try {
      const res = await API.post("/usuarios/login", { email, password });

      const token = res.data.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token); // { id_usuario, email, rol, nombre }

      setUser({
        id_usuario: decoded.id_usuario,
        email: decoded.email,
        rol: decoded.rol,
        nombre: decoded.nombre // ✅ Guardamos nombre
      });

      return res.data;
    } catch (err) {
      console.error("Error en login:", err);
      throw err;
    }
  };

  // -------------------- LOGOUT --------------------
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // -------------------- RECUPERAR USUARIO AL RECARGAR --------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id_usuario: decoded.id_usuario,
          email: decoded.email,
          rol: decoded.rol,
          nombre: decoded.nombre // ✅ Guardamos nombre
        });
      } catch (err) {
        console.error("Error al decodificar JWT:", err);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
