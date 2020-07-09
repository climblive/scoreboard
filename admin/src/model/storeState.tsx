import { ContenderData } from "./contenderData";
import { Contest } from "./contest";
import { Problem } from "./problem";
import { CompClass } from "./compClass";
import { Color } from "./color";
import { Organizer } from "./organizer";
import { CompLocation } from "./compLocation";
import { Series } from "./series";
import { User } from "./user";
import { Tick } from "./tick";
import { SortBy } from "../constants/sortBy";
import { Raffle } from "./raffle";

export interface StoreState {
  title: string;

  loggingIn: boolean;
  loggedInUser?: User;

  contests?: Contest[];
  contest?: Contest;
  creatingPdf: boolean;

  problems?: Problem[];
  editProblem?: Problem;
  problemIdBeingUpdated?: number;

  compClasses?: CompClass[];
  editCompClass?: CompClass;

  contenders?: ContenderData[];
  contenderSortBy: SortBy;
  contenderFilterCompClassId?: number;

  raffles?: Raffle[];

  colors?: Color[];
  editColor?: Color;

  series?: Series[];

  locations?: CompLocation[];
  editLocation?: CompLocation;

  organizers?: Organizer[];
  organizer?: Organizer;

  ticks?: Tick[];

  errorMessage?: string;
}
