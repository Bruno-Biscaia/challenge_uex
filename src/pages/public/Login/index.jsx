import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Contexts/AuthContext";
import "./styles.css";
import { decryptData } from "../../../utils/crypto";

export default function Login() {
  //ESTADOS QUE CONTROLAM FORM(EMAIL E SENHA)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  //ESTADOS QUE CONTROLAM A BARRA DE SNACKBAR (Mensagens)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleCloseSnackbar = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  //FUNCAO DE AUTENTICAÇAO
  function authenticate(email, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => {
        const userEmail = decryptData(user.email, email);
        const userPassword = decryptData(user.senha, email);
        return userEmail === email && userPassword === password;
    });
    return user;
}

  function handleSubmit(event) {
    event.preventDefault();
    const user = authenticate(email, password);
    if (user) {
      setSnackbarMessage("Usuário autenticado com sucesso.");
      setAlertSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
        login(user);
        navigate("/home");
      }, 3000);
    } else {
      setSnackbarMessage("Usuário não encontrado ou senha incorreta.");
      setAlertSeverity("error");
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 3000);
    }
  }

  return (
    <Box className="loginBox">
      <Typography component="h1" variant="h5">
        Entrar
      </Typography>
      <form onSubmit={handleSubmit} className="loginForm">
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Endereço de E-mail"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Senha"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Entrar
        </Button>
      </form>
      <div>
        Não tem uma conta? <Link to="/signup">Cadastre-se</Link>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
