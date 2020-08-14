import React from "react";
import { Typography, Divider, Paper, Grid } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { StoreState } from "../model/storeState";

interface Props {
  title?: string;
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
    toolbar: {
      marginBottom: theme.spacing(2),
    },
  })
);

const ContentLayout = (props: Props) => {
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
      <Divider />
      <Paper style={{ marginTop: "1rem" }}>{props.children}</Paper>
    </>
  );
};

export function mapStateToProps(state: StoreState, props: any): Props {
  return {
    title: state.title,
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ContentLayout);
