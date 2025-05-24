import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

/**
 * Verifypopup - A reusable confirmation dialog.
 * @param {boolean} open - Whether the dialog is open.
 * @param {function} onClose - Called when dialog is closed (with true/false for Yes/No).
 * @param {string|React.ReactNode} message - The message/content to display.
 */
const Verifypopup = ({ open, onClose, message }) => {
  return (
    <Dialog sx={{backgroundColor: '#0f0f1a', transition: 'background-color 0.5s ease-in-out'}} open={open} onClose={() => onClose(false)}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="error" variant="outlined">
          No
        </Button>
        <Button onClick={() => onClose(true)} color="primary" variant="contained" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Verifypopup;
