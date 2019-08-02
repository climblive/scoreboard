import { ContenderData } from './contenderData';
import { Contest } from './contest';
import {Problem} from "./problem";
import {CompClass} from "./compClass";
import {Color} from "./color";
import {Organizer} from "./organizer";
import {CompLocation} from "./compLocation";
import {Serie} from "./serie";
import {User} from "./user";

export interface StoreState {
   title: string,

   loggingIn: boolean,
   loggedInUser?: User

   contests?: Contest[],
   contest?: Contest;

   problems?: Problem[];
   editProblem?: Problem;
   problemIdBeingUpdated?: number;

   compClasses?: CompClass[];
   editCompClass?: CompClass;

   contenders?: ContenderData[];

   colors?: Color[],
   editColor?: Color;

   series?: Serie[],
   editSerie?: Serie;

   locations?: CompLocation[],

   organizers?: Organizer[],
   organizer?: Organizer

   errorMessage?: string;
}