import { Divider, Grid, TableCell, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { OrderedMap } from "immutable";
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ContenderData } from "src/model/contenderData";
import { ContenderScoringInfo } from "src/model/contenderScoringInfo";
import { updateContender } from "../../actions/asyncActions";
import { Environment } from "../../environment";
import { CompClass } from "../../model/compClass";
import { Problem } from "../../model/problem";
import { StoreState } from "../../model/storeState";
import { ProgressButton } from "../ProgressButton";
import ResponsiveTableRow from "../ResponsiveTableRow";
import ContenderEdit from "./ContenderEdit";
import ContenderScoring from "./ContenderScoring";
import ContenderTickList from "./ContenderTickList";

interface Props {
  contender: ContenderData;
  scoring?: ContenderScoringInfo;
  compClasses?: OrderedMap<number, CompClass>;
  problems?: OrderedMap<number, Problem>;
  breakpoints?: Map<number, string>;
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
    },
    buttons: {
      "& > *": {
        margin: theme.spacing(1, 0),
      },
    },
  })
);

const ContenderView = (props: Props & PropsFromRedux) => {
  const [saving, setSaving] = useState<boolean>(false);

  const classes = useStyles();

  const getCompClassName = (id?: number) => {
    let compClass = id ? props.compClasses?.get(id!) : undefined;
    return compClass ? compClass.name : "-";
  };

  const onDisqualify = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setSaving(true);
    props
      .updateContender?.({ ...props.contender, disqualified: true })
      .finally(() => setSaving(false));
  };

  const onReenter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setSaving(true);
    props
      .updateContender?.({ ...props.contender, disqualified: false })
      .finally(() => setSaving(false));
  };

  let scoring = props.scoring;
  let contender = props.contender;

  const cells = [
    <TableCell
      style={contender.disqualified ? { textDecoration: "line-through" } : {}}
      component="th"
      scope="row"
    >
      {contender.name}
    </TableCell>,
    <TableCell component="th" scope="row">
      {getCompClassName(contender.compClassId)}
    </TableCell>,
    <TableCell component="th" scope="row">
      <div style={{ display: "inline-block" }}>
        {contender.name ? scoring?.totalScore : "-"}{" "}
        {contender.name && "(" + scoring?.totalPosition + ")"}
      </div>
    </TableCell>,
    <TableCell component="th" scope="row">
      {contender.name ? scoring?.ticks?.length : "-"}
    </TableCell>,
    <TableCell component="th" scope="row">
      <Button
        href={
          "https://" + Environment.siteDomain + "/" + contender.registrationCode
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
    </TableCell>,
  ];

  return (
    <ResponsiveTableRow cells={cells} breakpoints={props.breakpoints}>
      <div className={classes.collapsableBody}>
        <Typography color="textSecondary" display="block" variant="caption">
          Info
        </Typography>

        <ContenderEdit
          contender={props.contender}
          compClasses={props.compClasses}
        />

        <Divider />

        <Typography color="textSecondary" display="block" variant="caption">
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
                  scoring={scoring}
                  problems={props.problems}
                  colors={props.colors}
                />
              </>
            )}
          </>
        )}

        <Divider />

        <Typography color="textSecondary" display="block" variant="caption">
          Advanced
        </Typography>

        <div className={classes.buttons}>
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
              disabled={contender.entered === undefined}
              variant="contained"
              color="secondary"
              onClick={onDisqualify}
              loading={saving}
            >
              Disqualify
            </ProgressButton>
          )}
        </div>
      </div>
    </ResponsiveTableRow>
  );
};

const mapStateToProps = (state: StoreState) => ({
  colors: state.colors,
});

const mapDispatchToProps = {
  updateContender,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ContenderView);
