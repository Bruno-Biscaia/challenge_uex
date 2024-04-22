import React, { useState, useEffect } from "react";
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
  Grid,
  Paper,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Contexts/AuthContext";

import {
  isValidCPF,
  isValidEmail,
  isValidPhone,
  validateCep,
} from "../../../utils/Validators/inputValidator";

import "./styles.css";
import Modal from "../../../components/Modal";
import DataPersonalForm from "../../../components/DataPersonalForm";
import FormTextField from "../../../components/AddressForm";
import { decryptData, encryptData } from "../../../utils/crypto";

export default function Home() {
  const navigate = useNavigate();

  //Estados de contexto global
  const { logout, currentUser } = useAuth();  
  const passwordDecrypt = decryptData(currentUser.senha) //senha descriptografada

  // Estado que controla os contatos salvos
  const [contacts, setContacts] = useState(() => {
    if (currentUser?.id) {
        const userContactsKey = `contacts-${currentUser.id}`;
        const encryptedContacts = localStorage.getItem(userContactsKey);
        return encryptedContacts ? decryptData(encryptedContacts, currentUser.id) : [];
    }
    return [];
});

  //Estados que controlam as buscas e ordenaçoes da lista de contatos
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

  //Estados que validam as informacoes dos inputs
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");
  const validateContact = () => {
    let errors = {};
    if (!isValidCPF(currentContact.cpf)) {
      errors.cpf = "CPF inválido.";
    }
    if (!isValidEmail(currentContact.email)) {
      errors.email = "Email inválido.";
    }
    if (!isValidPhone(currentContact.phone)) {
      errors.phone = "Telefone inválido. Deve ter 10 ou 11 dígitos.";
    }
    if (!currentContact.name.trim()) {
      errors.name = "Nome não pode ser vazio";
    }
    if (
      contacts.some(
        (contact, index) =>
          contact.cpf === currentContact.cpf && index !== currentIndex
      )
    ) {
      errors.cpf = "CPF já cadastrado.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //Array de objetos para alimentar componente de endereço
  const fieldAddress = [
    {
      name: "cep",
      placeholder: "CEP",
      disabled: true,
      label: "",
      xs: 12,
      cepValid: true,
    },
    {
      name: "address",
      placeholder: "Endereço",
      disabled: true,
      label: "",
      xs: 12,
    },
    {
      name: "number",
      placeholder: "Número",
      disabled: false,
      label: "Numero",
      xs: 12,
    },
    {
      name: "neighborhood",
      placeholder: "Bairro",
      disabled: true,
      label: "",
      xs: 12,
    },
    { name: "city", placeholder: "Cidade", disabled: true, label: "", xs: 12 },
    { name: "country", placeholder: "País", disabled: true, label: "", xs: 12 },
  ];

  //Validaçao de CEP
  const [cepValid, setCepValid] = useState(false);

  //Estados para controlar o carregamento do LoadScript do Autocomplete da API do Google
  const [loadScriptKey, setLoadScriptKey] = useState(0);

  //Estado que contola latitude e longitude para o mapa do google maps
  const [mapLocation, setMapLocation] = useState({
    lat: -25.4296, // Coordenadas de Curitiba
    lng: -49.2716,
  });

  //Estado que controla abertura de modal
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

  //Estado que controlam modal de exclusao de contas
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [accountPassword, setAccountPassword] = useState("");
  const handleDeleteAccount = () => {      
    if (accountPassword === passwordDecrypt) {
      // Carregar o array de usuários do localStorage
      const users = JSON.parse(localStorage.getItem("users"));
      // Filtra o array para excluir um suário
      const updatedUsers = users.filter(user => user.id !== currentUser.id);
      // Salvar o novvo array atualizado de volta no localStorage
      localStorage.setItem("users", JSON.stringify(updatedUsers));
  
      // Remover a lista de contatos do usuário
      const contactsKey = `contacts-${currentUser.id}`;
      localStorage.removeItem(contactsKey);
    
      logout();
      navigate("/");
      setDeleteAccountOpen(false);
      setAccountPassword("");
    } else {
      setError("Senha incorreta!");
    }
  };

  //Estados que controlam abertura de modal e confirmaçao para exclusao de contatos
  const [editMode, setEditMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [password, setPassword] = useState("");
 

  const handlePlaceSelect = async (autocomplete) => {
    const place = autocomplete.getPlace();

    const fullAddress = place.formatted_address;
    const components = place.address_components;

    const position = place.geometry.location;
    const lat = position.lat();
    const lng = position.lng();

    if (!lat || !lng) {
      console.error("Valores de longitude ou latitude inválidosinválidos");
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

    await validateCep(cep.replace(/\D/g, ""), setCepValid);

    setMapLocation({
      lat: lat,
      lng: lng,
      label: `${currentContact.number}`,
    });

    setCurrentContact((prev) => ({
      ...prev,
      fullAddress: fullAddress,
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
    if (validateContact()) {
        // Verifica se não há erros, incluindo CPF duplicado
        const updatedContacts = editMode
            ? contacts.map((c, idx) => (idx === currentIndex ? currentContact : c))
            : [...contacts, currentContact];
        setContacts(updatedContacts);

        if (currentUser?.id) {
            const userContactsKey = `contacts-${currentUser.id}`;
            localStorage.setItem(userContactsKey, JSON.stringify(updatedContacts));
        }
        handleCloseDialog();
    }
};

  const handleOpenDeleteConfirm = (index) => {
    setCurrentIndex(index);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteContact = () => {
    if (password === passwordDecrypt) {
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

  // UseEffect para monitorar e salvar os contatos
  useEffect(() => {
    if (currentUser?.id && contacts) {
        const userContactsKey = `contacts-${currentUser.id}`;
        const encryptedContacts = encryptData(contacts, currentUser.id);
        localStorage.setItem(userContactsKey, encryptedContacts);
    }
}, [contacts, currentUser?.id]);

  //UseEffect para monitorar e salvar dados do usuário atual
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  //UseEffect para monitorar e controlar o carregamento do loadScript
  useEffect(() => {
    if (openDialog) {
      setLoadScriptKey((prevKey) => prevKey + 1); // Incrementa a chave para forçar o recarregamento do LoadScript
    }
  }, [openDialog]);

  //UseEffect para monitorar e controlar o carregamento das validaçoes de input
  useEffect(() => {
    validateContact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentContact.cpf,
    currentContact.email,
    currentContact.phone,
    currentContact.name,
  ]);

  return (
    <div className="containerHome">
      <div className="buttonRow">
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

      <Typography variant="h4" gutterBottom>
        Gerenciador de Contatos
      </Typography>
      <Button
        className="addContactButton"
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
      >
        Adicionar Contato
      </Button>

      {/* Tabela com duas colunas para Contatos e Mapa */}
      <Grid container spacing={2}>
        {/* Coluna de Contatos */}
        <Grid item xs={6}>
          <Paper className="gridPaper" elevation={3}>
            <Typography variant="h6">Lista de Contatos</Typography>
            <List>
              <div className="searchContactRow">
                <TextField
                  className="searchTextField"
                  label="Buscar por Nome ou CPF"
                  variant="outlined"
                  value={searchTerm}
                  onChange={handleChangeSearchTerm}
                />
                <Button onClick={handleToggleSort} variant="outlined">
                  <SortIcon
                    className={`sortIcon ${
                      sortAscending ? "" : "sortIconRotated"
                    }`}
                  />
                </Button>
              </div>
              {filteredContacts.map((contact, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    className="listItemText"
                    primary={`${contact.name} - CPF: ${contact.cpf}`}
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2">
                          Email: {contact.email}, Telefone: {contact.phone}
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
                    }}
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
          <Paper className="gridPaper" elevation={3}>
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

      {/* Modal para criar/editar contatos */}
      <Modal
        open={openDialog}
        close={handleCloseDialog}
        title={editMode ? "Editar Contato" : "Adicionar Contato"}
        children={
          <>
            <DataPersonalForm
              fields={["name", "email", "phone", "cpf"]}
              data={currentContact}
              onChange={handleChangeContact}
              validationErrors={validationErrors}
            />

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
                {fieldAddress.map((field) => (
                  <FormTextField
                    key={field.name}
                    xs={field.xs}
                    label={field.label}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={currentContact[field.name]}
                    onChange={handleChangeContact}
                    disabled={field.disabled}
                    cepValid={field.name === "cep" ? cepValid : undefined}
                  />
                ))}
              </Grid>
            </LoadScript>
          </>
        }
        handleCancel={handleCloseDialog}
        labelCancel={"Cancelar"}
        handleConfirm={handleAddOrEditContact}
        labelConfirm={editMode ? "Salvar" : "Adicionar"}
      />

      {/* //Modal para exclusao de contato */}
      <Modal
        open={deleteConfirmOpen}
        close={handleCloseDeleteConfirm}
        title="Confirmação de Exclusão de Contato"
        textContent=" Insira sua senha para confirmar a exclusão do contato."
        children={
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
        }
        handleCancel={handleCloseDeleteConfirm}
        labelCancel={"Cancelar"}
        handleConfirm={handleDeleteContact}
        labelConfirm={"Confirmar Exclusão"}
      />

      {/* //Modal para exclusao da conta */}
      <Modal
        open={deleteAccountOpen}
        close={() => setDeleteAccountOpen(false)}
        title="Confirmação de Exclusão de Conta"
        textContent="Insira sua senha para confirmar a exclusão da sua conta. Essa ação é irreversível!"
        children={
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
        }
        handleCancel={() => setDeleteAccountOpen(false)}
        labelCancel={"Cancelar"}
        handleConfirm={handleDeleteAccount}
        labelConfirm={"Confirmar Exclusão"}
      />
    </div>
  );
}
