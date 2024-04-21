import React, { useState, useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid,
  Paper,
  InputAdornment,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Contexts/AuthContext";
import "./styles.css";

export default function Home() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const [contacts, setContacts] = useState(() => {
    const savedContacts = localStorage.getItem("contacts");
    return savedContacts ? JSON.parse(savedContacts) : [];
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [currentContact, setCurrentContact] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    address: "",
    cep: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    country: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const [fields, setFields] = useState({
    fullAddress: "",
    address: "",
    cep: "",
    neighborhood: "",
    city: "",
    country: "",
  });
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [cepValid, setCepValid] = useState(false);
  const validateCep = async (cep) => {
    if (cep?.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setCepValid(true);
          return true;
        }
      } catch (error) {
        console.error("Erro ao validar CEP:", error);
      }
    }
    setCepValid(false);
    return false;
  };

  const handlePlaceSelect = async (autocomplete) => {
    const place = autocomplete.getPlace();
    const fullAddress = place.formatted_address; // Endereço completo
    const components = place.address_components;
  
    const cep = components.find((c) => c.types.includes("postal_code"))?.long_name || "";
    const street = components.find((c) => c.types.includes("route"))?.long_name || "";
    const neighborhood = components.find((c) => c.types.includes("sublocality_level_1"))?.long_name || "";
    const city = components.find((c) => c.types.includes("administrative_area_level_2"))?.long_name || "";
    const country = components.find((c) => c.types.includes("country"))?.long_name || "";
  
    await validateCep(cep.replace(/\D/g, "")); // Validação de CEP
  
    // Atualiza apenas os campos relacionados ao endereço
    setCurrentContact((prev) => ({
      ...prev,
      fullAddress: fullAddress, // Ajuste com base na sua lógica de estado
      address: street,
      cep: cep,
      neighborhood: neighborhood,
      city: city,
      country: country
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const validateContact = (contact, index) => {
    let errors = {};
    // // Validate CPF
    // if (!cpf.isValid(contact.cpf)) {
    //   errors.cpf = "CPF inválido.";
    // } else if (
    //   contacts.some((c, idx) => c.cpf === contact.cpf && idx !== index)
    // ) {
    //   errors.cpf = "CPF duplicado.";
    // }

    // Validate Email
    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    //   errors.email = "Email inválido.";
    // }

    // // Validate Phone
    // if (!/^\d{10,11}$/.test(contact.phone)) {
    //   errors.phone = "Telefone inválido. Deve ter 10 ou 11 dígitos.";
    // }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenDialog = (
    contact = {
      name: "",
      email: "",
      phone: "",
      cpf: "",
    },
    isEditMode = false,
    index = -1
  ) => {
    setCurrentContact(contact);
    setEditMode(isEditMode);
    setOpenDialog(true);
    setCurrentIndex(index);
    setValidationErrors({});
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddOrEditContact = () => {
    if (validateContact(currentContact, currentIndex)) {
      const updatedContacts = editMode
        ? contacts.map((c, idx) => (idx === currentIndex ? currentContact : c))
        : [...contacts, currentContact];
      setContacts(updatedContacts);
      localStorage.setItem("contacts", JSON.stringify(updatedContacts)); // Assegure-se de que os contatos atualizados são armazenados
      handleCloseDialog();
    }
  };
  

  const handleOpenDeleteConfirm = (index) => {
    setCurrentIndex(index);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteContact = () => {
    if (password === currentUser?.password) {
      const newContacts = contacts.filter((_, i) => i !== currentIndex);
      setContacts(newContacts);
      setDeleteConfirmOpen(false);
      setPassword("");
      setError("");
    } else {
      setError("Senha incorreta!");
    }
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setPassword("");
  };

  const handleChangePasswordToDelete = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeContact = (e) => {
    const { name, value } = e.target;
    setCurrentContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        sx={{ my: 2 }}
      >
        Logout
      </Button>

      <Typography variant="h4" gutterBottom>
        Gerenciador de Contatos
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
      >
        Adicionar Contato
      </Button>

      <Grid container spacing={2}>
        {/* Coluna de Contatos */}
        <Grid item xs={6}>
          <Paper style={{ height: "100vh", padding: "1em" }}>
            <Typography variant="h6">Contatos</Typography>
            <List>
              {contacts.map((contact, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`${contact.nome} - CPF: ${contact.cpf}`}
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2">
                          Email: {contact.email}, Telefone: {contact.telefone}
                        </Typography>
                        <Typography component="span" variant="body2">
                          Endereço: {contact.address}, Número: {contact.number},
                          Complemento: {contact.complement}
                        </Typography>
                        <Typography component="span" variant="body2">
                          Bairro:{contact.neighborhood} Cidade:{" "}
                          {contact.city}, País: {contact.country}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleOpenDialog(contact, true, index)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleOpenDeleteConfirm(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Coluna do Mapa */}
        <Grid item xs={6}>
          <Paper style={{ height: "100vh", padding: "1em" }}>
            <Typography variant="h6">Mapa</Typography>
            {/* Aqui você pode integrar o componente do mapa */}
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "Editar Contato" : "Adicionar Contato"}
        </DialogTitle>

        <DialogContent id="dialog-content">
          {["nome", "email", "telefone", "cpf"].map((field) => (
            <TextField
              key={field}
              margin="dense"
              label={field[0].toUpperCase() + field.slice(1)}
              type="text"
              fullWidth
              name={field}
              value={currentContact[field]}
              onChange={handleChangeContact}
              error={!!validationErrors[field]}
              helperText={validationErrors[field]}
            />
          ))}

          <LoadScript
            googleMapsApiKey="AIzaSyCaY_sFfo3DKewKbbSnYbNClmv4Q0DRqUg"
            libraries={["places"]}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  onLoad={(autocomplete) => {
                    setTimeout(() => {
                      autocomplete.setFields([
                        "address_components",
                        "formatted_address",
                        "geometry",
                      ]);
                      autocomplete.addListener("place_changed", () =>
                        handlePlaceSelect(autocomplete)
                      );
                      // Ajustar o estilo do container do Autocomplete
                      if (document.querySelector(".pac-container")) {
                        document.querySelector(".pac-container").style.zIndex =
                          "2000";
                      }
                    }, 100); // Delay pode ser ajustado conforme necessário
                  }}
                >
                  <TextField
                    label="Buscar Endereço"
                    value={currentContact.fullAddress}
                    onChange={handleChangeContact}
                    fullWidth
                    variant="outlined"
                  />
                </Autocomplete>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="CEP"
                  value={currentContact.cep}
                  fullWidth
                  variant="outlined"
                  onChange={handleChangeContact}
                  InputProps={{
                    endAdornment: cepValid ? (
                      <InputAdornment position="end">
                        <CheckIcon color="success" />
                      </InputAdornment>
                    ) : null,
                  }}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Endereço"
                  value={contacts.address}
                  onChange={handleChangeContact}
                  fullWidth
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Numero"
                  value={currentContact.number}
                  onChange={(e) => setNumber(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Complemento"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Bairro"
                  value={currentContact.neighborhood}
                  onChange={handleChangeContact}
                  fullWidth
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Cidade"
                  value={currentContact.city}
                  onChange={handleChangeContact}
                  fullWidth
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="País"
                  value={currentContact.country}
                  onChange={handleChangeContact}
                  fullWidth
                  variant="outlined"
                  disabled
                />
              </Grid>
            </Grid>
          </LoadScript>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddOrEditContact} color="primary">
            {editMode ? "Salvar" : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmação de Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Insira sua senha para confirmar a exclusão do contato.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Senha"
            type="password"
            fullWidth
            value={password}
            onChange={handleChangePasswordToDelete}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteContact} color="secondary">
            Confirmar Exclusão
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
