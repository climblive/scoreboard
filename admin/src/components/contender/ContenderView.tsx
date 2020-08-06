import React, { useState } from "react";
import { ContenderData } from "src/model/contenderData";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import TableRow from "@material-ui/core/TableRow";
import { TableCell } from "@material-ui/core";
import { ContenderScoring } from "src/model/contenderScoring";
import { Environment } from "../../environment";
import Button from "@material-ui/core/Button";
import { CompClass } from "../../model/compClass";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Tooltip from "@material-ui/core/Tooltip";
import { updateContender } from "../../actions/asyncActions";
import {
  getCompClassMap,
  getProblemMap,
  getColorMap,
} from "../../selectors/selector";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import moment from "moment";
import { Problem } from "../../model/problem";
import { Color } from "../../model/color";
import { Tick } from "../../model/tick";
import { Api } from "../../utils/Api";

interface Props {
  contender?: ContenderData;
  compClassMap: Map<number, CompClass>;
  problemMap: Map<number, Problem>;
  colorMap: Map<number, Color>;
  saveContender?: (contender: ContenderData) => Promise<void>;
  onBeginEdit?: () => void;
  updateContender?: (contender: ContenderData) => Promise<ContenderData>;
}

const ContenderView = (props: Props) => {
  const [scoreDialogOpen, setScoreDialogOpen] = useState<boolean>(false);
  const [ticks, setTicks] = useState<Tick[]>([]);

  const showContenderDialog = () => {
    Api.getTicksForContender(contender.id!).then((ticks) => setTicks(ticks));
    setScoreDialogOpen(true);
  };

  const hideContenderDialog = () => {
    setScoreDialogOpen(false);
  };

  const getCompClassName = (id?: number) => {
    let compClass = id ? props.compClassMap?.get(id!) : undefined;
    return compClass ? compClass.name : "-";
  };

  const onDisqualify = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    contender: ContenderData
  ) => {
    e.stopPropagation();
    props.updateContender?.({ ...contender, disqualified: true });
  };

  const onReenter = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    contender: ContenderData
  ) => {
    e.stopPropagation();
    props.updateContender?.({ ...contender, disqualified: false });
  };

  let scoring = props.contender?.scorings?.[0];
  let contender = props.contender!;

  return (
    <>
      <TableRow
        style={{ cursor: "pointer" }}
        hover
        onClick={() => {
          if (!contender.disqualified) {
            showContenderDialog();
          }
        }}
      >
        <TableCell
          style={
            contender.disqualified ? { textDecoration: "line-through" } : {}
          }
          component="th"
          scope="row"
        >
          {contender.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {getCompClassName(contender.compClassId)}
        </TableCell>
        <TableCell component="th" scope="row">
          <div style={{ width: 37, display: "inline-block" }}>
            {scoring ? scoring?.score : "-"}
          </div>
          <div style={{ display: "inline-block" }}>
            {scoring ? "(" + scoring?.placement + ")" : ""}
          </div>
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
                onClick={(event) => onReenter(event, contender)}
              >
                {<ThumbUpIcon />}
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Disqualify" placement="top-start">
              <Button
                variant="contained"
                color="secondary"
                onClick={(event) => onDisqualify(event, contender)}
              >
                {<ThumbDownIcon />}
              </Button>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
      <Dialog open={scoreDialogOpen} aria-labelledby="contender-dialog-title">
        <DialogTitle id="contender-dialog-title">
          {props.contender?.name}
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
          {ticks.map((tick) => {
            let problem = props.problemMap.get(tick.problemId);
            let color = props.colorMap.get(problem!.colorId!);
            let points = problem!.points!;
            if (tick.flash && problem!.flashBonus) {
              points += problem!.flashBonus;
            }
            return (
              <div key={tick.id} style={{ display: "flex", marginBottom: 2 }}>
                <div style={{ width: 50 }}>{problem!.number}</div>
                <div style={{ width: 150 }}>{color!.name}</div>
                <div style={{ width: 100, textAlign: "right" }}>{points}</div>
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
          <Button onClick={hideContenderDialog} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    compClassMap: getCompClassMap(state),
    problemMap: getProblemMap(state),
    colorMap: getColorMap(state),
  };
}

const mapDispatchToProps = {
  updateContender,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContenderView);
