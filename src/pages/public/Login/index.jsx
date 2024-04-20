import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();  // Para redirecionar o usuário após login bem-sucedido
  
    function authenticate(email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.some(user => user.email === email && user.senha === password);
      }


      function handleSubmit(event) {
        event.preventDefault();
        if (authenticate(email, password)) {
          alert("Usuário autenticado com sucesso.");
          localStorage.setItem('isAuthenticated', 'true'); // Opcional: salvar autenticação no localStorage
          localStorage.setItem('currentUser', email);
          navigate('/home'); // Redirecionar para a página inicial ou dashboard
        } else {
          alert("Usuário não encontrado ou senha incorreta.");  // Mostrar mensagem de erro
        }
      }

  return (
    <>
      <Typography component="h1" variant="h5">
        Entrar
      </Typography>
      <form onSubmit={handleSubmit}>
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
    </>
  );
}
