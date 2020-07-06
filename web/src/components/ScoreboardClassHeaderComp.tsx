import * as React from "react";
import "./ScoreboardListComp.css";
import { CompClass } from "../model/compClass";

export interface ScoreboardClassHeaderCompProps {
  compClass: CompClass;
}

export function ScoreboardClassHeaderComp({
  compClass,
}: ScoreboardClassHeaderCompProps) {
  return (
    <div className="compClassHeader">
      <div
        className={
          "compClass-" + compClass.scoreboardIndex + " showLarge compClass"
        }
      >
        {compClass.name}
      </div>
      {!compClass.inProgress && (
        <div className="status">{compClass.statusString}</div>
      )}
      <div className={compClass.inProgress ? "time active" : "time"}>
        {compClass.time}
      </div>
    </div>
  );
}
