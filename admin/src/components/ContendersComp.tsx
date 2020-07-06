import * as React from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { InputLabel, TableCell } from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import SaveIcon from "@material-ui/icons/SaveAlt";
import ClearIcon from "@material-ui/icons/Clear";
import RefreshIcon from "@material-ui/icons/Refresh";
import { ContenderData } from "../model/contenderData";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { CompClass } from "../model/compClass";
import { Contest } from "../model/contest";
import moment from "moment";
import { Problem } from "../model/problem";
import { Color } from "../model/color";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { SortBy } from "../constants/sortBy";
import { Environment } from "../environment";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Tooltip from "@material-ui/core/Tooltip";
import { Api } from "../utils/Api";

interface Props {
  contest: Contest;
  contenders: ContenderData[];
  contenderSortBy: SortBy;
  contenderFilterCompClassId?: number;
  compClasses?: CompClass[];
  compClassMap: Map<number, CompClass>;
  problemMap: Map<number, Problem>;
  colorMap: Map<number, Color>;

  createContenders?: (nContenders: number) => void;
  exportResults?: () => void;
  reloadContenders?: () => void;
  resetContenders?: () => void;
  setContenderFilterCompClass?: (contenderFilterCompClass?: CompClass) => void;
  setContenderSortBy?: (contenderSortBy: SortBy) => void;
  updateContender?: (contender: ContenderData) => void;
}

type State = {
  showAddContendersPopup: boolean;
  addContendersErrorMessage?: string;
  showResetConfirmationPopup: boolean;
  nNewContenders: string;
  dialogContender?: ContenderData;
};

class ContendersComp extends React.Component<Props, State> {
  public readonly state: State = {
    showAddContendersPopup: false,
    showResetConfirmationPopup: false,
    nNewContenders: "",
  };

  constructor(props: Props) {
    super(props);
  }

  readonly MAX_CONTENDER_COUNT = 500;

  componentDidMount() {}

  private getCompClassName(id?: number) {
    let compClass = id ? this.props.compClassMap.get(id!) : undefined;
    return compClass ? compClass.name : "-";
  }

  startAddContenders = () => {
    this.state.showAddContendersPopup = true;
    this.state.addContendersErrorMessage = undefined;
    this.setState(this.state);
  };

  closePopups = () => {
    this.state.showAddContendersPopup = false;
    this.state.showResetConfirmationPopup = false;
    this.setState(this.state);
  };

  onNewContendersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.state.nNewContenders = e.target.value;
    this.setState(this.state);
  };

  addContendersConfirmed = () => {
    const nContenders = parseInt(this.state.nNewContenders);
    if (nContenders) {
      if (
        this.props.contenders.length + nContenders >
        this.MAX_CONTENDER_COUNT
      ) {
        this.state.addContendersErrorMessage =
          "Maximum number of contenders exceeded!";
      } else {
        this.props.createContenders!(nContenders);
        this.state.showAddContendersPopup = false;
        this.state.nNewContenders = "";
      }
    } else {
      this.state.addContendersErrorMessage = "Illegal input!";
    }
    this.setState(this.state);
  };

  resetAllContenders = () => {
    this.state.showResetConfirmationPopup = true;
    this.setState(this.state);
  };

  resetContendersConfirmed = (confirmed: boolean) => {
    this.state.showResetConfirmationPopup = false;
    this.setState(this.state);
    if (confirmed) {
      this.props.resetContenders!();
    }
  };

  showContenderDialog = (contender: ContenderData) => {
    this.state.dialogContender = contender;
    this.setState(this.state);
  };

  hideContenderDialog = () => {
    this.state.dialogContender = undefined;
    this.setState(this.state);
  };

  onContenderFilterCompClassChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const filterCompClass =
      e.target.value == "All"
        ? undefined
        : this.props.compClasses!.find((o) => o.id == parseInt(e.target.value));
    this.props.setContenderFilterCompClass!(filterCompClass);
  };

  onDisqualify = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    contender: ContenderData
  ) => {
    e.stopPropagation();
    this.props.updateContender?.({ ...contender, disqualified: true });
  };

  onReenter = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    contender: ContenderData
  ) => {
    e.stopPropagation();
    this.props.updateContender?.({ ...contender, disqualified: false });
  };

  render() {
    let contenders = this.props.contenders;
    let compClasses = this.props.compClasses;
    if (!contenders) {
      return <CircularProgress />;
    }
    return (
      <Paper style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", marginTop: 14, alignItems: "center" }}>
          <div style={{ marginLeft: 16, marginRight: "auto" }}>
            {contenders.length} contenders:
          </div>
          {compClasses && compClasses.length > 0 && (
            <FormControl style={{ minWidth: 200, marginRight: 10 }}>
              <InputLabel shrink htmlFor="compClass-select">
                Contest class
              </InputLabel>
              <Select
                id="compClass-select"
                value={
                  this.props.contenderFilterCompClassId == undefined
                    ? "All"
                    : this.props.contenderFilterCompClassId
                }
                onChange={this.onContenderFilterCompClassChange}
              >
                <MenuItem value="All">
                  <em>All</em>
                </MenuItem>
                {compClasses!.map((compClass) => (
                  <MenuItem key={compClass.id} value={compClass.id}>
                    {compClass.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <IconButton
            color="inherit"
            aria-label="Menu"
            title="Reload contenders"
            onClick={this.props.reloadContenders}
          >
            <RefreshIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="Menu"
            title="Add contenders"
            onClick={this.startAddContenders}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="Menu"
            title="Export results"
            onClick={this.props.exportResults}
          >
            <SaveIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="Menu"
            title="Reset all contenders"
            onClick={this.resetAllContenders}
          >
            <ClearIcon />
          </IconButton>
        </div>
        <div style={{ flexBasis: 0, flexGrow: 1, overflowY: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ width: "100%", cursor: "pointer" }}
                  onClick={() => this.props.setContenderSortBy!(SortBy.BY_NAME)}
                >
                  Name
                </TableCell>
                <TableCell style={{ minWidth: 110 }}>Class</TableCell>
                <TableCell
                  style={{ minWidth: 110, cursor: "pointer" }}
                  onClick={() =>
                    this.props.setContenderSortBy!(SortBy.BY_TOTAL_POINTS)
                  }
                >
                  Total score
                </TableCell>
                {this.props.contest.finalEnabled && (
                  <>
                    <TableCell
                      style={{ minWidth: 110, cursor: "pointer" }}
                      onClick={() =>
                        this.props.setContenderSortBy!(
                          SortBy.BY_QUALIFYING_POINTS
                        )
                      }
                    >
                      Qualifying score
                    </TableCell>
                    <TableCell style={{ minWidth: 100 }}></TableCell>
                  </>
                )}
                <TableCell
                  style={{ minWidth: 110, cursor: "pointer" }}
                  onClick={() =>
                    this.props.setContenderSortBy!(SortBy.BY_NUMBER_OF_TICKS)
                  }
                >
                  # Ticks
                </TableCell>
                <TableCell style={{ minWidth: 110 }}>
                  Registration code
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {contenders.map((contender) => {
                return (
                  <TableRow
                    key={contender.id}
                    style={{ cursor: "pointer" }}
                    hover
                    onClick={() => {
                      if (!contender.disqualified) {
                        this.showContenderDialog(contender);
                      }
                    }}
                  >
                    <TableCell
                      style={
                        contender.disqualified
                          ? { textDecoration: "line-through" }
                          : {}
                      }
                      component="th"
                      scope="row"
                    >
                      {contender.name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {this.getCompClassName(contender.compClassId)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div style={{ width: 37, display: "inline-block" }}>
                        {contender.name ? contender.totalScore : "-"}
                      </div>
                      <div style={{ display: "inline-block" }}>
                        {contender.name
                          ? "(" + contender.totalPosition + ")"
                          : ""}
                      </div>
                    </TableCell>
                    {this.props.contest.finalEnabled && (
                      <>
                        <TableCell component="th" scope="row">
                          <div style={{ width: 37, display: "inline-block" }}>
                            {contender.name ? contender.qualifyingScore : "-"}
                          </div>
                          <div style={{ display: "inline-block" }}>
                            {contender.name
                              ? "(" + contender.qualifyingPosition + ")"
                              : ""}
                          </div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {contender.isFinalist ? "finalist" : ""}
                        </TableCell>
                      </>
                    )}
                    <TableCell component="th" scope="row">
                      {contender.name ? contender.ticks!.length : "-"}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Button
                        href={
                          "https://" +
                          Environment.siteDomain +
                          "/" +
                          contender.registrationCode
                        }
                        target="_blank"
                        variant="outlined"
                        color="primary"
                        disabled={contender.disqualified}
                        style={{ maxWidth: "100px", minWidth: "100px" }}
                        onClick={(event) => event.stopPropagation()}
                      >
                        {contender.registrationCode}
                      </Button>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {contender.disqualified ? (
                        <Tooltip title="Reenter" placement="top-start">
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={(event) =>
                              this.onReenter(event, contender)
                            }
                          >
                            {<ThumbUpIcon />}
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Disqualify" placement="top-start">
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={(event) =>
                              this.onDisqualify(event, contender)
                            }
                          >
                            {<ThumbDownIcon />}
                          </Button>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <Dialog
          open={this.state.showAddContendersPopup}
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          aria-labelledby="addcontender-dialog-title"
        >
          <DialogTitle id="addcontender-dialog-title">
            Create contenders
          </DialogTitle>
          <DialogContent>
            <div>
              Before a contest starts, you have to create activation codes
              enough for all contenders.
            </div>
            <div style={{ marginTop: 5 }}>
              Currently you have {contenders.length} activation codes.
            </div>
            <div style={{ marginTop: 5, marginBottom: 20 }}>
              You can create a maximum of {this.MAX_CONTENDER_COUNT} activation
              codes per contest.
            </div>
            <TextField
              style={{ width: 250 }}
              label="Number of contenders to create"
              value={this.state.nNewContenders}
              onChange={this.onNewContendersChange}
            />
            {this.state.addContendersErrorMessage && (
              <div style={{ marginTop: 5, color: "red", fontWeight: "bold" }}>
                {this.state.addContendersErrorMessage}
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closePopups} color="primary">
              Cancel
            </Button>
            <Button onClick={this.addContendersConfirmed} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
        <ConfirmationDialog
          open={this.state.showResetConfirmationPopup}
          title="Reset all contenders"
          message="Do you really want to reset all contenders? All ticks and data will be lost."
          onClose={this.resetContendersConfirmed}
        />
        <Dialog
          open={this.state.dialogContender != undefined}
          aria-labelledby="contender-dialog-title"
        >
          <DialogTitle id="contender-dialog-title">
            {this.state.dialogContender && this.state.dialogContender.name}
          </DialogTitle>
          <div
            style={{
              display: "flex",
              fontWeight: "bold",
              margin: "0px 24px",
              borderBottom: "1px solid grey",
            }}
          >
            <div style={{ width: 200 }}>Problem</div>
            <div style={{ width: 100, textAlign: "right" }}>Points</div>
            <div style={{ width: 150, marginLeft: 10 }}>Time</div>
            <div style={{ width: 100, marginLeft: 10 }}>Flash</div>
          </div>
          <DialogContent>
            {this.state.dialogContender &&
              this.state.dialogContender!.ticks!.map((tick) => {
                let problem = this.props.problemMap.get(tick.problemId);
                let color = this.props.colorMap.get(problem!.colorId!);
                let points = problem!.points!;
                if (tick.flash && problem!.flashBonus) {
                  points += problem!.flashBonus;
                }
                return (
                  <div style={{ display: "flex", marginBottom: 2 }}>
                    <div style={{ width: 50 }}>{problem!.number}</div>
                    <div style={{ width: 150 }}>{color!.name}</div>
                    <div style={{ width: 100, textAlign: "right" }}>
                      {points}
                    </div>
                    <div style={{ width: 150, marginLeft: 10 }}>
                      {moment(tick.timestamp).format("HH:mm")}
                    </div>
                    <div style={{ width: 100, marginLeft: 10 }}>
                      {tick.flash && "Flash"}
                    </div>
                  </div>
                );
              })}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.hideContenderDialog} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

export default ContendersComp;
