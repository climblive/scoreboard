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
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface Props {
  contestId?: number;
  raffles?: OrderedMap<number, Raffle>;
  contenders?: OrderedMap<number, ContenderData>;

  loadRaffles?: (contestId: number) => Promise<void>;
  saveRaffle?: (raffle: Raffle) => Promise<Raffle>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      "& > *": {
        padding: theme.spacing(0, 0, 0, 1),
      },
    },
    emptyText: { padding: theme.spacing(2) },
  })
);

const breakpoints = new Map<number, string>();

const RaffleList = (
  props: Props & RouteComponentProps & StyledComponentProps
) => {
  const [creating, setCreating] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const classes = useStyles();

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
    <div className={classes.toolbar}>
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
    </div>
  );

  const headings = [<TableCell>Raffle</TableCell>];

  return (
    <Paper>
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
      {(props.raffles?.size ?? 0) === 0 && (
        <div className={classes.emptyText}>
          Use the plus button to create your first raffle.
        </div>
      )}
    </Paper>
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
