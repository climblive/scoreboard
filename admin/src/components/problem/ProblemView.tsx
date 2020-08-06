import React, { useState } from "react";
import { Problem } from "src/model/problem";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { deleteProblem } from "../../actions/asyncActions";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import {
  Button,
  StyledComponentProps,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { CircularProgress } from "@material-ui/core";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import { ConfirmationDialog } from "../ConfirmationDialog";
import {
  getTicksByProblem,
  getContenderMap,
  getCompClassMap,
  getCompClassesForContest,
} from "../../selectors/selector";
import { Tick } from "src/model/tick";
import { CompClass } from "src/model/compClass";
import { ContenderData } from "src/model/contenderData";
import moment from "moment";
import CompClassEdit from "../compClass/CompClassEdit";

interface Props {
  contestId?: number;
  problem?: Problem;
  ticksByProblem?: Map<number | undefined, Tick[]>;
  compClassMap: Map<number, CompClass>;
  contenderMap: Map<number, ContenderData>;
  deleteProblem?: (problem: Problem) => Promise<void>;
  onBeginEdit?: () => void;
  getColorName?: (problem: Problem) => string;
  getProblemStyle?: (problem: Problem) => object;
  onBeginCreate?: (problemNumber: number) => void;
}

const ProblemView = (props: Props & StyledComponentProps) => {
  let [deleting, setDeleting] = useState<boolean>(false);
  let [showingTicks, setShowingTicks] = useState<boolean>(false);
  let [deleteRequested, setDeleteRequested] = useState<boolean>(false);

  const showTicksDialog = () => {
    setShowingTicks(true);
  };

  const hideTicksDialog = () => {
    setShowingTicks(false);
  };

  const onDeleteConfirmed = (result: boolean) => {
    setDeleteRequested(false);

    if (result) {
      setDeleting(true);
      props
        .deleteProblem?.(props.problem!)
        .catch((error) => setDeleting(false));
    }
  };

  const ticks = props.ticksByProblem?.get(props.problem!.id);
  return (
    <>
      <li style={props.getProblemStyle?.(props.problem!)}>
        <div style={{ width: 20, fontSize: 16 }}>{props.problem?.number}</div>
        <div
          style={{
            width: 100,
            textAlign: "left",
            marginLeft: 15,
            marginRight: "auto",
            fontSize: 16,
          }}
        >
          {props.problem?.name != undefined
            ? props.problem!.name
            : props.getColorName?.(props.problem!)}
        </div>
        {(ticks?.length ?? 0) > 0 && (
          <Button style={{ color: "inherit" }} onClick={showTicksDialog}>
            {ticks!.length} ticks
          </Button>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: 15,
          }}
        >
          <div style={{ fontSize: 10, textAlign: "right" }}>Points</div>
          <div
            style={{
              textAlign: "right",
              width: 60,
              fontSize: 28,
              height: 33.25,
            }}
          >
            {props.problem?.sharedPoints?.[0]?.points ?? props.problem?.points}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 60,
            marginRight: 15,
          }}
        >
          {props.problem?.flashBonus != undefined && (
            <div style={{ fontSize: 10, textAlign: "right" }}>Flash bonus</div>
          )}
          <div
            style={{
              textAlign: "right",
              fontSize: 28,
              height: 33.25,
            }}
          >
            {props.problem?.sharedPoints?.[0]?.flashBonus ??
              props.problem?.flashBonus}
          </div>
        </div>
        <IconButton
          className={props.classes?.menuButton}
          color="inherit"
          aria-label="Menu"
          title="Edit"
          disabled={deleting}
          onClick={props.onBeginEdit}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          className={props.classes?.menuButton}
          color="inherit"
          aria-label="Menu"
          title="Add"
          onClick={() => props.onBeginCreate?.(props.problem?.number!)}
        >
          <AddIcon />
        </IconButton>
        <IconButton
          className={props.classes?.menuButton}
          color="inherit"
          aria-label="Menu"
          title="Delete"
          disabled={deleting}
          onClick={() => setDeleteRequested(true)}
        >
          {deleting ? <CircularProgress size={24} /> : <DeleteIcon />}
        </IconButton>
      </li>
      <ConfirmationDialog
        open={deleteRequested}
        title={"Delete problem"}
        message={"Do you wish to delete the selected problem?"}
        onClose={onDeleteConfirmed}
      />
      <Dialog key={"tickDialog"} open={showingTicks}>
        <DialogTitle id="confirmation-dialog-title">
          Ticks for problem {props.problem!.number}
        </DialogTitle>
        <div
          style={{
            display: "flex",
            fontWeight: "bold",
            margin: "0px 24px",
            borderBottom: "1px solid grey",
          }}
        >
          <div style={{ width: 300 }}>Contender</div>
          <div style={{ width: 150 }}>Class</div>
          <div style={{ width: 150 }}>Time</div>
          <div style={{ width: 100 }}>Flash</div>
        </div>
        <DialogContent>
          {ticks?.map((tick) => {
            let contender = props.contenderMap.get(tick.contenderId);
            let compClass = props.compClassMap.get(contender?.compClassId!);
            return (
              <div key={tick.id} style={{ display: "flex", marginBottom: 2 }}>
                <div style={{ width: 300 }}>{contender?.name}</div>
                <div style={{ width: 150 }}>{compClass?.name}</div>
                <div style={{ width: 150 }}>
                  {moment(tick.timestamp).format("HH:mm")}
                </div>
                <div style={{ width: 100 }}>{tick.flash && "Flash"}</div>
              </div>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={hideTicksDialog} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    ticksByProblem: getTicksByProblem(state),
    compClassMap: getCompClassMap(state),
    contenderMap: getContenderMap(state),
  };
}

const mapDispatchToProps = {
  deleteProblem,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemView);
