import axios from "axios";

// Crear instancia de Axios con baseURL
const API = axios.create({
  baseURL: "http://localhost:5000/api",
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

// ------------------ MISIONES ------------------
export const listarMisionesUsuario = () => API.get("/conquistador/misiones"); 
// GET /api/conquistador/misiones → retorna { individuales: [], unidad: [] }

export const listarMisionesUnidadUsuario = () => API.get("/conquistador/misiones/unidad"); // NUEVO
// GET /api/conquistador/misiones/unidad → retorna solo misiones de unidad asignadas al usuario

export const subirEvidencia = (data) => API.post("/conquistador/misiones/evidencia", data);
// POST /api/conquistador/misiones/evidencia → { id_mision, tipo, url_archivo }

// ------------------ INSIGNIAS ------------------
export const listarInsignias = () => API.get("/conquistador/insignias");
// GET /api/conquistador/insignias → array de insignias del usuario

// ------------------ RANKINGS ------------------
export const rankingIndividual = () => API.get("/conquistador/ranking/individual");
// GET /api/conquistador/ranking/individual → ranking usuarios

export const rankingUnidad = () => API.get("/conquistador/ranking/unidad");
// GET /api/conquistador/ranking/unidad → ranking unidades

// ------------------ UNIDAD ------------------
export const infoUnidad = () => API.get("/conquistador/unidad");
// GET /api/conquistador/unidad → información de la unidad del usuario

// ------------------ NOTIFICACIONES ------------------
export const listarNotificaciones = () => API.get("/conquistador/notificaciones");
// GET /api/conquistador/notificaciones → notificaciones del usuario

// ------------------ TEMPORADA ------------------
export const resumenTemporada = () => API.get("/conquistador/temporada");
// GET /api/conquistador/temporada → resumen de la última temporada

// ------------------ PROGRESO NIVEL ------------------
export const progresoNivel = () => API.get("/conquistador/progreso");
// GET /api/conquistador/progreso → xp, nivel, puntos para siguiente nivel

// ------------------ INFO USUARIO ------------------
export const infoUsuario = () => API.get("/usuarios/info");
// GET /api/usuarios/info → información del usuario autenticado

// Exportación por defecto (opcional)
export default API;
