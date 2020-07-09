import React, { useState } from "react";
import { Organizer } from "src/model/organizer";
import OrganizerView from "./OrganizerView";
import OrganizerEdit from "./OrganizerEdit";

interface Props {
  organizer?: Organizer;
  onCreateDone?: () => void;
}

const OrganizerListItem = (props: Props) => {
  let [editing, setEditing] = useState<boolean>(
    props.onCreateDone != undefined
  );

  return editing ? (
    <OrganizerEdit
      organizer={props.organizer}
      onDone={() => {
        setEditing(false);
        props.onCreateDone?.();
      }}
    />
  ) : (
    <OrganizerView
      organizer={props.organizer}
      onBeginEdit={() => setEditing(true)}
    />
  );
};

export default OrganizerListItem;
