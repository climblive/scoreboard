import { Divider, TableCell, Typography } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import React from "react";
import { connect } from "react-redux";
import { Organizer } from "src/model/organizer";
import { getSelectedOrganizer } from "src/selectors/selector";
import { selectOrganizer } from "../../actions/asyncActions";
import { StoreState } from "../../model/storeState";
import { ProgressButton } from "../ProgressButton";
import ResponsiveTableRow from "../ResponsiveTableRow";
import OrganizerEdit from "./OrganizerEdit";

interface Props {
  isSelectedOrganizer: boolean;
  organizer?: Organizer;
  breakpoints?: Map<number, string>;
  selectOrganizer?: (organizerId: number) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    collapsableBody: {
      minWidth: 296,
      maxWidth: 600,
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      flexBasis: 0,
    },
    divider: {
      margin: theme.spacing(1, 0),
    },
    buttons: {
      margin: theme.spacing(2, 0),
    },
  })
);

const OrganizerView = (props: Props) => {
  const classes = useStyles();

  const switchOrganizer = () => {
    props.selectOrganizer?.(props.organizer?.id!);
  };

  const cells = [
    <TableCell component="th" scope="row">
      {props.organizer?.name}
      {props.isSelectedOrganizer && (
        <Chip
          style={{ marginLeft: "5px" }}
          label="Selected"
          color="primary"
          size="small"
        />
      )}
    </TableCell>,
    <TableCell>{props.organizer?.homepage}</TableCell>,
  ];

  return (
    <ResponsiveTableRow cells={cells} breakpoints={props.breakpoints}>
      <div className={classes.collapsableBody}>
        <Typography color="textSecondary" display="block" variant="caption">
          Info
        </Typography>
        <OrganizerEdit organizer={props.organizer} removable editable />

        <Divider className={classes.divider} />

        <Typography color="textSecondary" display="block" variant="caption">
          Options
        </Typography>

        <div className={classes.buttons}>
          <ProgressButton
            color="secondary"
            variant="contained"
            onClick={switchOrganizer}
            startIcon={<SyncAltIcon />}
            disabled={props.isSelectedOrganizer}
          >
            Switch
          </ProgressButton>
        </div>
      </div>
    </ResponsiveTableRow>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    isSelectedOrganizer:
      props.organizer?.id === getSelectedOrganizer(state)?.id,
  };
}

const mapDispatchToProps = {
  selectOrganizer,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganizerView);
