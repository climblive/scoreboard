import { CircularProgress } from "@material-ui/core";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import React, { memo } from "react";

interface Props {
  loading?: boolean;
}

const ProgressIconButton = memo((props: Props & IconButtonProps) => {
  const { loading, ...rest } = props;

  return (
    <IconButton {...rest} disabled={props.disabled || props.loading}>
      {props.loading ? <CircularProgress size={24} /> : props.children}
    </IconButton>
  );
});

export default ProgressIconButton;
