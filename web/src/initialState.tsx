import { SortBy } from "./constants/constants";
import { StoreState } from "./model/storeState";

const initialState: StoreState = {
  contenderNotFound: false,
  problemsSortedBy: SortBy.BY_NUMBER,
  contest: {
    id: 0,
    name: "",
    rules: "",
    qualifyingProblems: 0,
    finalists: 0,
    gracePeriod: 0,
  },
  problems: [],
  compClasses: [],
  ticks: [],
  colors: new Map(),
  pagingCounter: 0,
  scoreboardData: [],
  currentCompClassId: 0,
};

export default initialState;
