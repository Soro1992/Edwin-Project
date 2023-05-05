import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import {
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Fragment, useState } from "react";
import Instructions from "./Instructions";
import { QuestionMarkRounded } from "@mui/icons-material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const InstructionsModal = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Fab
        onClick={() => {
          setOpen(true);
        }}
        style={{
          right: 30,
          bottom: 40,
          position: "fixed",
        }}
        color="primary"
      >
        <QuestionMarkRounded />
      </Fab>
      <BootstrapDialog
        fullWidth={true}
        maxWidth="xl"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Instructions
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Instructions />
        </DialogContent>
      </BootstrapDialog>
    </Fragment>
  );
};

export default InstructionsModal;
