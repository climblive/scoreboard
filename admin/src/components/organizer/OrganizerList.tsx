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
import { setTitle } from "../../actions/actions";
import { reloadOrganizers } from "../../actions/asyncActions";
import { Organizer } from "../../model/organizer";
import { StoreState } from "../../model/storeState";
import ContentLayout from "../ContentLayout";
import { ProgressButton } from "../ProgressButton";
import ResponsiveTableHead from "../ResponsiveTableHead";
import OrganizerEdit from "./OrganizerEdit";
import OrganizerView from "./OrganizerView";

interface Props {
  organizers?: OrderedMap<number, Organizer>;

  loadOrganizers?: () => Promise<void>;
  setTitle?: (title: string) => void;
}

const breakpoints = new Map<number, string>().set(1, "smDown");

const OrganizerList = (props: Props) => {
  React.useEffect(() => {
    props.setTitle?.("Organizers");
  }, [props.setTitle]);

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const theme = useTheme();

  const onCreateDone = () => {
    setShowCreate(false);
  };

  const refreshOrganizers = () => {
    setRefreshing(true);
    props.loadOrganizers?.().finally(() => setRefreshing(false));
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
      onClick={refreshOrganizers}
      startIcon={<RefreshIcon />}
      loading={refreshing}
    >
      Refresh
    </ProgressButton>,
  ];

  const headings = [
    <TableCell>Name</TableCell>,
    <TableCell>Homepage</TableCell>,
  ];

  return (
    <ContentLayout buttons={buttons}>
      <Table>
        <ResponsiveTableHead cells={headings} breakpoints={breakpoints} />
        <TableBody>
          {showCreate && (
            <TableRow selected>
              <TableCell padding="none" colSpan={3}>
                <div style={{ padding: theme.spacing(0, 2) }}>
                  <OrganizerEdit
                    onDone={onCreateDone}
                    editable
                    cancellable
                    organizer={{ name: "" }}
                  />
                </div>
              </TableCell>
            </TableRow>
          )}

          {props.organizers?.toArray()?.map((organizer: Organizer) => (
            <OrganizerView
              key={organizer.id!}
              organizer={organizer}
              breakpoints={breakpoints}
            />
          ))}
        </TableBody>
      </Table>
    </ContentLayout>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    organizers: state.organizers,
  };
}

const mapDispatchToProps = {
  loadOrganizers: reloadOrganizers,
  setTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganizerList);
