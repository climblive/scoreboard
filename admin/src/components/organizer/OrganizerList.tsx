import { Button, TableCell } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { setTitle } from "../../actions/actions";
import { reloadOrganizers } from "../../actions/asyncActions";
import { Organizer } from "../../model/organizer";
import { StoreState } from "../../model/storeState";
import ContentLayout from "../ContentLayout";
import { ProgressButton } from "../ProgressButton";
import ResponsiveTableSpanningRow from "../ResponsiveTableSpanningRow";
import ResponsiveTableHead from "../ResponsiveTableHead";
import OrganizerEdit from "./OrganizerEdit";
import OrganizerView from "./OrganizerView";

interface Props {}

const breakpoints = new Map<number, string>().set(1, "smDown");

const OrganizerList = (props: Props & PropsFromRedux) => {
  const { setTitle } = props;

  React.useEffect(() => {
    setTitle("Organizers");
  }, [setTitle]);

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onCreateDone = () => {
    setShowCreate(false);
  };

  const refreshOrganizers = () => {
    setRefreshing(true);
    props.loadOrganizers().finally(() => setRefreshing(false));
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
            <ResponsiveTableSpanningRow colSpan={3}>
              <OrganizerEdit
                onDone={onCreateDone}
                cancellable
                organizer={{ name: "" }}
              />
            </ResponsiveTableSpanningRow>
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

const mapStateToProps = (state: StoreState, props: Props) => ({
  organizers: state.organizers,
});

const mapDispatchToProps = {
  loadOrganizers: reloadOrganizers,
  setTitle,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(OrganizerList);
