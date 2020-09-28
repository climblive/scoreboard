import { Button, TableCell } from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import { OrderedMap } from "immutable";
import React, { useState } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Organizer } from "src/model/organizer";
import { getSelectedOrganizer } from "src/selectors/selector";
import { setTitle } from "../../actions/actions";
import { reloadColors } from "../../actions/asyncActions";
import { Color } from "../../model/color";
import { StoreState } from "../../model/storeState";
import ContentLayout from "../ContentLayout";
import { ProgressButton } from "../ProgressButton";
import ResponsiveTableHead from "../ResponsiveTableHead";
import ColorEdit from "./ColorEdit";
import ColorView from "./ColorView";

interface Props {
  colors?: OrderedMap<number, Color>;
  selectedOrganizer?: Organizer;

  loadColors?: () => Promise<void>;
  setTitle?: (title: string) => void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const breakpoints = new Map<number, string>().set(3, "smDown");

const ColorList = (props: Props & RouteComponentProps) => {
  React.useEffect(() => {
    props.setTitle?.("Colors");
  }, []);

  React.useEffect(() => {
    if (props.colors == undefined) {
      refreshColors();
    }
  }, [props.colors]);

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const theme = useTheme();

  const refreshColors = () => {
    setRefreshing(true);
    props.loadColors?.().finally(() => setRefreshing(false));
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
            <TableRow selected>
              <TableCell padding="none" colSpan={5}>
                <div style={{ padding: theme.spacing(0, 2) }}>
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
                </div>
              </TableCell>
            </TableRow>
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

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    colors: state.colors,
    selectedOrganizer: getSelectedOrganizer(state),
  };
}

const mapDispatchToProps = {
  loadColors: reloadColors,
  setTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ColorList));
