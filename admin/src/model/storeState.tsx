import { Contest } from "./contest";
import { Color } from "./color";
import { Organizer } from "./organizer";
import { CompLocation } from "./compLocation";
import { Series } from "./series";
import { User } from "./user";
import { OrderedMap, Map } from "immutable";
import { ContenderData } from "./contenderData";
import { Problem } from "./problem";
import { CompClass } from "./compClass";
import { Tick } from "./tick";
import { Raffle } from "./raffle";
import { RaffleWinner } from "./raffleWinner";

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
