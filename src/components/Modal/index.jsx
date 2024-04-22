import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";

export default function Modal({
  open,
  close,
  title,
  textContent,
  children,
  handleCancel,
  labelCancel,
  handleConfirm,
  labelConfirm

}) {
  return (
    <>
      <Dialog open={open} onClose={close} maxWidth="xs" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{textContent}</DialogContentText>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            {labelCancel}
          </Button>
          <Button onClick={handleConfirm} color="secondary">
            {labelConfirm}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
