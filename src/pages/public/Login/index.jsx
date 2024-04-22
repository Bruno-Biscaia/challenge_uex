import React, { useState } from "react";
import { TextField, Button, Typography, Box, Snackbar, Alert } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Contexts/AuthContext'; 
import "./styles.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();  
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    function authenticate(email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.some(user => user.email === email && user.senha === password);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (authenticate(email, password)) {
            setSnackbarMessage("Usuário autenticado com sucesso.");
            setAlertSeverity("success");
            setSnackbarOpen(true);
            login(email, password);  
            navigate('/home'); 
        } else {
            setSnackbarMessage("Usuário não encontrado ou senha incorreta.");
            setAlertSeverity("error");
            setSnackbarOpen(true);
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
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={alertSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
