import { Map, OrderedMap } from "immutable";
import { CompClass } from "./model/compClass";
import { ContenderData } from "./model/contenderData";
import { Problem } from "./model/problem";
import { Raffle } from "./model/raffle";
import { RaffleWinner } from "./model/raffleWinner";
import { StoreState } from "./model/storeState";
import { Tick } from "./model/tick";

const initialStore: StoreState = {
  title: "",
  loggingIn: false,
  compClassesByContest: Map<number, OrderedMap<number, CompClass>>(),
  rafflesByContest: Map<number, OrderedMap<number, Raffle>>(),
  contendersByContest: Map<number, OrderedMap<number, ContenderData>>(),
  problemsByContest: Map<number, OrderedMap<number, Problem>>(),
  ticksByContest: Map<number, OrderedMap<number, Tick>>(),
  raffleWinnersByRaffle: Map<number, OrderedMap<number, RaffleWinner>>(),
};

export default initialStore;
