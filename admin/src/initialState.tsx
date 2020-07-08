import { StoreState } from "./model/storeState";
import { SortBy } from "./constants/sortBy";

const initialStore: StoreState = {
  title: "",
  loggingIn: false,
  creatingPdf: false,
  contenderSortBy: SortBy.BY_NAME,
};

export default initialStore;
