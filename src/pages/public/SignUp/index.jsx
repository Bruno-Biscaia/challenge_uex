import React, { useState } from "react";
import { Snackbar, Alert, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DataPersonalForm from "../../../components/DataPersonalForm";
import "./styles.css";

export default function SignUp() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmSenha: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

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
      users.push({
        nome: userDetails.nome,
        email: userDetails.email,
        senha: userDetails.senha,
      });
      localStorage.setItem("users", JSON.stringify(users));
      setSnackbarMessage("Usuário cadastrado com sucesso!");
      setAlertSeverity("success");
      setSnackbarOpen(true);
      navigate("/");
      return true;
    } else {
      setSnackbarMessage("Um usuário com este e-mail já existe.");
      setAlertSeverity("error");
      setSnackbarOpen(true);
      return false;
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      if (saveUserDetails(formValues)) {
        setFormValues({ nome: "", email: "", senha: "", confirmSenha: "" });
      }
    }
  }

  const fieldsSignUp = ["nome", "email", "senha", "confirmSenha"];

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <Typography component="h1" variant="h5" className="title">
          Cadastro de Usuários
        </Typography>
        <DataPersonalForm
          className="inputField"
          fields={fieldsSignUp}
          data={formValues}
          onChange={handleChange}
          validationErrors={formErrors}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className="button"
        >
          Cadastrar
        </Button>
      </form>
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
    </div>
  );
}
