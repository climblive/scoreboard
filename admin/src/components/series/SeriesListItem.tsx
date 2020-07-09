import React, { useState } from "react";
import { Series } from "src/model/series";
import SeriesView from "./SeriesView";
import SeriesEdit from "./SeriesEdit";

interface Props {
  series?: Series;
  onCreateDone?: () => void;
}

const SeriesListItem = (props: Props) => {
  let [editing, setEditing] = useState<boolean>(
    props.onCreateDone != undefined
  );

  return editing ? (
    <SeriesEdit
      series={props.series}
      onDone={() => {
        setEditing(false);
        props.onCreateDone?.();
      }}
    />
  ) : (
    <SeriesView series={props.series} onClickEdit={() => setEditing(true)} />
  );
};

export default SeriesListItem;
