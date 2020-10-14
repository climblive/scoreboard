import { Button, TableCell } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import React, { useCallback, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { getSelectedOrganizer } from "src/selectors/selector";
import { setTitle } from "../../actions/actions";
import { reloadColors } from "../../actions/asyncActions";
import { Color } from "../../model/color";
import { StoreState } from "../../model/storeState";
import ContentLayout from "../ContentLayout";
import { ProgressButton } from "../ProgressButton";
import ResponsiveTableHead from "../ResponsiveTableHead";
import ResponsiveTableSpanningRow from "../ResponsiveTableSpanningRow";
import ColorEdit from "./ColorEdit";
import ColorView from "./ColorView";

interface Props {}

const breakpoints = new Map<number, string>().set(3, "smDown");

const ColorList = (props: Props & PropsFromRedux & RouteComponentProps) => {
  React.useEffect(() => {
    props.setTitle("Colors");
  }, [props.setTitle]);

  const refreshColors = useCallback(() => {
    setRefreshing(true);
    props.loadColors().finally(() => setRefreshing(false));
  }, [props.loadColors]);

  React.useEffect(() => {
    if (props.colors === undefined) {
      refreshColors();
    }
  }, [props.colors, refreshColors]);

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

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
      onClick={refreshColors}
      startIcon={<RefreshIcon />}
      loading={refreshing}
    >
      Refresh
    </ProgressButton>,
  ];

  const headings = [
    <TableCell>Name</TableCell>,
    <TableCell>Primary</TableCell>,
    <TableCell>Secondary</TableCell>,
    <TableCell align="right">Shared</TableCell>,
  ];

  return (
    <ContentLayout buttons={buttons}>
      <Table>
        <ResponsiveTableHead cells={headings} breakpoints={breakpoints} />
        <TableBody>
          {showCreate && (
            <ResponsiveTableSpanningRow colSpan={5}>
              <ColorEdit
                onDone={() => setShowCreate(false)}
                editable
                cancellable
                color={{
                  organizerId: props.selectedOrganizer?.id!,
                  name: "",
                  rgbPrimary: "#ffffff",
                  rgbSecondary: undefined,
                  shared: false,
                }}
              />
            </ResponsiveTableSpanningRow>
          )}
          {props.colors?.toArray()?.map((color: Color) => (
            <ColorView
              key={color.id!}
              color={color}
              breakpoints={breakpoints}
            />
          ))}
        </TableBody>
      </Table>
    </ContentLayout>
  );
};

const mapStateToProps = (state: StoreState, props: Props) => ({
  colors: state.colors,
  selectedOrganizer: getSelectedOrganizer(state),
});

const mapDispatchToProps = {
  loadColors: reloadColors,
  setTitle,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(ColorList));
