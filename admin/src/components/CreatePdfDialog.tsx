import { DialogContentText } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export interface CreatePdfDialogProps {
  open: boolean;
  onClose: () => void;
  createPdf?: () => void;
  createPdfFromTemplate?: (file: Blob) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    hidden: { display: "none" },
    list: {
      "& > *": {
        margin: theme.spacing(1, 0),
      },
    },
  })
);

export const CreatePdfDialog = (props: CreatePdfDialogProps) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const classes = useStyles();
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
      open={props.open}
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
    >
      <input
        className={classes.hidden}
        type="file"
        onChange={onChange}
        ref={inputRef}
      />
      <DialogTitle id="confirmation-dialog-title">Create PDF</DialogTitle>
      <DialogContent>
        <Tabs value={selectedTab} onChange={selectTab}>
          <Tab label="PDF with codes" />
          <Tab label="Scoreboard from template" />
        </Tabs>
        {selectedTab === 0 && (
          <DialogContentText>
            <p>
              Download the PDF, print it, cut it and hand out to the contenders.
            </p>
          </DialogContentText>
        )}
        {selectedTab === 1 && (
          <DialogContentText>
            <p>
              If you want to use ClimbLive together with a scoreboard on paper,
              you can generate scoreboards with a registration code on the top
              of each scoreboard.
            </p>
            <p>This can be a way of just testing ClimbLive on a contest.</p>
            <ul className={classes.list}>
              <li>
                Create a single page pdf with your scoreboard. Make sure to
                leave space on top of the page for the regstration code.
              </li>
              <li>Upload the PDF file by clicking the button below.</li>
              <li>
                ClimbLive generates a new pdf with one page per contender with a
                registration code on top.
              </li>
              <li>Print the new pdf, and hand out to the contenders.</li>
            </ul>
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Cancel
        </Button>
        {selectedTab === 0 && (
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
        {selectedTab === 1 && (
          <Button onClick={createPdfFromTemplate} color="primary">
            Select template PDF
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
