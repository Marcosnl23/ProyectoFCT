import React, { useState } from "react";
import { Form, Button, Navbar, Container, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import logo from "../../assets/logo.png";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/api/generate-token",
        {
          username,
          password,
        }
      );

      localStorage.setItem("token", response.data);
      window.location.href = "/welcome";
    } catch (err) {
      setError("Error al iniciar sesión usuario o contraseña incorrectos");
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  return (
    <>
      {/* Login Form */}
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          background: "linear-gradient(135deg, #6c8eb0, #3a5a7d)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "400px",
            backgroundColor: "white",
            borderRadius: "15px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(to right, #5b7d9c, #3a5a7d)",
              color: "white",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <div className="d-flex justify-content-center align-items-center mb-3">
              <img
                src={logo}
                alt="Logo"
                style={{
                  height: "60px",
                  width: "auto",
                  marginRight: "10px",
                }}
              />
            </div>
            <h2>Iniciar Sesión</h2>
          </div>

          <Form onSubmit={handleSubmit} className="p-4">
            <Form.Group className="mb-3 position-relative">
              <div style={{ position: "relative" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "12px",
                    color: "#5b7d9c",
                  }}
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <Form.Control
                  type="text"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    paddingLeft: "40px",
                    borderRadius: "10px",
                    border: "1px solid #5b7d9c",
                  }}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3 position-relative">
              <div style={{ position: "relative" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "12px",
                    color: "#5b7d9c",
                  }}
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    paddingLeft: "40px",
                    paddingRight: "40px",
                    borderRadius: "10px",
                    border: "1px solid #5b7d9c",
                  }}
                />
                {/* Icono para mostrar/ocultar contraseña */}
                <div
                  onClick={handleShowPassword}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "12px",
                    color: "#5b7d9c",
                    cursor: "pointer"
                  }}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </div>
              </div>
            </Form.Group>

            {error && (
              <div className="text-danger text-center mb-3">{error}</div>
            )}

            <Button
              type="submit"
              className="w-100"
              style={{
                background: "linear-gradient(to right, #5b7d9c, #3a5a7d)",
                border: "none",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              Iniciar Sesión
            </Button>

            <div className="text-center mt-3" style={{ fontSize: "14px" }}>
              <span style={{ color: "#5b7d9c" }}>O inicia sesión con</span>
            </div>

            <div className="text-center mt-3">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const { credential } = credentialResponse;
                  console.log(credentialResponse);

                  try {
                    const res = await axios.post(
                      "http://localhost:8080/auth/api/google-login",
                      {
                        token: credential,
                      }
                    );

                    localStorage.setItem("token", res.data.token);
                    window.location.href = "/welcome";
                  } catch (err) {
                    setError("Error al iniciar sesión con Google");
                    console.error(err);
                  }
                }}
                onError={() => {
                  setError("Fallo la autenticación con Google");
                }}
              />
            </div>

            <div className="text-center mt-3">
              <Button
                variant="link"
                href="/register"
                style={{
                  color: "#3a5a7d",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                ¿No tienes cuenta? Regístrate aquí
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Login;