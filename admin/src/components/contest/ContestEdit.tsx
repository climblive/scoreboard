import React, { useState, useEffect, useMemo } from "react";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { Contest } from "../../model/contest";
import { InputLabel, TextField } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import RichTextEditor from "../RichTextEditor";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import WarningIcon from "@material-ui/icons/Warning";
import MenuItem from "@material-ui/core/MenuItem";
import { Series } from "../../model/series";
import { CompLocation } from "../../model/compLocation";
import { CreatePdfDialog } from "../CreatePdfDialog";
import { Environment } from "../../environment";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DeleteForeverRoundedIcon from "@material-ui/icons/DeleteForeverRounded";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import {
  saveContest,
  deleteContest,
  loadContest,
  reloadLocations,
  reloadSeries,
} from "../../actions/asyncActions";
import { setTitle, setErrorMessage } from "../../actions/actions";
import { Organizer } from "src/model/organizer";
import SaveIcon from "@material-ui/icons/Save";
import { saveAs } from "file-saver";
import { Api } from "src/utils/Api";
import { Problem } from "src/model/problem";
import { CompClass } from "src/model/compClass";
import {
  getProblemsForContestSorted,
  getCompClassesForContest,
  getContendersForContest,
  getSelectedOrganizer,
} from "../../selectors/selector";
import { ContenderData } from "src/model/contenderData";

interface Props {
  contestId?: number;
  contests?: Contest[];
  series?: Series[];
  locations?: CompLocation[];
  selectedOrganizer?: Organizer;
  problems?: Problem[];
  compClasses?: CompClass[];
  contenders?: ContenderData[];
  setTitle?: (title: string) => void;
  saveContest?: (contest: Contest) => Promise<Contest>;
  deleteContest?: (contest: Contest) => Promise<void>;
  loadContest?: (contestId: number) => Promise<Contest>;
  loadLocations?: () => Promise<void>;
  loadSeries?: () => Promise<void>;
}

