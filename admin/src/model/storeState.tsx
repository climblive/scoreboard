import { Map, OrderedMap } from "immutable";
import { Color } from "./color";
import { CompClass } from "./compClass";
import { CompLocation } from "./compLocation";
import { ContenderData } from "./contenderData";
import { Contest } from "./contest";
import { Organizer } from "./organizer";
import { Problem } from "./problem";
import { Raffle } from "./raffle";
import { RaffleWinner } from "./raffleWinner";
import { Series } from "./series";
import { Tick } from "./tick";
import { User } from "./user";

export interface StoreState {
  title: string;

  loggingIn: boolean;
  loggedInUser?: User;

  contests?: OrderedMap<number, Contest>;

  compClassesByContest: Map<number, OrderedMap<number, CompClass>>;
  rafflesByContest: Map<number, OrderedMap<number, Raffle>>;
  contendersByContest: Map<number, OrderedMap<number, ContenderData>>;
  problemsByContest: Map<number, OrderedMap<number, Problem>>;
  ticksByContest: Map<number, OrderedMap<number, Tick>>;

  raffleWinnersByRaffle: Map<number, OrderedMap<number, RaffleWinner>>;

  colors?: OrderedMap<number, Color>;

  series?: OrderedMap<number, Series>;

  locations?: OrderedMap<number, CompLocation>;

  organizers?: OrderedMap<number, Organizer>;
  selectedOrganizerId?: number;

  errorMessage?: string;
}
