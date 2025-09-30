import React from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.js"; // ✅ import correcto
import App from "./App.jsx";
import "./style.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
