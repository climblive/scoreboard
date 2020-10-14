import { Divider, Grid, Paper, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { StoreState } from "../model/storeState";

interface Props {
  buttons?: JSX.Element[];
  children?: React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttons: {
      "& > *": {
        margin: theme.spacing(0.5),
      },
    },
    toolbar: {},
    divider: {
      margin: theme.spacing(1, 0, 2, 0),
    },
  })
);

const ContentLayout = (props: Props & PropsFromRedux) => {
  const classes = useStyles();

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        className={classes.toolbar}
      >
        <Grid item>
          <Typography variant="h6" noWrap>
            {props.title}
          </Typography>
        </Grid>
        <Grid item>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            {props.buttons?.map((button, index) => (
              <Grid key={index} item className={classes.buttons}>
                {button}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Paper>{props.children}</Paper>
    </>
  );
};

const mapStateToProps = (state: StoreState, props: Props) => ({
  title: state.title,
});

const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ContentLayout);
