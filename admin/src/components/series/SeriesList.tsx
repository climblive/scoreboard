import { Button, TableCell } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import { OrderedMap } from "immutable";
import React, { useState } from "react";
import { connect } from "react-redux";
import { getSelectedOrganizer } from "src/selectors/selector";
import { setTitle } from "../../actions/actions";
import { reloadSeries } from "../../actions/asyncActions";
import { Organizer } from "../../model/organizer";
import { Series } from "../../model/series";
import { StoreState } from "../../model/storeState";
import ContentLayout from "../ContentLayout";
import { ProgressButton } from "../ProgressButton";
import ResponsiveTableHead from "../ResponsiveTableHead";
import SeriesEdit from "./SeriesEdit";
import SeriesView from "./SeriesView";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

interface Props {
  series?: OrderedMap<number, Series>;
  selectedOrganizer?: Organizer;

  loadSeries?: () => Promise<void>;
  setTitle?: (title: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    emptyText: { padding: theme.spacing(2) },
  })
);

const breakpoints = new Map<number, string>();

const SeriesList = (props: Props) => {
  React.useEffect(() => {
    props.setTitle?.("Series");
  }, []);

  React.useEffect(() => {
    if (props.series == undefined) {
      refreshSeries();
    }
  }, [props.series]);

  const classes = useStyles();

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const theme = useTheme();

  const onCreateDone = () => {
    setShowCreate(false);
  };

  const refreshSeries = () => {
    setRefreshing(true);
    props.loadSeries?.().finally(() => setRefreshing(false));
  };

  const buttons = [
    <Button
      variant="contained"
      color="secondary"
      size="small"
      disabled={showCreate}
      onClick={() => setShowCreate(true)}
      startIcon={<AddIcon />}
    >
      Add
    </Button>,
    <ProgressButton
      variant="contained"
      color="secondary"
      size="small"
      onClick={refreshSeries}
      startIcon={<RefreshIcon />}
      loading={refreshing}
    >
      Refresh
    </ProgressButton>,
  ];

  const headings = [<TableCell>Name</TableCell>];

  return (
    <ContentLayout buttons={buttons}>
      <Table>
        <ResponsiveTableHead cells={headings} breakpoints={breakpoints} />
        <TableBody>
          {showCreate && (
            <TableRow selected>
              <TableCell padding="none" colSpan={3}>
                <div style={{ padding: theme.spacing(0, 2) }}>
                  <SeriesEdit
                    onDone={onCreateDone}
                    editable
                    cancellable
                    series={{
                      name: "",
                      organizerId: props.selectedOrganizer?.id,
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          )}

          {props.series?.toArray()?.map((series: Series) => (
            <SeriesView
              key={series.id!}
              series={series}
              breakpoints={breakpoints}
            />
          ))}
        </TableBody>
      </Table>
      {!showCreate && props.series?.size === 0 && (
        <div className={classes.emptyText}>
          Use the plus button to create your first series.
        </div>
      )}
    </ContentLayout>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    series: state.series,
    selectedOrganizer: getSelectedOrganizer(state),
  };
}

const mapDispatchToProps = {
  loadSeries: reloadSeries,
  setTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(SeriesList);
