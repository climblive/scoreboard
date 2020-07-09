import React, { useState } from "react";
import { Color } from "src/model/color";
import ColorView from "./ColorView";
import ColorEdit from "./ColorEdit";

interface Props {
  color?: Color;
  onCreateDone?: () => void;
}

const ColorListItem = (props: Props) => {
  let [editing, setEditing] = useState<boolean>(
    props.onCreateDone != undefined
  );

  return editing ? (
    <ColorEdit
      color={props.color}
      onDone={() => {
        setEditing(false);
        props.onCreateDone?.();
      }}
    />
  ) : (
    <ColorView color={props.color} onBeginEdit={() => setEditing(true)} />
  );
};

export default ColorListItem;
