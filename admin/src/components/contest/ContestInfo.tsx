import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { OrderedMap } from "immutable";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
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
import { Color } from "../../model/color";
import { Contest } from "../../model/contest";
import { StoreState } from "../../model/storeState";
import CompClassList from "../compClass/CompClassList";
import ContenderList from "../contender/ContenderList";
import ProblemList from "../problem/ProblemList";
import RaffleList from "../raffle/RaffleList";
import ContestEdit from "./ContestEdit";
import ContestStats from "./ContestStats";

interface Props {
  match: {
    params: {
      contestId: string;
    };
  };

  colors?: OrderedMap<number, Color>;
  contests?: OrderedMap<number, Contest>;
  loadColors?: () => Promise<void>;
  loadCompClasses?: (contestId: number) => Promise<void>;
  loadProblems?: (contestId: number) => Promise<void>;
  loadContenders?: (contestId: number) => Promise<void>;
  loadTicks?: (contestId: number) => Promise<void>;
  loadRaffles?: (contestId: number) => Promise<void>;
  loadContest?: (contestId: number) => Promise<Contest>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    page: {
      marginTop: theme.spacing(2),
    },
  })
);

const ContestInfo = (props: Props & RouteComponentProps) => {
  let selectedPath = useLocation().pathname;
  let [contestId, setContestId] = useState<number | undefined>(undefined);
  let [loading, setLoading] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    let id: string = props.match.params.contestId;
    if (id !== "new") {
      setContestId(parseInt(id));
    }
  }, [props.match]);

  useEffect(() => {
    if (contestId === undefined) {
      return;
    }

    let loadables: Array<Promise<any> | undefined> = [
      props.colors === undefined ? props.loadColors?.() : Promise.resolve(),
      props.loadCompClasses?.(contestId),
      props.loadProblems?.(contestId),
      props.loadContenders?.(contestId),
      props.loadTicks?.(contestId),
      props.loadRaffles?.(contestId),
    ];

    let contest = props.contests?.get(contestId);

    if (contest === undefined) {
      loadables.push(props.loadContest?.(contestId));
    }

    setLoading(true);
    Promise.all(loadables).finally(() => setLoading(false));
  }, [
    contestId,
    props.colors,
    props.contests,
    props.loadColors,
    props.loadCompClasses,
    props.loadContenders,
    props.loadContest,
    props.loadProblems,
    props.loadRaffles,
    props.loadTicks,
  ]);

  const selectTab = (event: any, newValue: string) => {
    props.history.push(newValue);
  };

  const createLink = (tab?: string): string => {
    if (contestId === undefined) {
      return "/contests/new";
    }

    let path = "/contests/" + contestId;
    if (tab !== undefined) {
      path += "/" + tab;
    }

    return path;
  };

  if (!selectedPath.endsWith("/new") && contestId === undefined) {
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

  if (contestId) {
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
              contestId={contestId}
              loading={loading}
            />
          </Route>
          <Route path="/contests/:contestId/statistics">
            <ContestStats key="statistics" contestId={contestId} />
          </Route>
          <Route path="/contests/:contestId/classes">
            <CompClassList key="compClasses" contestId={contestId} />
          </Route>
          <Route path="/contests/:contestId/problems">
            <ProblemList key="problems" contestId={contestId} />
          </Route>
          <Route path="/contests/:contestId/contenders">
            <ContenderList key="contenders" contestId={contestId} />
          </Route>
          <Route path="/contests/:contestId/raffles">
            <RaffleList key="raffles" contestId={contestId} />
          </Route>
        </Switch>
      </div>
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    match: props.match,
    colors: state.colors,
    contests: state.contests,
  };
}

const mapDispatchToProps = {
  loadColors: reloadColors,
  loadCompClasses,
  loadProblems,
  loadContenders,
  loadTicks,
  loadRaffles,
  loadContest,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContestInfo);
