import React from "react";
import { Paper, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

interface Props {
  title: string;
  score: number;
  placement: number;
}

const ordinal = (placement: number) => {
  if (placement == 1) {
    return "st";
  } else if (placement == 2) {
    return "nd";
  } else if (placement == 3) {
    return "rd";
  } else {
    return "th";
  }
};

const ContenderScoring = (props: Props) => {
  const theme = useTheme();

  return (
    <Paper style={{ padding: theme.spacing(1) }}>
      <Typography color="textSecondary" display="block" variant="caption">
        {props.title}
      </Typography>
      <Typography variant="h5">{props.score}</Typography>
      <Typography color="textSecondary" display="block" variant="caption">
        Placement
      </Typography>
      <Typography variant="h6">
        {props.placement}
        {ordinal(props.placement)}
      </Typography>
    </Paper>
  );
};

export default ContenderScoring;
