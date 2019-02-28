import * as React from 'react';
import './ScoreboardListComp.css';
import { ScoreboardListItem } from '../model/scoreboardListItem';
import { CompClass } from '../model/compClass';
import {RefObject} from "react";

export interface ScoreboardListCompProps {
   compClass: CompClass
   totalList?: ScoreboardListItem[];
   isPaging: boolean;
   pagingCounter: number;
}

type State = {
   nToShow: number;
}

export class ScoreboardListComp extends React.Component<ScoreboardListCompProps, State> {

   private readonly containerRef: RefObject<HTMLDivElement>;
   public readonly state: State = {
      nToShow: 1000
   }

   constructor(props: ScoreboardListCompProps) {
      super(props);
      this.containerRef = React.createRef();
   }

   private updateDimensions = () => {
      if(this.containerRef && this.containerRef.current) {
         let nToShow = Math.floor(this.containerRef.current.clientHeight / 16);
         if(nToShow !== this.state.nToShow) {
            this.state.nToShow = nToShow;
            this.setState(this.state);
         }
      }
   }

   componentDidMount() {
      if(this.props.isPaging) {
         this.updateDimensions();
         window.addEventListener("resize", this.updateDimensions);
      }
   }

   componentWillUnmount() {
      if(this.props.isPaging) {
         window.removeEventListener("resize", this.updateDimensions);
      }
   }

   render() {
      let nPages = 0;
      let currentPage = 0;
      let firstItemToShow = 0;
      if(this.props.isPaging) {
         this.updateDimensions();
         let nItems = this.props.totalList!.length;
         nPages = Math.min(20, Math.ceil(nItems / this.state.nToShow));
         currentPage = (Math.floor(this.props.pagingCounter / 7)) % nPages;
         firstItemToShow = currentPage * this.state.nToShow
      }

      console.log("render " + this.props.totalList!.length + " state " + this.props.pagingCounter, this.state);
      let listClass = this.props.isPaging ? "scoreboardListContenders scoreboardListContendersPaging" : "scoreboardListContenders";
      let list = this.props.totalList!.slice(firstItemToShow, firstItemToShow + this.state.nToShow).map(contender =>
         <div key={contender.contenderId} className="contenderRow">
            <div className="position">{contender.position}</div>
            <div className="name">{contender.contenderName}</div>
            <div className="score">{contender.score}</div>
         </div>
      )

      let pagerItems = [];
      for (let i = 0; i < nPages; i++) {
         let className = i == currentPage ? "paging current" : "paging";
         pagerItems.push(<div className={className}></div>)
      }

      return (
         <div className="scoreboardList">
            <div className={listClass} ref={this.containerRef}>
               {list}
            </div>
            <div className="scoreboardListPaging">{pagerItems}</div>
         </div>
      );
   }
}
