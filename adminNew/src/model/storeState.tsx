import { ContenderData } from './contenderData';
import { Contest } from './contest';
import {Problem} from "./problem";
import {CompClass} from "./compClass";
import {Color} from "./color";
import {Organizer} from "./organizer";
import {CompLocation} from "./compLocation";

export interface StoreState {
   contests: Contest[],
   title: string,

   loggingIn: boolean,
   loggedInUser?: string

   contest: Contest;

   problems: Problem[];
   editProblem?: Problem;

   compClasses: CompClass[];
   editCompClass?: CompClass;

   contenders: ContenderData[];

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