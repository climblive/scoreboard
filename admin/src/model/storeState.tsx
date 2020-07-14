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
import { Raffle } from "./raffle";

export interface StoreState {
  title: string;

  loggingIn: boolean;
  loggedInUser?: User;

  contests?: Contest[];

  problems?: Problem[];

  compClasses?: CompClass[];

  contenders?: ContenderData[];

  raffles?: Raffle[];

  colors?: Color[];

  series?: Series[];

  locations?: CompLocation[];

  organizers?: Organizer[];
  selectedOrganizer?: Organizer;

  ticks?: Tick[];

  errorMessage?: string;
}
