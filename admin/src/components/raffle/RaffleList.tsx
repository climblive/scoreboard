import { Paper, TableCell } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import React, { useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { loadRaffles, saveRaffle } from "../../actions/asyncActions";
import { Raffle } from "../../model/raffle";
import { StoreState } from "../../model/storeState";
import ProgressIconButton from "../ProgressIconButton";
import ResponsiveTableHead from "../ResponsiveTableHead";
import RaffleView from "./RaffleView";

interface Props {
  contestId: number;
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

const RaffleList = (props: Props & PropsFromRedux) => {
  const [creating, setCreating] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const classes = useStyles();

  const createRaffle = () => {
    setCreating(true);
    props
      .saveRaffle?.({ contestId: props.contestId, active: false })
      .finally(() => setCreating(false));
  };

  const refreshRaffles = () => {
    setRefreshing(true);
    props.loadRaffles(props.contestId).finally(() => setRefreshing(false));
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

const mapStateToProps = (state: StoreState, props: Props) => ({
  raffles: state.rafflesByContest.get(props.contestId),
});

const mapDispatchToProps = {
  loadRaffles,
  saveRaffle,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(RaffleList);
