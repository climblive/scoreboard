import { CircularProgress } from "@material-ui/core";
import Button, { ButtonProps } from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { memo } from "react";

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
    button: {
      width: "100%",
    },
  })
);

interface Props {
  loading?: boolean;
}

export const ProgressButton = memo((props: Props & ButtonProps) => {
  const classes = useStyles();
  const { loading, ...rest } = props;

  return (
    <div className={classes.wrapper}>
      <Button
        {...rest}
        disabled={props.disabled || props.loading}
        className={classes.button}
      >
        {props.children}
      </Button>
      {props.loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
});
