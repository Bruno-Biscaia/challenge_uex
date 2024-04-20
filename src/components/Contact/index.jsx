import {
  Container,
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
} from "@mui/material";

import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

export default function Contact({
  handleOpenDialog,
  contacts,
  handleDeleteContact,
  openDialog,
  handleCloseDialog,
  editMode,
  currentContact,
  handleChangeContact,
  handleEditContact,
  handleAddContact,
}) {
  return (
    <Container>
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

      <List>
        {contacts.map((contact, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={contact.nome}
              secondary={`Email: ${contact.email}, Telefone: ${contact.telefone}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleOpenDialog(contact, true)}
              >
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDeleteContact(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "Editar Contato" : "Adicionar Contato"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nome"
            type="text"
            fullWidth
            name="nome"
            value={currentContact.nome}
            onChange={handleChangeContact}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={currentContact.email}
            onChange={handleChangeContact}
          />
          <TextField
            margin="dense"
            label="Telefone"
            type="text"
            fullWidth
            name="telefone"
            value={currentContact.telefone}
            onChange={handleChangeContact}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={
              editMode
                ? () => handleEditContact(contacts.indexOf(currentContact))
                : handleAddContact
            }
            color="primary"
          >
            {editMode ? "Salvar" : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
