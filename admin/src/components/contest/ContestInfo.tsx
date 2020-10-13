import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Route, RouteComponentProps, Switch } from "react-router";
import { Link, useLocation } from "react-router-dom";
import {} from "../../actions/actions";
import {
  loadCompClasses,
  loadContenders,
  loadContest,
  loadProblems,
  loadRaffles,
  loadTicks,
  reloadColors,
} from "../../actions/asyncActions";
import { StoreState } from "../../model/storeState";
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

const ContestInfo = (props: Props & PropsFromRedux & RouteComponentProps) => {
  let selectedPath = useLocation().pathname;
  let [loading, setLoading] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    if (props.contestId === undefined) {
      return;
    }

    let contest = props.contests?.get(props.contestId);

    if (contest === undefined) {
      setLoading(true);
      props.loadContest(props.contestId).finally(() => {
        setLoading(false);
      });
    }
  }, [props.contestId, props.contests, props.loadContest]);

  useEffect(() => {
    if (props.contestId !== undefined && props.colors === undefined) {
      props.reloadColors();
    }
  }, [props.contestId, props.colors, props.reloadColors]);

  useEffect(() => {
    if (props.contestId !== undefined && props.compClasses === undefined) {
      props.loadCompClasses(props.contestId);
    }
  }, [props.contestId, props.compClasses, props.loadCompClasses]);

  useEffect(() => {
    if (props.contestId !== undefined && props.problems === undefined) {
      props.loadProblems(props.contestId);
    }
  }, [props.contestId, props.problems, props.loadProblems]);

  useEffect(() => {
    if (props.contestId !== undefined && props.contenders === undefined) {
      props.loadContenders(props.contestId);
    }
  }, [props.contestId, props.contenders, props.loadContenders]);

  useEffect(() => {
    if (props.contestId !== undefined && props.ticks === undefined) {
      props.loadTicks(props.contestId);
    }
  }, [props.contestId, props.ticks, props.loadTicks]);

  useEffect(() => {
    if (props.contestId !== undefined && props.raffles === undefined) {
      props.loadRaffles(props.contestId);
    }
  }, [props.contestId, props.raffles, props.loadRaffles]);

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
        <Switch>
          <Route path="/contests/:contestId" exact>
            <ContestEdit
              key="general"
              contestId={props.contestId}
              loading={loading}
            />
          </Route>
          {props.contestId !== undefined && (
            <>
              <Route path="/contests/:contestId/statistics">
                <ContestStats key="statistics" contestId={props.contestId} />
              </Route>
              <Route path="/contests/:contestId/classes">
                <CompClassList key="compClasses" contestId={props.contestId} />
              </Route>
              <Route path="/contests/:contestId/problems">
                <ProblemList key="problems" contestId={props.contestId} />
              </Route>
              <Route path="/contests/:contestId/contenders">
                <ContenderList key="contenders" contestId={props.contestId} />
              </Route>
              <Route path="/contests/:contestId/raffles">
                <RaffleList key="raffles" contestId={props.contestId} />
              </Route>
            </>
          )}
        </Switch>
      </div>
    </>
  );
};

const mapStateToProps = (state: StoreState, props: Props) => ({
  colors: state.colors,
  contests: state.contests,
  compClasses: props.contestId
    ? state.compClassesByContest.get(props.contestId)
    : undefined,
  problems: props.contestId
    ? state.problemsByContest.get(props.contestId)
    : undefined,
  contenders: props.contestId
    ? state.contendersByContest.get(props.contestId)
    : undefined,
  ticks: props.contestId
    ? state.ticksByContest.get(props.contestId)
    : undefined,
  raffles: props.contestId
    ? state.rafflesByContest.get(props.contestId)
    : undefined,
});

const mapDispatchToProps = {
  reloadColors,
  loadCompClasses,
  loadProblems,
  loadContenders,
  loadTicks,
  loadRaffles,
  loadContest,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ContestInfo);
