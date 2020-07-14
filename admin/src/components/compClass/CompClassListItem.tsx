import React, { useState } from "react";
import { CompClass } from "src/model/compClass";
import CompClassView from "./CompClassView";
import CompClassEdit from "./CompClassEdit";

interface Props {
  compClass?: CompClass;
  onCreateDone?: () => void;
}

const CompClassListItem = (props: Props) => {
  let [editing, setEditing] = useState<boolean>(
    props.onCreateDone != undefined
  );

  return editing ? (
    <CompClassEdit
      compClass={props.compClass}
      onDone={() => {
        setEditing(false);
        props.onCreateDone?.();
      }}
    />
  ) : (
    <CompClassView
      compClass={props.compClass}
      onBeginEdit={() => setEditing(true)}
    />
  );
};

export default CompClassListItem;
