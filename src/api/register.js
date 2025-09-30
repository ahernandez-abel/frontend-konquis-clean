import { registerUser } from "../api/register.js";

const handleRegister = async () => {
  try {
    const data = await registerUser({ nombre, email, password, rol });
    console.log("Usuario registrado:", data);
  } catch (err) {
    console.error("Error registrando usuario:", err);
  }
};
