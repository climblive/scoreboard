import { ContenderData } from './contenderData';
import { ScoreboardContenderList } from './scoreboardContenderList';
import { Contest } from './contest';
import {SortBy} from "../constants/constants";
import {Problem} from "./problem";
import {CompClass} from "./compClass";
import {Tick} from "./tick";
import {Color} from "./color";
import {Organizer} from "./organizer";
import {CompLocation} from "./compLocation";

export interface StoreState {
   contests: Contest[],
   title: string,

   contenderData?: ContenderData;
   contenderNotFound: boolean;
   problemsSortedBy: SortBy;
   contest: Contest;
   problems: Problem[];
   compClasses: CompClass[];
   ticks: Tick[];
   colors: Color[],
   colorMap: Map<number, Color>,
   locations: CompLocation[],
   locationMap: Map<number, CompLocation>,
   organizers: Organizer[],
   organizerMap: Map<number, Organizer>,
   pagingCounter: number;
   problemIdBeingUpdated?: number;
   errorMessage?: string;
}