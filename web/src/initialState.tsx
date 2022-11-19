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
    finalEnabled: false,
  },
  problems: [],
  compClasses: [],
  ticks: [],
  pagingCounter: 0,
  scoreboardData: [],
  currentCompClassId: 0,
  pushItemsQueue: [],
};

export default initialState;
