import { Map, OrderedMap } from "immutable";
import { CompClass } from "./compClass";
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

  compClassesByContest: Map<number, OrderedMap<number, CompClass> | undefined>;
  rafflesByContest: Map<number, OrderedMap<number, Raffle> | undefined>;
  contendersByContest: Map<
    number,
    OrderedMap<number, ContenderData> | undefined
  >;
  problemsByContest: Map<number, OrderedMap<number, Problem> | undefined>;
  ticksByContest: Map<number, OrderedMap<number, Tick> | undefined>;

  raffleWinnersByRaffle: Map<number, OrderedMap<number, RaffleWinner>>;

  series?: OrderedMap<number, Series>;

  organizers?: OrderedMap<number, Organizer>;
  selectedOrganizerId?: number;

  errorMessage?: string;
}
