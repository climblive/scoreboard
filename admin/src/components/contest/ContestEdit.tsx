import { Divider, InputLabel, TextField, useTheme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import DeleteForeverRoundedIcon from "@material-ui/icons/DeleteForeverRounded";
import DescriptionIcon from "@material-ui/icons/Description";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import LockIcon from "@material-ui/icons/Lock";
import SaveIcon from "@material-ui/icons/Save";
import Alert from "@material-ui/lab/Alert";
import { saveAs } from "file-saver";
import React, { useEffect, useMemo, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { Api } from "src/utils/Api";
import { setErrorMessage } from "../../actions/actions";
import {
  copyContest,
  deleteContest,
  loadContest,
  reloadLocations,
  reloadSeries,
  saveContest,
} from "../../actions/asyncActions";
import { Environment } from "../../environment";
import { CompLocation } from "../../model/compLocation";
import { Contest } from "../../model/contest";
import { Series } from "../../model/series";
import { StoreState } from "../../model/storeState";
import { getSelectedOrganizer } from "../../selectors/selector";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { ProgressButton } from "../ProgressButton";
import RichTextEditor from "../RichTextEditor";

interface Props {
  contest: Contest;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttons: {
      margin: theme.spacing(2, 0),
      "& > *": {
        marginRight: theme.spacing(1),
      },
    },
    inputFields: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  })
);

