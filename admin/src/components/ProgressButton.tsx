import React from "react";
import { Button, CircularProgress } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ButtonProps } from "@material-ui/core/Button";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      position: "relative",
    },
    buttonProgress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
  })
);

interface Props {
  loading?: boolean;
}

export const ProgressButton = (props: Props & ButtonProps) => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Button {...props} disabled={props.disabled || props.loading}>
        {props.children}
      </Button>
      {props.loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
};