const ContestEdit = (props: Props & RouteComponentProps) => {
  let [loading, setLoading] = useState<boolean>(false);
  let [saving, setSaving] = useState<boolean>(false);
  let [deleting, setDeleting] = useState<boolean>(false);
  let [compilingPdf, setCompilingPdf] = useState<boolean>(false);
  let [showPopup, setShowPopup] = useState<boolean>(false);
  let [requestingDelete, setRequestingDelete] = useState<boolean>(false);
  let [creatingPdf, setCreatingPdf] = useState<boolean>(false);
  let [contest, setContest] = useState<Contest>({
    organizerId: props.selectedOrganizer?.id!,
    protected: false,
    name: "",
    description: "",
    finalEnabled: true,
    qualifyingProblems: 10,
    finalists: 5,
    rules: "",
    gracePeriod: 15,
  });

  useEffect(() => {
    if (props.locations == undefined) {
      props.loadLocations?.();
    }
    if (props.series == undefined) {
      props.loadSeries?.();
    }
  }, [props.series, props.locations]);

  useEffect(() => {
    if (props.contestId != undefined) {
      let contest = props.contests?.find(
        (contest) => contest.id === props.contestId
      );
      if (contest != undefined) {
        setContest(contest);
      } else {
        setLoading(true);
        props
          .loadContest?.(props.contestId)
          .then((contest) => {
            setContest(contest);
          })
          .finally(() => setLoading(false));
      }
    }
  }, [props.contestId]);

  useEffect(() => {
    let title = contest?.id == undefined ? "Add contest" : contest.name;
    props.setTitle?.(title);
  }, [contest.name]);

  const contestIssues = useMemo(() => {
    let issues: string[] = [];
    if ((props.problems?.length ?? 0) == 0) {
      issues.push("Please add problems");
    }
    if ((props.compClasses?.length ?? 0) == 0) {
      issues.push("Please add at least one competition class");
    }
    if ((props.contenders?.length ?? 0) == 0) {
      issues.push("Please add contenders");
    }
    return issues;
  }, [props.problems, props.compClasses, props.contenders]);

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

  const onLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId =
      e.target.value == "None" ? undefined : parseInt(e.target.value);
    setContest({ ...contest, locationId });
  };

  const onSeriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const seriesId =
      e.target.value == "None" ? undefined : parseInt(e.target.value);
    setContest({ ...contest, seriesId });
  };

  const onSave = () => {
    let isNew = contest.id == undefined;
    setSaving(true);
    props
      .saveContest?.(contest)
      .then((contest) => {
        if (isNew) {
          props.history.push("/contests/" + contest.id);
        }
      })
      .finally(() => setSaving(false));
  };

  const onDelete = () => {
    setRequestingDelete(true);
  };

  const onDeleteConfirmed = (result: boolean) => {
    if (result) {
      setDeleting(true);
      props
        .deleteContest?.(contest)
        .then(() => props.history.push("/contests"))
        .catch((error) => setDeleting(false));
    }

    setRequestingDelete(false);
  };

  const startPdfCreate = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const isNew = () => {
    return contest.id == undefined;
  };

  const createPdfFromTemplate = (file: Blob) => {
    let reader = new FileReader();
    reader.onload = (evt: any) => {
      let arrayBuffer = evt.currentTarget.result;
      setCompilingPdf(true);
      Api.createPdfFromTemplate(contest.id!, arrayBuffer)
        .then((response) => {
          saveAs(response, "contest.pdf");
        })
        .catch((error) => {
          setErrorMessage(error);
        })
        .finally(() => setCompilingPdf(false));
    };

    reader.onerror = (evt: any) => {
      setErrorMessage("Failed to load file: " + evt);
    };

    reader.readAsArrayBuffer(file);
  };

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
    <Paper>
      {contestIssues.map((issue) => (
        <div
          style={{
            padding: 10,
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            color: "#e49c3b",
          }}
          key={issue}
        >
          <WarningIcon style={{ marginRight: 10 }} />
          {issue}
        </div>
      ))}
      <div style={{ padding: 10 }}>
        {!isNew() && contestIssues.length == 0 && (
          <div style={{ marginBottom: 10 }}>
            <Button
              style={{ marginRight: 10 }}
              variant="outlined"
              color="primary"
              onClick={startPdfCreate}
              disabled={compilingPdf}
              startIcon={compilingPdf && <CircularProgress size={24} />}
            >
              Create PDF
            </Button>
            <Button
              href={scoreboardUrl}
              target="_blank"
              variant="outlined"
              color="primary"
            >
              Open scoreboard
            </Button>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            <TextField
              label="Name"
              value={contest.name}
              onChange={onNameChange}
              disabled={loading}
            />
            <TextField
              style={{ marginTop: 10 }}
              label="Description"
              value={contest.description}
              onChange={onDescriptionChange}
              disabled={loading}
            />
            {(props.locations?.length ?? 0) > 0 && (
              <FormControl style={{ marginTop: 10 }}>
                <InputLabel shrink htmlFor="location-select">
                  Location
                </InputLabel>
                <Select
                  id="location-select"
                  value={contest.locationId ?? "None"}
                  onChange={onLocationChange}
                  disabled={loading}
                >
                  <MenuItem value="None">
                    <em>None</em>
                  </MenuItem>
                  {props.locations?.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {(props.series?.length ?? 0) > 0 && (
              <FormControl style={{ marginTop: 10 }}>
                <InputLabel shrink htmlFor="series-select">
                  Series
                </InputLabel>
                <Select
                  id="series-select"
                  value={contest.seriesId ?? "None"}
                  onChange={onSeriesChange}
                  disabled={loading}
                >
                  <MenuItem value="None">
                    <em>None</em>
                  </MenuItem>
                  {props.series?.map((series) => (
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
              disabled={loading}
            />
            {contest.finalEnabled && (
              <>
                <TextField
                  style={{ marginTop: 10 }}
                  label="Number of qualifying problems"
                  value={contest.qualifyingProblems}
                  onChange={onQualifyingProblemsChange}
                  disabled={loading}
                />
                <TextField
                  style={{ marginTop: 10 }}
                  label="Number of finalists"
                  value={contest.finalists}
                  onChange={onFinalistsChange}
                  disabled={loading}
                />
              </>
            )}
            <TextField
              style={{ marginTop: 10 }}
              label="Grace period (minutes)"
              value={contest.gracePeriod}
              onChange={onGracePeriodChange}
              disabled={loading}
            />
          </div>
          <div
            style={{
              marginLeft: 10,
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            <RichTextEditor
              title="Rules:"
              value={contest.rules}
              onChange={onRulesChange}
            />
          </div>
        </div>
        <Button
          style={{ marginTop: 10 }}
          variant="outlined"
          color="primary"
          onClick={onSave}
          startIcon={saving ? <CircularProgress size={24} /> : <SaveIcon />}
        >
          {isNew() ? "Create" : "Save"}
        </Button>
        {!isNew() && (
          <Button
            style={{ marginLeft: 10, marginTop: 10 }}
            variant="contained"
            color="secondary"
            disabled={contest.protected}
            onClick={onDelete}
            startIcon={
              deleting ? (
                <CircularProgress size={24} />
              ) : (
                <DeleteForeverRoundedIcon />
              )
            }
          >
            Delete
          </Button>
        )}
      </div>
      <CreatePdfDialog
        open={showPopup}
        creatingPdf={creatingPdf || false}
        createPdf={createPdf}
        createPdfFromTemplate={createPdfFromTemplate}
        onClose={closePopup}
      />
      <ConfirmationDialog
        open={requestingDelete}
        title={"Delete contest"}
        message={`Do you really wish to delete the contest ${contest.name} together with all its classes, problems, contenders, raffles and results? This action is irreversible and cannot be undone!`}
        onClose={onDeleteConfirmed}
      />
    </Paper>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    contests: state.contests,
    series: state.series,
    locations: state.locations,
    selectedOrganizer: getSelectedOrganizer(state),
    problems: getProblemsForContestSorted(state, props.contestId),
    compClasses: getCompClassesForContest(state, props.contestId),
    contenders: getContendersForContest(state, props.contestId),
  };
}

const mapDispatchToProps = {
  saveContest,
  deleteContest,
  setTitle,
  loadContest,
  setErrorMessage,
  loadLocations: reloadLocations,
  loadSeries: reloadSeries,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ContestEdit));
