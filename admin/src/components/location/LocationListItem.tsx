import React, { useState } from "react";
import { CompLocation } from "src/model/compLocation";
import LocationView from "./LocationView";
import LocationEdit from "./LocationEdit";

interface Props {
  location?: CompLocation;
  onCreateDone?: () => void;
}

const LocationListItem = (props: Props) => {
  let [editing, setEditing] = useState<boolean>(
    props.onCreateDone != undefined
  );

  return editing ? (
    <LocationEdit
      location={props.location}
      onDone={() => {
        setEditing(false);
        props.onCreateDone?.();
      }}
    />
  ) : (
    <LocationView
      location={props.location}
      onBeginEdit={() => setEditing(true)}
    />
  );
};

export default LocationListItem;
