import {
  Paper,
  StyledComponentProps,
  TableCell,
  TableContainer,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import { OrderedMap } from "immutable";
import React, { useState } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { loadRaffles, saveRaffle } from "../../actions/asyncActions";
import { ContenderData } from "../../model/contenderData";
import { Raffle } from "../../model/raffle";
import { StoreState } from "../../model/storeState";
import ProgressIconButton from "../ProgressIconButton";
import ResponsiveTableHead from "../ResponsiveTableHead";
import RaffleView from "./RaffleView";

interface Props {
  contestId?: number;
  raffles?: OrderedMap<number, Raffle>;
  contenders?: OrderedMap<number, ContenderData>;

  loadRaffles?: (contestId: number) => Promise<void>;
  saveRaffle?: (raffle: Raffle) => Promise<Raffle>;
}

const breakpoints = new Map<number, string>();

const RaffleList = (
  props: Props & RouteComponentProps & StyledComponentProps
) => {
  const [creating, setCreating] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const createRaffle = () => {
    setCreating(true);
    props
      .saveRaffle?.({ contestId: props.contestId!, active: false })
      .finally(() => setCreating(false));
  };

  const refreshRaffles = () => {
    setRefreshing(true);
    props.loadRaffles?.(props.contestId!).finally(() => setRefreshing(false));
  };

  const toolbar = (
    <>
      <ProgressIconButton
        color="inherit"
        aria-label="Menu"
        title="Add"
        loading={creating}
        onClick={createRaffle}
      >
        <AddIcon />
      </ProgressIconButton>

      <ProgressIconButton
        color="inherit"
        aria-label="Menu"
        title="Refresh"
        onClick={refreshRaffles}
        loading={refreshing}
      >
        <RefreshIcon />
      </ProgressIconButton>
    </>
  );

  const headings = [<TableCell>Raffle</TableCell>];

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <ResponsiveTableHead
            cells={headings}
            breakpoints={breakpoints}
            toolbar={toolbar}
          />

          <TableBody>
            {props.raffles?.toArray()?.map((raffle: Raffle) => (
              <RaffleView
                key={raffle.id!}
                raffle={raffle}
                contenders={props.contenders}
                breakpoints={breakpoints}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {(props.raffles?.size ?? 0) === 0 && (
        <div className={"emptyText"}>
          <div>You have no raffles.</div>
          <div>Please create a raffle by clicking the plus button above.</div>
        </div>
      )}
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    contenders: state.contendersByContest.get(props.contestId),
    raffles: state.rafflesByContest.get(props.contestId),
  };
}

const mapDispatchToProps = {
  loadRaffles,
  saveRaffle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(RaffleList));
