import { Divider, Paper, Typography } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import Alert from "@material-ui/lab/Alert";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Organizer } from "src/model/organizer";
import { getSelectedOrganizer } from "src/selectors/selector";
import { selectOrganizer } from "../../actions/asyncActions";
import { StoreState } from "../../model/storeState";
import { User } from "../../model/user";
import { Api } from "../../utils/Api";
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
      margin: theme.spacing(2, 0),
    },
    buttons: {
      margin: theme.spacing(2, 0),
    },
    members: {
      margin: theme.spacing(2, 0),
    },
  })
);

const OrganizerView = (props: Props) => {
  const [users, setUsers] = useState<User[]>([]);

  const classes = useStyles();

  useEffect(() => {
    if (props.organizer?.id != null) {
      Api.getUsersForOrganizer(props.organizer?.id).then((users) =>
        setUsers(users)
      );
    }
  }, [props.organizer]);

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

          <Divider className={classes.divider} />

          <Typography color="textSecondary" display="block" variant="caption">
            Members
          </Typography>

          <div className={classes.members}>
            {users.length === 0 ? (
              <Alert severity="warning">User list is hidden</Alert>
            ) : (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        User
                      </TableCell>
                      <TableCell>Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user: User) => {
                      return (
                        <TableRow key={user.id}>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.name}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
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
