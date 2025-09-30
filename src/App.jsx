// src/App.jsx
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.js";
import LoginForm from "./pages/LoginForm.jsx";
import Dashboard from "./pages/dashboard.jsx";
import ConquistadorDashboard from "./pages/ConquistadorDashboard.jsx";

// Importar react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { user } = useContext(AuthContext);

  // Si no hay usuario, mostramos el login
  if (!user) return (
    <>
      <LoginForm />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );

  // Redirigir según rol
  if (user.rol === "administrador") {
    return (
      <>
        <Dashboard />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
      </>
    );
  } else if (user.rol === "conquistador") {
    return (
      <>
        <ConquistadorDashboard />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
      </>
    );
  }

  // Por defecto, mostrar login si el rol no es reconocido
  return (
    <>
      <LoginForm />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
}

export default App;
