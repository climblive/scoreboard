import { ContenderData } from './contenderData';
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

   loggingIn: boolean,
   loggedInUser?: string

   contenderData?: ContenderData;
   contenderNotFound: boolean;
   problemsSortedBy: SortBy;
   contest: Contest;

   problems: Problem[];
   editProblem?: Problem;

   compClasses: CompClass[];
   editCompClass?: CompClass;

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