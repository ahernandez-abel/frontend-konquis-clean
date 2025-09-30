import axios from "axios";

// ------------------- URL BASE -------------------
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Crear instancia de Axios con baseURL
const API = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor para agregar token automáticamente a todas las solicitudes
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// ------------------ USUARIOS ------------------
export const loginUsuario = (email, password) =>
  API.post("/usuarios/login", { email, password });

export const registerUsuario = (userData) =>
  API.post("/usuarios/register", userData);

export const infoUsuario = () => API.get("/usuarios/info");

// ------------------ MISIONES ------------------
export const listarMisionesUsuario = () => API.get("/conquistador/misiones");
export const listarMisionesUnidadUsuario = () => API.get("/conquistador/misiones/unidad");
export const subirEvidencia = (data) => API.post("/conquistador/misiones/evidencia", data);

// ------------------ INSIGNIAS ------------------
export const listarInsignias = () => API.get("/conquistador/insignias");

// ------------------ RANKINGS ------------------
export const rankingIndividual = () => API.get("/conquistador/ranking/individual");
export const rankingUnidad = () => API.get("/conquistador/ranking/unidad");

// ------------------ UNIDAD ------------------
export const infoUnidad = () => API.get("/conquistador/unidad");

// ------------------ NOTIFICACIONES ------------------
export const listarNotificaciones = () => API.get("/conquistador/notificaciones");

// ------------------ TEMPORADA ------------------
export const resumenTemporada = () => API.get("/conquistador/temporada");

// ------------------ PROGRESO NIVEL ------------------
export const progresoNivel = () => API.get("/conquistador/progreso");

// ------------------- EXPORT -------------------
export default API;
