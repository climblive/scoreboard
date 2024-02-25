import { DialogContentText } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";

export interface CreatePdfDialogProps {
  open: boolean;
  onClose: () => void;
  createPdf?: () => void;
}

export const CreatePdfDialog = (props: CreatePdfDialogProps) => {
  return (
    <Dialog
      open={props.open}
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
    >
      <DialogTitle id="confirmation-dialog-title">Create PDF</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <p>
            Download the PDF, print it, cut it and hand out to the contenders.
          </p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            props.onClose();
            props.createPdf?.();
          }}
          color="primary"
        >
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};
