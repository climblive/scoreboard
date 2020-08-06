import React, { useState } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { DialogContentText } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

export interface CreatePdfDialogProps {
  open: boolean;
  creatingPdf: boolean;
  onClose: () => void;
  createPdf?: () => void;
  createPdfFromTemplate?: (file: Blob) => void;
}

export const CreatePdfDialog = (props: CreatePdfDialogProps) => {
  const [selectedTab, setSelectedTab] = useState(0);

  let inputRef: any = React.createRef();

  const selectTab = (event: any, newValue: number) => {
    setSelectedTab(newValue);
  };

  const createPdfFromTemplate = () => {
    inputRef.current.click();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files != null && e.target.files.length > 0) {
      props.createPdfFromTemplate!(e.target.files.item(0) as Blob);
      props.onClose();
    }
  };

  return (
    <Dialog
      open={props.open || props.creatingPdf}
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
    >
      <input
        style={{ display: "none" }}
        type="file"
        onChange={onChange}
        ref={inputRef}
      />
      <DialogTitle id="confirmation-dialog-title">Create PDF</DialogTitle>
      <DialogContent>
        <Tabs
          value={selectedTab}
          onChange={selectTab}
          style={{ marginBottom: 20 }}
        >
          <Tab label="PDF with codes" />
          <Tab label="Scoreboard from template" />
        </Tabs>
        {selectedTab == 0 && (
          <DialogContentText>
            Download the PDF, print it, cut it and hand out to the contenders.
          </DialogContentText>
        )}
        {selectedTab == 1 && (
          <DialogContentText>
            If you want to use ClimbLive together with a scoreboard on paper,
            you can generate scoreboards with a registration code on the top of
            each scoreboard.
            <div style={{ marginTop: 10 }}>
              This can be a way of just testing ClimbLive on a contest.
            </div>
            <ul>
              <li>
                Create a single page pdf with your scoreboard. Make sure to
                leave space on top of the page for the regstration code.
              </li>
              <li style={{ marginTop: 10 }}>
                Upload the PDF file by clicking the button below.
              </li>
              <li style={{ marginTop: 10 }}>
                ClimbLive generates a new pdf with one page per contender with a
                registration code on top.
              </li>
              <li style={{ marginTop: 10 }}>
                Print the new pdf, and hand out to the contenders.
              </li>
            </ul>
          </DialogContentText>
        )}
        {props.creatingPdf && (
          <div>
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <CircularProgress />
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Cancel
        </Button>
        {selectedTab == 0 && (
          <Button
            onClick={() => {
              props.onClose();
              props.createPdf?.();
            }}
            color="primary"
          >
            Download PDF
          </Button>
        )}
        {selectedTab == 1 && (
          <Button onClick={createPdfFromTemplate} color="primary">
            Select template PDF
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
