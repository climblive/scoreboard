import * as React from "react";
import "./ScoreboardListComp.css";
import { CompClass } from "../model/compClass";

export interface ScoreboardClassHeaderCompProps {
  compClass: CompClass;
  numberOfContenders?: number;
}

export function ScoreboardClassHeaderComp({
  compClass,
  numberOfContenders,
}: ScoreboardClassHeaderCompProps) {
  return (
    <div className="compClassHeader" style={{ color: compClass.color }}>
      <div
        className={
          "compClass-" + compClass.scoreboardIndex + " showLarge compClass"
        }
      >
        {compClass.name} {numberOfContenders ? `(${numberOfContenders})` : null}
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
