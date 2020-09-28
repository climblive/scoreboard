import * as React from "react";
import "./ScoreboardListComp.css";
import { ScoreboardListItem } from "../model/scoreboardListItem";
import { CompClass } from "../model/compClass";
import { RefObject } from "react";
import * as Chroma from "chroma-js";

export interface ScoreboardListCompProps {
  compClass: CompClass;
  totalList?: ScoreboardListItem[];
  isPaging: boolean;
  animationPropertyName: string;
  pagingCounter: number;
}

type State = {
  nToShow: number;
  marginBottom: number;
};

export class ScoreboardListComp extends React.Component<
  ScoreboardListCompProps,
  State
> {
  private readonly containerRef: RefObject<HTMLDivElement>;
  public readonly state: State = {
    nToShow: 1000,
    marginBottom: 0,
  };

  private readonly ITEM_HEIGHT = 18;

  constructor(props: ScoreboardListCompProps) {
    super(props);
    this.containerRef = React.createRef();
  }

  private updateDimensions = () => {
    if (this.containerRef && this.containerRef.current) {
      let height = this.containerRef.current.clientHeight - 10;
      let nToShow = Math.floor(height / this.ITEM_HEIGHT);
      let marginBottom = height - this.ITEM_HEIGHT * nToShow;
      if (
        nToShow !== this.state.nToShow ||
        marginBottom !== this.state.marginBottom
      ) {
        this.state.nToShow = nToShow;
        this.state.marginBottom = marginBottom;
        this.setState(this.state);
      }
    }
  };

  componentDidMount() {
    if (this.props.isPaging) {
      window.addEventListener("resize", this.updateDimensions);
    }
  }

  componentWillUnmount() {
    if (this.props.isPaging) {
      window.removeEventListener("resize", this.updateDimensions);
    }
  }

  componentDidUpdate() {
    if (this.props.isPaging) {
      this.updateDimensions();
    }
  }

  render() {
    let nPages = 0;
    let currentPage = 0;
    let containerTop = 0;
    let nItems = this.props.totalList!.length;
    let totalHeight = this.ITEM_HEIGHT * nItems;
    if (this.props.isPaging) {
      nPages = Math.min(20, Math.ceil(nItems / this.state.nToShow));
      currentPage = Math.floor(this.props.pagingCounter / 7) % nPages;
      containerTop = -this.ITEM_HEIGHT * currentPage * this.state.nToShow;
    }

    let listClass = this.props.isPaging
      ? "scoreboardListContenders scoreboardListContendersPaging"
      : "scoreboardListContenders";
    let list = this.props.totalList!.map((contender) => {
      let color = this.props.compClass.color;
      if (color === undefined) {
        color = "#ffffff";
      }

      let style: React.CSSProperties = {
        position: "absolute",
        top: contender.uiPosition! * this.ITEM_HEIGHT,
        transition: "top 1s ease 1s",
      };

      if (
        contender.uiPosition !== undefined &&
        contender.uiPosition >= 0 &&
        contender.uiPosition <= 6
      ) {
        style = {
          ...style,
          color: Chroma(color)
            .brighten(6 - contender.uiPosition)
            .hex(),
          fontWeight: 400 + (6 - contender.uiPosition) * 100,
        };
      } else {
        style = {
          ...style,
          color: color,
        };
      }

      if (contender.position === 1) {
        style = {
          ...style,
          backgroundColor: Chroma(color).darken(1).hex(),
          color: "#ffffff",
        };
      }

      return (
        <div
          key={contender.contenderId}
          className={
            "contenderRow" +
            (contender[this.props.animationPropertyName] ? " highlight" : "")
          }
          style={style}
        >
          <div className="position">{contender.position}</div>
          <div className="name">{contender.contenderName}</div>
          <div className="score">{contender.score}</div>
        </div>
      );
    });

    let pagerItems = [];
    for (let i = 0; i < nPages; i++) {
      let className = i == currentPage ? "paging current" : "paging";
      pagerItems.push(<div key={i} className={className}></div>);
    }

    return (
      <div
        className={"listRowIndex-" + " scoreboardList"}
        ref={this.containerRef}
      >
        <div
          className={
            listClass + " compClass-" + this.props.compClass.scoreboardIndex
          }
          style={{
            overflow: "hidden",
            marginBottom: this.state.marginBottom,
            transition: "minHeight 0.5s ease",
            minHeight: this.props.isPaging ? undefined : totalHeight,
          }}
        >
          <div
            style={{
              height: totalHeight,
              position: "relative",
              transform: "translateY(" + containerTop + "px)",
              transition: "top 1s ease 1s,transform 0.5s ease",
            }}
          >
            {list}
          </div>
        </div>
        <div className="scoreboardListPaging">{pagerItems}</div>
      </div>
    );
  }
}
