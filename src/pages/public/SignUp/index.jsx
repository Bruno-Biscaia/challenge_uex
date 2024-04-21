import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmSenha: "",
  });
  const [formErrors, setFormErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  }

  function validate(values) {
    let errors = {};
    if (!values.nome) {
      errors.nome = "O nome é obrigatório.";
    }
    if (!values.email) {
      errors.email = "O e-mail é obrigatório.";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "O e-mail está inválido.";
    }
    if (!values.senha) {
      errors.senha = "A senha é obrigatória.";
    }
    if (!values.confirmSenha) {
      errors.confirmSenha = "A confirmação da senha é obrigatória.";
    } else if (values.senha !== values.confirmSenha) {
      errors.confirmSenha = "As senhas não coincidem.";
    }
    return errors;
  }

  function saveUserDetails(userDetails) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (!users.some((user) => user.email === userDetails.email)) {
      // Verifica se o email já existe
      users.push({
        nome: userDetails.nome,        
        email: userDetails.email,
        senha: userDetails.senha, // Nota: Armazenar senhas em texto puro é inseguro, considere usar hashing.
      });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Usuário cadastrado com sucesso!");
      navigate("/")
      return true;
    } else {
      alert("Um usuário com este e-mail já existe.");
      return false;
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      if (saveUserDetails(formValues)) {
        // Limpa o formulário ou redireciona o usuário
        setFormValues({ nome: "", email: "", senha: "", confirmSenha: "" });
      }
    }
  }

  return (
    <>
      <Typography component="h1" variant="h5">
        Cadastro
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="nome"
          label="Nome Completo"
          name="nome"
          autoComplete="name"
          autoFocus
          value={formValues.nome}
          onChange={handleChange}
          error={Boolean(formErrors.nome)}
          helperText={formErrors.nome}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Endereço de E-mail"
          name="email"
          autoComplete="email"
          value={formValues.email}
          onChange={handleChange}
          error={Boolean(formErrors.email)}
          helperText={formErrors.email}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="senha"
          label="Senha"
          type="password"
          id="senha"
          autoComplete="new-password"
          value={formValues.senha}
          onChange={handleChange}
          error={Boolean(formErrors.senha)}
          helperText={formErrors.senha}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirmSenha"
          label="Confirme a Senha"
          type="password"
          id="confirmSenha"
          autoComplete="new-password"
          value={formValues.confirmSenha}
          onChange={handleChange}
          error={Boolean(formErrors.confirmSenha)}
          helperText={formErrors.confirmSenha}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Cadastrar
        </Button>
      </form>
    </>
  );
}
