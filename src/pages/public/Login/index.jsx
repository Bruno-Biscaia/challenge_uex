import React, { useState } from "react";
import { TextField, Button, Typography, Box  } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Contexts/AuthContext'; 

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();  

    function authenticate(email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.some(user => user.email === email && user.senha === password);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (authenticate(email, password)) {
          alert("Usuário autenticado com sucesso.");
          login(email, password);  
          navigate('/home'); 
        } else {
          alert("Usuário não encontrado ou senha incorreta.");
        }
    }

    return (
         <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          boxShadow: 3,
          padding: 3,
          borderRadius: 1,
          borderColor: 'grey.500',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}>
          <Typography component="h1" variant="h5">
            Entrar
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360 }}>
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
        </Box>
    );
}
