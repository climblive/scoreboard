import React, { useState } from "react";
import { Series } from "src/model/series";
import SeriesView from "./SeriesView";
import SeriesEdit from "./SeriesEdit";

interface Props {
  series?: Series;
}

const SeriesViewAndEdit = (props: Props) => {
  let [editing, setEditing] = useState<boolean>(false);

  return editing ? (
    <SeriesEdit series={props.series} onDone={() => setEditing(false)} />
  ) : (
    <SeriesView series={props.series} onClickEdit={() => setEditing(true)} />
  );
};

export default SeriesViewAndEdit;
