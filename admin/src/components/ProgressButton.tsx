import React from "react";
import { CircularProgress } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button, { ButtonProps } from "@material-ui/core/Button";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      position: "relative",
      display: "inline-block",
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
  const { loading, ...rest } = props;

  return (
    <div className={classes.wrapper}>
      <Button {...rest} disabled={props.disabled || props.loading}>
        {props.children}
      </Button>
      {props.loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
};
