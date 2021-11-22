import { LinearProgress } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Route, RouteComponentProps, Switch } from "react-router";
import { Link, useLocation } from "react-router-dom";
import {} from "../../actions/actions";
import {
  loadContest,
  reloadColors,
  unloadContest,
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

  const selectedPath = useLocation().pathname;
  const [loading, setLoading] = useState(false);
  const contest =
    props.contestId !== undefined
      ? props.contests?.get(props.contestId)
      : undefined;

  const classes = useStyles();

  const defaultContest: Contest = {
    organizerId: props.selectedOrganizer?.id!,
    protected: false,
    name: "",
    description: "",
    finalEnabled: false,
    qualifyingProblems: 10,
    finalists: 5,
    rules: "",
    gracePeriod: 15,
  };

  useEffect(() => {
    const contestId = props.contestId;

    if (contestId !== undefined) {
      setLoading(true);
      loadContest(contestId).finally(() => {
        setLoading(false);
      });

      return () => unloadContest(contestId);
    }

    return () => {};
  }, [props.contestId, props.selectedOrganizer, loadContest, unloadContest]);

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

  const selectTab = (_event: any, newValue: string) => {
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
          <Switch>
            <Route path="/contests/:contestId" exact>
              <ContestEdit contest={contest ?? defaultContest} />
            </Route>
            {props.contestId !== undefined && (
              <Route path="/contests/:contestId/">
                <Switch>
                  <Route path="/contests/:contestId/statistics">
                    <ContestStats contestId={props.contestId} />
                  </Route>
                  <Route path="/contests/:contestId/classes">
                    <CompClassList contestId={props.contestId} />
                  </Route>
                  <Route path="/contests/:contestId/problems">
                    <ProblemList contestId={props.contestId} />
                  </Route>
                  <Route path="/contests/:contestId/contenders">
                    <ContenderList contestId={props.contestId} />
                  </Route>
                  <Route path="/contests/:contestId/raffles">
                    <RaffleList contestId={props.contestId} />
                  </Route>
                </Switch>
              </Route>
            )}
          </Switch>
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
