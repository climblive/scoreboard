import React, { useState } from "react";
import {
  StyledComponentProps,
  TableCell,
  Theme,
  Button,
} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { StoreState } from "../../model/storeState";
import { connect } from "react-redux";
import { reloadColors } from "../../actions/asyncActions";
import { setTitle } from "../../actions/actions";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import { Color } from "../../model/color";
import ColorListItem from "./ColorListItem";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Organizer } from "src/model/organizer";
import { getSelectedOrganizer } from "src/selectors/selector";
import { OrderedMap } from "immutable";
import ContentLayout from "../ContentLayout";
import { ProgressButton } from "../ProgressButton";

interface Props {
  colors?: OrderedMap<number, Color>;
  selectedOrganizer?: Organizer;

  loadColors?: () => Promise<void>;
  setTitle?: (title: string) => void;
}

const ColorList = (
  props: Props & RouteComponentProps & StyledComponentProps
) => {
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

  const onCreateDone = () => {
    setShowCreate(false);
  };

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

  return (
    <ContentLayout buttons={buttons}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Primary</TableCell>
            <TableCell>Secondary</TableCell>
            <TableCell align="right">Shared</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {showCreate && (
            <ColorListItem
              onCreateDone={onCreateDone}
              color={{
                organizerId: props.selectedOrganizer?.id!,
                name: "",
                rgbPrimary: "#ffffff",
                rgbSecondary: "#ffffff",
                shared: false,
              }}
            />
          )}
          {props.colors?.toArray()?.map((color: Color) => (
            <ColorListItem key={color.id!} color={color} />
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
