import React, { useState, useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { GoogleMap, Marker } from "@react-google-maps/api";
import SortIcon from "@mui/icons-material/Sort";

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
  const [loadScriptKey, setLoadScriptKey] = useState(0);
  const [mapLocation, setMapLocation] = useState({
    lat: -25.4296, // Coordenadas de Curitiba
    lng: -49.2716,
    // label: "",
  });

  const [contacts, setContacts] = useState(() => {
    const savedContacts = localStorage.getItem("contacts");
    return savedContacts ? JSON.parse(savedContacts) : [];
  });

  console.log(contacts);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortAscending, setSortAscending] = useState(true);

  const handleToggleSort = () => {
    setSortAscending(!sortAscending);
  };

  const filteredContacts = contacts
    .filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.cpf.includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortAscending) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  const handleChangeSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  console.log("MAPLOCATION", mapLocation);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentContact, setCurrentContact] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    address: "",
    cep: "",
    number: "",
    neighborhood: "",
    city: "",
    country: "",
    latitude: "",
    longitude: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

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
    if (!place.geometry) {
      alert("No details available for input: " + place.name);
      return;
    }

    const fullAddress = place.formatted_address;
    const components = place.address_components;

    const position = place.geometry.location;
    const lat = position.lat();
    const lng = position.lng();

    if (!lat || !lng) {
      console.error("Invalid latitude or longitude values.");
      return;
    }

    const cep =
      components.find((c) => c.types.includes("postal_code"))?.long_name || "";
    const street =
      components.find((c) => c.types.includes("route"))?.long_name || "";
    const neighborhood =
      components.find((c) => c.types.includes("sublocality_level_1"))
        ?.long_name || "";
    const city =
      components.find((c) => c.types.includes("administrative_area_level_2"))
        ?.long_name || "";
    const country =
      components.find((c) => c.types.includes("country"))?.long_name || "";

    await validateCep(cep.replace(/\D/g, ""));

    setMapLocation({
      lat: lat,
      lng: lng,
      label: `${currentContact.number}`,
    });

    // Atualiza apenas os campos relacionados ao endereço
    setCurrentContact((prev) => ({
      ...prev,
      fullAddress: fullAddress, // Ajuste com base na sua lógica de estado
      address: street,
      cep: cep,
      neighborhood: neighborhood,
      city: city,
      country: country,
      latitude: lat,
      longitude: lng,
      number: currentContact.number,
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [accountPassword, setAccountPassword] = useState("");
  const handleDeleteAccount = () => {
    if (accountPassword === currentUser?.password) {
      localStorage.clear();
      logout();
      navigate("/");
      setDeleteAccountOpen(false);
      setAccountPassword("");
    } else {
      setError("Senha incorreta!");
    }
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
      number: "",
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

  useEffect(() => {
    if (openDialog) {
      setLoadScriptKey((prevKey) => prevKey + 1); // Incrementa a chave para forçar o recarregamento do LoadScript
    }
  }, [openDialog]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
      <Button
          variant="contained"
          color="error"
          onClick={() => setDeleteAccountOpen(true)}
          sx={{ mb: 3 }}
        >
          Excluir Conta
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ mb: 3 }}
        >
          Logout
        </Button>
      </div>

      <Dialog
        open={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmação de Exclusão de Conta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Insira sua senha para confirmar a exclusão da conta.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Senha"
            type="password"
            fullWidth
            value={accountPassword}
            onChange={(e) => setAccountPassword(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccountOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteAccount} color="secondary">
            Confirmar Exclusão
          </Button>
        </DialogActions>
      </Dialog>





      <Typography variant="h4" gutterBottom>
        Gerenciador de Contatos
      </Typography>
      <Button
        style={{ marginBottom: "20px" }}
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
      >
        Adicionar Contato
      </Button>

      <Grid container spacing={2}>
        {/* Coluna de Contatos */}

        <Grid item xs={6}>
          <Paper
            style={{
              height: "100vh",
              padding: "1em",
              border: "1px solid #bdbdbd",
            }}
            elevation={3}
          >
            <Typography variant="h6">Lista de Contatos</Typography>
            <List>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <TextField
                  label="Buscar por Nome ou CPF"
                  variant="outlined"
                  value={searchTerm}
                  onChange={handleChangeSearchTerm}
                  style={{ flexGrow: 1, marginRight: "10px" }}
                />
                <Button onClick={handleToggleSort} variant="outlined">
                  <SortIcon
                    style={{
                      transform: sortAscending
                        ? "rotate(0deg)"
                        : "rotate(180deg)",
                    }}
                  />
                </Button>
              </div>
              {filteredContacts.map((contact, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`${contact.name} - CPF: ${contact.cpf}`}
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2">
                          Email: {contact.email}, Telefone: {contact.telefone}
                        </Typography>
                        <Typography component="span" variant="body2">
                          <div>
                            {`Endereço: ${
                              contact.address ? contact.address + "," : ""
                            } ${contact.number ? contact.number : ""}`}
                          </div>
                        </Typography>
                        <Typography component="span" variant="body2">
                          <div>
                            {contact.city} - {contact.neighborhood}
                          </div>
                        </Typography>
                        <Typography component="span" variant="body2">
                          <div>{contact.country}</div>
                        </Typography>
                      </React.Fragment>
                    }
                    onClick={() => {
                      setMapLocation({
                        lat: contact.latitude,
                        lng: contact.longitude,
                        label: contact.number,
                      });
                      // Remova o alert se não desejar mais utilizá-lo
                      alert(
                        `Latitude: ${contact.latitude}, Longitude: ${contact.longitude}, Label: ${contact.number}`
                      );
                    }}
                    style={{ cursor: "pointer" }}
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
          <Paper
            style={{
              height: "100vh",
              padding: "1em",
              border: "1px solid #bdbdbd",
            }}
            elevation={3}
          >
            <Typography variant="h6">Mapa</Typography>

            <LoadScript
              googleMapsApiKey="AIzaSyCaY_sFfo3DKewKbbSnYbNClmv4Q0DRqUg"
              libraries={["places"]}
            >
              <GoogleMap
                key={mapLocation.lat + mapLocation.lng}
                mapContainerStyle={{ width: "100%", height: "90%" }}
                center={{ lat: mapLocation.lat, lng: mapLocation.lng }}
                zoom={16}
              >
                <Marker
                  position={{ lat: mapLocation.lat, lng: mapLocation.lng }}
                  label={mapLocation.label}
                />
              </GoogleMap>
            </LoadScript>
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
          {["name", "email", "phone", "cpf"].map((field) => (
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
            key={loadScriptKey}
            googleMapsApiKey="AIzaSyCaY_sFfo3DKewKbbSnYbNClmv4Q0DRqUg"
            libraries={["places"]}
          >
            <Grid container spacing={2} style={{ marginTop: "10px" }}>
              <Grid item xs={12}>
                <Autocomplete
                  onLoad={(autocomplete) => {
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
                  }}
                >
                  <TextField
                    label="Buscar Endereço"
                    value={currentContact.fullAddress}
                    onChange={handleChangeContact}
                    onFocus={() =>
                      setCurrentContact((prev) => ({
                        ...prev,
                        fullAddress: "",
                      }))
                    } // Limpa o campo ao receber foco
                    fullWidth
                    variant="outlined"
                    name="fullAddress"
                  />
                </Autocomplete>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="CEP"
                  value={currentContact.cep}
                  fullWidth
                  variant="outlined"
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
                  placeholder="Endereço"
                  value={currentContact.address}
                  fullWidth
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Numero"
                  name="number"
                  value={currentContact.number}
                  onChange={handleChangeContact}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  placeholder="Bairro"
                  value={currentContact.neighborhood}
                  fullWidth
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Cidade"
                  value={currentContact.city}
                  fullWidth
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="País"
                  value={currentContact.country}
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
