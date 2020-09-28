import { StyledComponentProps, useTheme } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { ReactElement } from "react";

interface Props {
  color: string;
  className?: string;
}

const useStyles = makeStyles<Theme, Props>((theme: Theme) =>
  createStyles({
    box: {
      width: 24,
      height: 24,
      borderRadius: 5,
      backgroundColor: ({ color }) => color,
      display: "inline-block",
      flexShrink: 0,
    },
  })
);

function ColorSquare(props: Props & StyledComponentProps): ReactElement {
  const classes = useStyles(props);
  const theme = useTheme();

  return <div className={`${classes.box} ${props.className}`}></div>;
}

export default ColorSquare;
