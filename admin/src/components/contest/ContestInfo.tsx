import React, { useState, useEffect } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { StoreState } from "../../model/storeState";
import { connect } from "react-redux";
import {} from "../../actions/actions";
import ContestEdit from "./ContestEdit";
import RaffleList from "../raffle/RaffleList";
import { Switch, Route } from "react-router";
import { Link } from "react-router-dom";
import CompClassList from "../compClass/CompClassList";
import { useLocation } from "react-router-dom";
import ProblemList from "../problem/ProblemList";
import ContenderList from "../contender/ContenderList";
import {
  reloadColors,
  loadCompClasses,
  loadProblems,
  loadContenders,
  loadTicks,
  loadRaffles,
} from "../../actions/asyncActions";
import { Color } from "../../model/color";
import { RouteComponentProps, withRouter } from "react-router";
import { OrderedMap } from "immutable";

interface Props {
  match: {
    params: {
      contestId: string;
    };
  };

  colors?: OrderedMap<number, Color>;
  loadColors?: () => Promise<void>;
  loadCompClasses?: (contestId: number) => Promise<void>;
  loadProblems?: (contestId: number) => Promise<void>;
  loadContenders?: (contestId: number) => Promise<void>;
  loadTicks?: (contestId: number) => Promise<void>;
  loadRaffles?: (contestId: number) => Promise<void>;
}

const ContestInfo = (props: Props & RouteComponentProps) => {
  let selectedPath = useLocation().pathname;
  let [contestId, setContestId] = useState<number | undefined>(undefined);

  useEffect(() => {
    let id: string = props.match.params.contestId;
    if (id !== "new") {
      setContestId(parseInt(id));
    }
  }, [props.match]);

  useEffect(() => {
    if (contestId == undefined) {
      return;
    }

    Promise.all([
      props.colors == undefined ? props.loadColors?.() : Promise.resolve(),
      props.loadCompClasses?.(contestId),
      props.loadProblems?.(contestId),
      props.loadContenders?.(contestId),
      props.loadTicks?.(contestId),
      props.loadRaffles?.(contestId),
    ]);
  }, [contestId]);

  const selectTab = (event: any, newValue: string) => {
    props.history.push(newValue);
  };

  const createLink = (tab?: string): string => {
    if (contestId == undefined) {
      return "/contests/new";
    }

    let path = "/contests/" + contestId;
    if (tab != undefined) {
      path += "/" + tab;
    }

    return path;
  };

  if (!selectedPath.endsWith("/new") && contestId == undefined) {
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
        label="Classes"
        value={createLink("classes")}
        component={Link}
        to={createLink("classes")}
      />,
      <Tab
        key={2}
        label="Problems"
        value={createLink("problems")}
        component={Link}
        to={createLink("problems")}
      />,
      <Tab
        key={3}
        label="Contenders"
        value={createLink("contenders")}
        component={Link}
        to={createLink("contenders")}
      />,
      <Tab
        key={4}
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

      <Switch>
        <Route path="/contests/:contestId" exact>
          <ContestEdit key="general" contestId={contestId} />
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
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    match: props.match,
    colors: state.colors,
  };
}

const mapDispatchToProps = {
  loadColors: reloadColors,
  loadCompClasses,
  loadProblems,
  loadContenders,
  loadTicks,
  loadRaffles,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContestInfo);
