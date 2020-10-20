import { LinearProgress } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { useCallback, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Route, RouteComponentProps, Switch } from "react-router";
import { Link, useLocation } from "react-router-dom";
import {} from "../../actions/actions";
import {
  loadContest,
  unloadContest,
  reloadColors,
} from "../../actions/asyncActions";
import { Contest } from "../../model/contest";
import { StoreState } from "../../model/storeState";
import { getSelectedOrganizer } from "../../selectors/selector";
import CompClassList from "../compClass/CompClassList";
import ContenderList from "../contender/ContenderList";
import ProblemList from "../problem/ProblemList";
import RaffleList from "../raffle/RaffleList";
import ContestEdit from "./ContestEdit";
import ContestStats from "./ContestStats";

interface Props {
  contestId?: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    page: {
      marginTop: theme.spacing(2),
    },
  })
);

const ContestView = (props: Props & PropsFromRedux & RouteComponentProps) => {
  const { loadContest, unloadContest, reloadColors } = props;

  let selectedPath = useLocation().pathname;
  let [loading, setLoading] = useState(false);
  const [contest, setContest] = useState<Contest | undefined>(undefined);

  const classes = useStyles();

  const initialize = useCallback(() => {
    if (contest) {
      return function cleanup() {
        if (contest.id !== undefined) {
          unloadContest(contest.id);
        }
      };
    }

    if (props.contestId === undefined) {
      setContest({
        organizerId: props.selectedOrganizer?.id!,
        protected: false,
        name: "",
        description: "",
        finalEnabled: false,
        qualifyingProblems: 10,
        finalists: 5,
        rules: "",
        gracePeriod: 15,
      });
    } else {
      setLoading(true);
      loadContest(props.contestId)
        .then((contest) => {
          setContest(contest);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    return () => {};
  }, [
    props.contestId,
    contest,
    props.selectedOrganizer,
    loadContest,
    unloadContest,
  ]);

  useEffect(() => initialize(), [initialize]);

  useEffect(() => {
    return () => {
      props.history.push("/");
    };
  }, [props.history, props.selectedOrganizer]);

  useEffect(() => {
    if (props.colors === undefined) {
      reloadColors();
    }
  }, [props.colors, reloadColors]);

  const selectTab = (event: any, newValue: string) => {
    props.history.push(newValue);
  };

  const createLink = (tab?: string): string => {
    if (props.contestId === undefined) {
      return "/contests/new";
    }

    let path = "/contests/" + props.contestId;
    if (tab !== undefined) {
      path += "/" + tab;
    }

    return path;
  };

  if (!selectedPath.endsWith("/new") && props.contestId === undefined) {
    return <></>;
  }

  let tabs = [
    <Tab
      key={0}
      label="General information"
      value={createLink()}
      component={Link}
      to={createLink()}
    />,
  ];

  if (props.contestId) {
    tabs = [
      ...tabs,
      <Tab
        key={1}
        label="Statistics"
        value={createLink("statistics")}
        component={Link}
        to={createLink("statistics")}
      />,
      <Tab
        key={2}
        label="Classes"
        value={createLink("classes")}
        component={Link}
        to={createLink("classes")}
      />,
      <Tab
        key={3}
        label="Problems"
        value={createLink("problems")}
        component={Link}
        to={createLink("problems")}
      />,
      <Tab
        key={4}
        label="Contenders"
        value={createLink("contenders")}
        component={Link}
        to={createLink("contenders")}
      />,
      <Tab
        key={5}
        label="Raffles"
        value={createLink("raffles")}
        component={Link}
        to={createLink("raffles")}
      />,
    ];
  }

  return (
    <>
      <Tabs
        key="tabs"
        value={selectedPath}
        onChange={selectTab}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs}
      </Tabs>

      <div className={classes.page}>
        {loading ? (
          <LinearProgress color="secondary" />
        ) : (
          contest && (
            <Switch>
              <Route path="/contests/:contestId" exact>
                <ContestEdit key="general" contest={contest} />
              </Route>
              {contest?.id !== undefined && (
                <>
                  <Route path="/contests/:contestId/statistics">
                    <ContestStats key="statistics" contestId={contest.id} />
                  </Route>
                  <Route path="/contests/:contestId/classes">
                    <CompClassList key="compClasses" contestId={contest.id} />
                  </Route>
                  <Route path="/contests/:contestId/problems">
                    <ProblemList key="problems" contestId={contest.id} />
                  </Route>
                  <Route path="/contests/:contestId/contenders">
                    <ContenderList key="contenders" contestId={contest.id} />
                  </Route>
                  <Route path="/contests/:contestId/raffles">
                    <RaffleList key="raffles" contestId={contest.id} />
                  </Route>
                </>
              )}
            </Switch>
          )
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state: StoreState, props: Props) => ({
  colors: state.colors,
  contests: state.contests,
  selectedOrganizer: getSelectedOrganizer(state),
});

const mapDispatchToProps = {
  reloadColors,
  loadContest,
  unloadContest,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ContestView);
