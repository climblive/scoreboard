import React, { useState } from "react";
import { Raffle } from "src/model/raffle";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { deleteRaffle } from "../../actions/asyncActions";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import TableRow from "@material-ui/core/TableRow";
import { TableCell } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { CircularProgress } from "@material-ui/core";
import { ContenderData } from "src/model/contenderData";
import { getContenderMap } from "../../selectors/selector";
import StopIcon from "@material-ui/icons/Stop";
import PlayIcon from "@material-ui/icons/PlayArrow";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { saveRaffle, drawWinner } from "../../actions/asyncActions";
import { RaffleWinner } from "src/model/raffleWinner";

interface Props {
  raffle?: Raffle;
  deleteRaffle?: (raffle: Raffle) => Promise<void>;
  saveRaffle?: (raffle: Raffle) => Promise<Raffle>;
  drawWinner?: (raffle: Raffle) => Promise<RaffleWinner>;
  contenderMap: Map<number, ContenderData>;
}

const RaffleView = (props: Props) => {
  let [drawingWinner, setDrawingWinner] = useState<boolean>(false);
  let [updating, setUpdating] = useState<boolean>(false);
  let [deleting, setDeleting] = useState<boolean>(false);
  let [deleteRequested, setDeleteRequested] = useState<boolean>(false);

  const getContenderName = (contenderId: number) => {
    let contender = props.contenderMap.get(contenderId);
    return contender
      ? contender.name
      : "Unknown contender with id " + contenderId;
  };

  const deleteRaffle = () => {
    setDeleteRequested(true);
  };

  const onDeleteConfirmed = (result: boolean) => {
    setDeleteRequested(false);

    if (result) {
      setDeleting(true);
      props.deleteRaffle?.(props.raffle!).finally(() => setDeleting(false));
    }
  };

  const drawWinner = () => {
    setDrawingWinner(true);
    props.drawWinner?.(props.raffle!).finally(() => setDrawingWinner(false));
  };

  const changeActiveStatus = (active: boolean) => {
    setUpdating(true);
    props
      .saveRaffle?.({ ...props.raffle!, active })
      .finally(() => setUpdating(false));
  };

  return (
    <>
      <TableRow key={props.raffle?.id} style={{ verticalAlign: "top" }}>
        <TableCell component="th" scope="row">
          {props.raffle?.id}
        </TableCell>
        <TableCell component="th" scope="row">
          {(props.raffle?.winners! || []).map((winner) => {
            return (
              <div className="raffleWinner" key={winner.id}>
                {getContenderName(winner.contenderId)}
              </div>
            );
          })}
        </TableCell>
        <TableCell className={"icon-cell"}>
          {props.raffle?.active && (
            <IconButton
              color="inherit"
              aria-label="Menu"
              title="Draw winner"
              onClick={drawWinner}
            >
              {drawingWinner ? <CircularProgress size={24} /> : <PlayIcon />}
            </IconButton>
          )}
          {props.raffle?.active && (
            <IconButton
              color="inherit"
              aria-label="Menu"
              title="Deactivate"
              onClick={() => changeActiveStatus(false)}
            >
              {updating ? <CircularProgress size={24} /> : <StopIcon />}
            </IconButton>
          )}
          {!props.raffle?.active && (
            <IconButton
              color="inherit"
              aria-label="Menu"
              title="Activate"
              onClick={() => changeActiveStatus(true)}
            >
              {updating ? <CircularProgress size={24} /> : <PlayIcon />}
            </IconButton>
          )}
          <IconButton
            color="inherit"
            aria-label="Menu"
            title="Delete"
            onClick={deleteRaffle}
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={24} /> : <DeleteIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <ConfirmationDialog
        open={deleteRequested}
        title={"Delete raffle"}
        message={"Do you wish to delete the selected raffle?"}
        onClose={onDeleteConfirmed}
      />
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    contenderMap: getContenderMap(state),
  };
}

const mapDispatchToProps = {
  deleteRaffle,
  saveRaffle,
  drawWinner,
};

export default connect(mapStateToProps, mapDispatchToProps)(RaffleView);