const ContestEdit = (props: Props & PropsFromRedux & RouteComponentProps) => {
  const { loadLocations, loadSeries } = props;

  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [duplicating, setDuplicating] = useState<boolean>(false);
  const [compilingPdf, setCompilingPdf] = useState<boolean>(false);
  const [requestingDelete, setRequestingDelete] = useState<boolean>(false);
  const [contest, setContest] = useState<Contest>(props.contest);
  const [validated, setValidated] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (props.locations === undefined) {
      loadLocations();
    }
    if (props.series === undefined) {
      loadSeries();
    }
  }, [props.series, props.locations, loadLocations, loadSeries]);

  const classes = useStyles();
  const theme = useTheme();

  const contestIssues = useMemo(() => {
    let issues: any[] = [];

    if (contest.id === undefined) {
      return issues;
    }

    if ((props.problems?.size ?? 0) === 0) {
      issues.push({
        description: "Please add problems",
        link: `/contests/${contest.id}/problems`,
      });
    }
    if ((props.compClasses?.size ?? 0) === 0) {
      issues.push({
        description: "Please add at least one competition class",
        link: `/contests/${contest.id}/classes`,
      });
    }
    if ((props.contenders?.size ?? 0) === 0) {
      issues.push({
        description: "Please add contenders",
        link: `/contests/${contest.id}/contenders`,
      });
    }
    return issues;
  }, [contest, props.problems, props.compClasses, props.contenders]);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContest({ ...contest, name: e.target.value });
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContest({ ...contest, description: e.target.value });
  };

  const onQualifyingProblemsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContest({
      ...contest,
      qualifyingProblems: Number.parseInt(e.target.value),
    });
  };

  const onFinalistsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContest({ ...contest, finalists: Number.parseInt(e.target.value) });
  };

  const onGracePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContest({ ...contest, gracePeriod: Number.parseInt(e.target.value) });
  };

  const onFinalEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContest({ ...contest, finalEnabled: e.target.checked });
  };

  const onRulesChange = (rules: string) => {
    setContest({ ...contest, rules });
  };

  const onLocationChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const locationId =
      e.target.value === "None"
        ? undefined
        : parseInt(e.target.value as string);
    setContest({ ...contest, locationId });
  };

  const onSeriesChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const seriesId =
      e.target.value === "None"
        ? undefined
        : parseInt(e.target.value as string);
    setContest({ ...contest, seriesId });
  };

  const validate = () => {
    if (contest.name === "") {
      return false;
    }

    return true;
  };

  const onSave = () => {
    setValidated(true);

    if (!validate()) {
      return;
    }

    setSaving(true);
    props
      .saveContest(contest)
      .then((contest) => {
        setContest(contest);
        if (isNew) {
          props.history.push("/contests/" + contest.id!);
        }
      })
      .finally(() => {
        if (!isNew) {
          setSaving(false);
        }
      });
  };

  const onDelete = () => {
    setRequestingDelete(true);
  };

  const onDeleteConfirmed = (result: boolean) => {
    if (result) {
      setDeleting(true);
      props
        .deleteContest(contest)
        .then(() => props.history.push("/contests"))
        .catch((error) => setDeleting(false));
    }

    setRequestingDelete(false);
  };

  const onDuplicate = async () => {
    setDuplicating(true);

    const copy = await props.copyContest(contest.id!);

    setDuplicating(false);

    history.push(`/contests/${copy.id}`);
  };

  const isNew = contest.id === undefined;

  const createPdf = () => {
    setCompilingPdf(true);
    Api.createPdf(contest.id!)
      .then((response) => {
        saveAs(response, "contest.pdf");
      })
      .catch((error) => {
        setErrorMessage(error);
      })
      .finally(() => setCompilingPdf(false));
  };

  let scoreboardUrl =
    "https://" + Environment.siteDomain + "/scoreboard/" + contest.id;

  return (
    <>
      {!isNew && (
        <div className={classes.buttons}>
          <ProgressButton
            size="small"
            variant="contained"
            color="secondary"
            onClick={createPdf}
            loading={compilingPdf}
            startIcon={<DescriptionIcon />}
          >
            Create PDF
          </ProgressButton>
          <Button
            size="small"
            href={scoreboardUrl}
            target="_blank"
            variant="contained"
            color="secondary"
          >
            Open scoreboard
          </Button>
        </div>
      )}
      {contestIssues.map((issue) => (
        <div
          key={issue.link}
          style={{
            marginTop: theme.spacing(1),
          }}
        >
          <Link to={issue.link}>
            <Alert severity="warning">{issue.description}</Alert>
          </Link>
        </div>
      ))}
      <div>
        <div
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          <div
            className={classes.inputFields}
            style={{
              minWidth: 296,
              maxWidth: 600,
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              flexBasis: 0,
              marginRight: theme.spacing(0.5),
            }}
          >
            <TextField
              label="Name"
              value={contest.name}
              onChange={onNameChange}
              required
              error={validated && contest.name === ""}
            />
            <TextField
              label="Description"
              value={contest.description}
              onChange={onDescriptionChange}
            />
            {(props.locations?.size ?? 0) > 0 && (
              <FormControl>
                <InputLabel shrink htmlFor="location-select">
                  Location
                </InputLabel>
                <Select
                  id="location-select"
                  value={contest.locationId ?? "None"}
                  onChange={onLocationChange}
                >
                  <MenuItem value="None">
                    <em>None</em>
                  </MenuItem>
                  {props.locations?.toArray()?.map((location: CompLocation) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {(props.series?.size ?? 0) > 0 && (
              <FormControl>
                <InputLabel shrink htmlFor="series-select">
                  Series
                </InputLabel>
                <Select
                  id="series-select"
                  value={contest.seriesId ?? "None"}
                  onChange={onSeriesChange}
                >
                  <MenuItem value="None">
                    <em>None</em>
                  </MenuItem>
                  {props.series?.toArray()?.map((series: Series) => (
                    <MenuItem key={series.id} value={series.id}>
                      {series.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={contest.finalEnabled}
                  onChange={onFinalEnabledChange}
                />
              }
              label="Enable finals"
              labelPlacement="end"
            />
            {contest.finalEnabled && (
              <TextField
                type="number"
                label="Number of finalists"
                value={contest.finalists}
                onChange={onFinalistsChange}
              />
            )}
            <TextField
              type="number"
              label="Number of qualifying problems"
              value={contest.qualifyingProblems}
              onChange={onQualifyingProblemsChange}
              helperText="The number of (hardest) problems that count towards the score"
            />
            <TextField
              type="number"
              label="Grace period (minutes)"
              value={contest.gracePeriod}
              onChange={onGracePeriodChange}
              helperText="Extra time after the end of the contest during which contenders can enter their last results"
            />
          </div>
          <div
            className={classes.inputFields}
            style={{
              minWidth: 296,
              maxWidth: 600,
              minHeight: 360,
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            <RichTextEditor
              title="Rules"
              value={contest.rules}
              onChange={onRulesChange}
            />
          </div>
        </div>
        <div className={classes.buttons}>
          <ProgressButton
            variant="contained"
            color="secondary"
            onClick={onSave}
            loading={saving}
            startIcon={<SaveIcon />}
          >
            {isNew ? "Create" : "Save"}
          </ProgressButton>
        </div>

        <Divider />

        {!isNew && (
          <>
            <div className={classes.buttons}>
              <ProgressButton
                variant="contained"
                color="primary"
                onClick={onDuplicate}
                loading={duplicating}
                startIcon={<FileCopyIcon />}
              >
                Duplicate
              </ProgressButton>
              <ProgressButton
                variant="contained"
                color="primary"
                disabled={contest.protected}
                onClick={onDelete}
                loading={deleting}
                startIcon={
                  contest.protected ? (
                    <LockIcon />
                  ) : (
                    <DeleteForeverRoundedIcon />
                  )
                }
              >
                Delete
              </ProgressButton>
            </div>
          </>
        )}
      </div>
      <ConfirmationDialog
        open={requestingDelete}
        title={"Delete contest"}
        message={`Do you really wish to delete the contest together with all its classes, problems, contenders, raffles and results? This action is irreversible and cannot be undone!`}
        onClose={onDeleteConfirmed}
      />
    </>
  );
};

const mapStateToProps = (state: StoreState, props: Props) => ({
  contests: state.contests,
  series: state.series,
  locations: state.locations,
  selectedOrganizer: getSelectedOrganizer(state),
  problems:
    props.contest.id !== undefined
      ? state.problemsByContest.get(props.contest.id)
      : undefined,
  compClasses:
    props.contest.id !== undefined
      ? state.compClassesByContest.get(props.contest.id)
      : undefined,
  contenders:
    props.contest.id !== undefined
      ? state.contendersByContest.get(props.contest.id)
      : undefined,
});

const mapDispatchToProps = {
  saveContest,
  deleteContest,
  loadContest,
  setErrorMessage,
  loadLocations: reloadLocations,
  loadSeries: reloadSeries,
  copyContest,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(ContestEdit));
