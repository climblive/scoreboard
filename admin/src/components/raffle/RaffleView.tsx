import { Divider, Paper, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import PlayIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import { OrderedMap } from "immutable";
import moment from "moment";
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ContenderData } from "src/model/contenderData";
import { Raffle } from "src/model/raffle";
import { RaffleWinner } from "src/model/raffleWinner";
import {
  deleteRaffle,
  drawWinner,
  saveRaffle,
} from "../../actions/asyncActions";
import { StoreState } from "../../model/storeState";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { ProgressButton } from "../ProgressButton";
import ResponsiveTableRow from "../ResponsiveTableRow";

interface Props {
  raffle: Raffle;
  breakpoints?: Map<number, string>;
  contenders?: OrderedMap<number, ContenderData>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    collapsableBody: {
      "& > *": {
        margin: theme.spacing(1, 0),
      },
      minWidth: 296,
      maxWidth: 600,
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      flexBasis: 0,
      paddingBottom: theme.spacing(1),
    },
    buttons: {
      "& > *": {
        marginRight: theme.spacing(1),
      },
    },
  })
);

const RaffleView = (props: Props & PropsFromRedux) => {
  let [drawingWinner, setDrawingWinner] = useState<boolean>(false);
  let [updating, setUpdating] = useState<boolean>(false);
  let [deleting, setDeleting] = useState<boolean>(false);
  let [deleteRequested, setDeleteRequested] = useState<boolean>(false);

  const classes = useStyles();

  const getContenderName = (contenderId: number) => {
    let contender = props.contenders?.get(contenderId);
    return contender
      ? contender.name
      : "Unknown contender with id " + contenderId;
  };

  const onDeleteConfirmed = (result: boolean) => {
    setDeleteRequested(false);

    if (result) {
      setDeleting(true);
      props.deleteRaffle(props.raffle).finally(() => setDeleting(false));
    }
  };

  const drawWinner = () => {
    setDrawingWinner(true);
    props
      .drawWinner(props.raffle)
      .catch(() => {})
      .finally(() => setDrawingWinner(false));
  };

  const changeActiveStatus = (active: boolean) => {
    setUpdating(true);
    props
      .saveRaffle?.({ ...props.raffle, active })
      .finally(() => setUpdating(false));
  };

  const cells = [
    <TableCell component="th" scope="row">
      {`Raffle #${props.raffle.id}`}
    </TableCell>,
  ];

  return (
    <>
      <ResponsiveTableRow cells={cells} breakpoints={props.breakpoints}>
        <div className={classes.collapsableBody}>
          <Typography color="textSecondary" display="block" variant="caption">
            Actions
          </Typography>

          <div className={classes.buttons}>
            <ProgressButton
              variant="contained"
              color="secondary"
              onClick={drawWinner}
              loading={drawingWinner}
              startIcon={<PlayIcon />}
              disabled={!props.raffle.active}
            >
              Draw
            </ProgressButton>
            {props.raffle.active && (
              <ProgressButton
                variant="contained"
                color="secondary"
                onClick={() => changeActiveStatus(false)}
                loading={updating}
                startIcon={<StopIcon />}
              >
                Deactivate
              </ProgressButton>
            )}
            {!props.raffle.active && (
              <ProgressButton
                variant="contained"
                color="secondary"
                onClick={() => changeActiveStatus(true)}
                loading={updating}
                startIcon={<PlayIcon />}
              >
                Activate
              </ProgressButton>
            )}
          </div>

          <Divider />

          <Typography color="textSecondary" display="block" variant="caption">
            Winners
          </Typography>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Contender
                  </TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.raffleWinners
                  ?.toArray()
                  ?.sort((w1, w2) => (w2.id ?? 0) - (w1.id ?? 0))
                  ?.map((winner: RaffleWinner) => {
                    return (
                      <TableRow key={winner.id}>
                        <TableCell>
                          {getContenderName(winner.contenderId)}
                        </TableCell>
                        <TableCell>
                          {moment(winner.timestamp).format("HH:mm")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider />

          <Typography color="textSecondary" display="block" variant="caption">
            Advanced
          </Typography>

          <div className={classes.buttons}>
            <ProgressButton
              variant="contained"
              color="secondary"
              title="Delete"
              loading={deleting}
              onClick={() => setDeleteRequested(true)}
              startIcon={<DeleteIcon />}
            >
              Delete
            </ProgressButton>
          </div>
        </div>
      </ResponsiveTableRow>
      <ConfirmationDialog
        open={deleteRequested}
        title={"Delete raffle"}
        message={"Do you wish to delete the selected raffle?"}
        onClose={onDeleteConfirmed}
      />
    </>
  );
};

const mapStateToProps = (state: StoreState, props: Props) => ({
  raffleWinners: state.raffleWinnersByRaffle.get(props.raffle.id!),
});

const mapDispatchToProps = {
  deleteRaffle,
  saveRaffle,
  drawWinner,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(RaffleView);
