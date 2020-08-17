import React, { useState } from "react";
import { ContenderData } from "src/model/contenderData";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import TableRow from "@material-ui/core/TableRow";
import {
  TableCell,
  Hidden,
  Collapse,
  Divider,
  Typography,
  Grid,
} from "@material-ui/core";
import { ContenderScoringInfo } from "src/model/contenderScoringInfo";
import { Environment } from "../../environment";
import Button from "@material-ui/core/Button";
import { CompClass } from "../../model/compClass";
import { updateContender } from "../../actions/asyncActions";
import { Problem } from "../../model/problem";
import { Color } from "../../model/color";
import { OrderedMap } from "immutable";
import {
  makeStyles,
  createStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import ContenderScoring from "./ContenderScoring";
import ContenderEdit from "./ContenderEdit";
import { ProgressButton } from "../ProgressButton";
import Alert from "@material-ui/lab/Alert";
import ContenderTickList from "./ContenderTickList";

interface Props {
  contender?: ContenderData;
  scoring?: ContenderScoringInfo;
  finalEnabled?: boolean;
  compClasses?: OrderedMap<number, CompClass>;
  problems?: OrderedMap<number, Problem>;
  colors?: OrderedMap<number, Color>;
  saveContender?: (contender: ContenderData) => Promise<void>;
  onBeginEdit?: () => void;
  updateContender?: (contender: ContenderData) => Promise<ContenderData>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableRow: {
      cursor: "pointer",
      "& > *": {
        border: 0,
      },
    },
    inputFields: {
      "& > *": {
        margin: theme.spacing(1, 0),
      },
    },
  })
);

const ContenderView = (props: Props) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const classes = useStyles();
  const theme = useTheme();

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const getCompClassName = (id?: number) => {
    let compClass = id ? props.compClasses?.get(id!) : undefined;
    return compClass ? compClass.name : "-";
  };

  const onDisqualify = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setSaving(true);
    props
      .updateContender?.({ ...props.contender!, disqualified: true })
      .finally(() => setSaving(false));
  };

  const onReenter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setSaving(true);
    props
      .updateContender?.({ ...props.contender!, disqualified: false })
      .finally(() => setSaving(false));
  };

  let scoring = props.scoring;
  let contender = props.contender!;

  return (
    <>
      <TableRow
        selected={expanded}
        className={classes.tableRow}
        hover
        onClick={() => {
          toggleExpanded();
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
        {!expanded ? (
          <>
            <Hidden smDown>
              <TableCell component="th" scope="row">
                {getCompClassName(contender.compClassId)}
              </TableCell>
              <TableCell component="th" scope="row">
                <div style={{ display: "inline-block" }}>
                  {contender.name ? scoring?.totalScore : "-"}{" "}
                  {contender.name && "(" + scoring?.totalPosition + ")"}
                </div>
              </TableCell>
              {props.finalEnabled && (
                <>
                  <TableCell component="th" scope="row">
                    <div style={{ width: 37, display: "inline-block" }}>
                      {contender.name ? scoring?.qualifyingScore : "-"}{" "}
                      {contender.name &&
                        "(" + scoring?.qualifyingPosition + ")"}
                    </div>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {scoring?.isFinalist ? "finalist" : ""}
                  </TableCell>
                </>
              )}
              <TableCell component="th" scope="row">
                {contender.name ? scoring?.ticks?.length : "-"}
              </TableCell>
            </Hidden>
          </>
        ) : (
          <Hidden smDown>
            <TableCell colSpan={3} />
          </Hidden>
        )}
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
      </TableRow>

      <TableRow selected={expanded}>
        <TableCell
          padding="none"
          colSpan={6}
          style={{ paddingBottom: 0, paddingTop: 0 }}
        >
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <div
              className={classes.inputFields}
              style={{
                minWidth: 304,
                maxWidth: 600,
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                flexBasis: 0,
                padding: theme.spacing(2),
              }}
            >
              <Typography
                color="textSecondary"
                display="block"
                variant="caption"
              >
                Info
              </Typography>

              <ContenderEdit
                contender={props.contender}
                compClasses={props.compClasses}
              />

              <Divider />

              <Typography
                color="textSecondary"
                display="block"
                variant="caption"
              >
                Results
              </Typography>

              {contender.disqualified ? (
                <Alert severity="warning">Contender is disqualified</Alert>
              ) : (
                <>
                  {scoring && (
                    <>
                      <Grid
                        container
                        direction="row"
                        spacing={1}
                        justify="flex-start"
                      >
                        <Grid item style={{ paddingLeft: 0 }}>
                          <ContenderScoring
                            title="Total"
                            score={scoring.totalScore ?? 0}
                            placement={scoring.totalPosition ?? 0}
                          ></ContenderScoring>
                        </Grid>
                        <Grid item>
                          <ContenderScoring
                            title="Qualifying"
                            score={scoring.qualifyingScore ?? 0}
                            placement={scoring.qualifyingPosition ?? 0}
                          ></ContenderScoring>
                        </Grid>
                      </Grid>
                      <ContenderTickList
                        scoring={props.scoring!}
                        problems={props.problems}
                        colors={props.colors}
                      />
                    </>
                  )}
                </>
              )}

              <Divider />

              <Typography
                color="textSecondary"
                display="block"
                variant="caption"
              >
                Advanced
              </Typography>

              <>
                {contender.disqualified ? (
                  <ProgressButton
                    variant="contained"
                    color="secondary"
                    onClick={onReenter}
                    loading={saving}
                  >
                    Reenter
                  </ProgressButton>
                ) : (
                  <ProgressButton
                    disabled={contender.entered == undefined}
                    variant="contained"
                    color="secondary"
                    onClick={onDisqualify}
                    loading={saving}
                  >
                    Disqualify
                  </ProgressButton>
                )}
              </>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    colors: state.colors,
  };
}

const mapDispatchToProps = {
  updateContender,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContenderView);
