import React, { ReactElement } from "react";
import { useTheme } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

interface Props {
  color: string;
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
      marginRight: theme.spacing(1),
    },
  })
);

function ColorSquare(props: Props): ReactElement {
  const classes = useStyles(props);
  const theme = useTheme();

  return <div className={classes.box}></div>;
}

export default ColorSquare;
