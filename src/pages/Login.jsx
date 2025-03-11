import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react"; // Importamos los iconos
import "../style/Login.css";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Hook para redirigir

  // Usuarios permitidos
  const users = {
    "angel.admin": "admin",
    "1": "desarrollo",
    "juarez": "soporte",
    "alvizo":"desarrollo"
  };


  // Función de login
  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (users[username] && password == "1" ) {
      setError("");
      Swal.fire({
        title: `¡Bienvenido, ${users[username]}! `,
        text: "Has iniciado sesión en Visitapp.",
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        setAuth(true);
        navigate("/dashboard");

      });
    } else {
      setError("Usuario o contraseña incorrectos.");
      Swal.fire({
        title: "Error 🚨",
        text: "Usuario o contraseña incorrectos.",
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="logo-01.png" alt="Visitapp Logo" className="logo" />
        <form className="form" onSubmit={handleLogin}>
          {/* Input Usuario */}
          <div className="form_control">
            <input
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label className="label">Usuario</label>
          </div>

          {/* Input Contraseña con Icono a la Derecha */}
          <div className="form_control password-container">
            <input
              type={showPassword ? "text" : "password"}
              className="input password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="label">Contraseña</label>
            {/* Icono fuera del input */}
            <button
              type="button"
              className="eye-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
