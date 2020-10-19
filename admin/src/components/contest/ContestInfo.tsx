import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { useCallback, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Route, RouteComponentProps, Switch } from "react-router";
import { Link, useLocation } from "react-router-dom";
import {} from "../../actions/actions";
import { loadContest, reloadColors } from "../../actions/asyncActions";
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
  const { loadContest, reloadColors } = props;

  let selectedPath = useLocation().pathname;
  let [loading, setLoading] = useState(false);

  const classes = useStyles();

  const initialize = useCallback(() => {
    if (props.contestId === undefined) {
      return;
    }

    setLoading(true);
    loadContest(props.contestId).finally(() => {
      setLoading(false);
    });
  }, [props.contestId, loadContest]);

  useEffect(() => initialize(), [initialize]);

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
});

const mapDispatchToProps = {
  reloadColors,
  loadContest,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ContestInfo);
