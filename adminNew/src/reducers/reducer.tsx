import {StoreState} from '../model/storeState';
import * as scoreboardActions from '../actions/actions';
import {ActionType, getType} from 'typesafe-actions';
import {Color} from "../model/color";
import {Problem} from "../model/problem";
import {SortBy} from "../constants/constants";
import {ContenderData} from "../model/contenderData";
import {CompLocation} from "../model/compLocation";
import {Organizer} from "../model/organizer";

export type ScoreboardActions = ActionType<typeof scoreboardActions>;

function getSortedProblems(problems: Problem[], sortBy:SortBy): Problem[] {
   let newProblems: Problem[] = [...problems];
   if (sortBy === SortBy.BY_POINTS) {
      newProblems = newProblems.sort((a, b) => a.points - b.points);
   } else {
      newProblems = newProblems.sort((a, b) => a.id - b.id);
   }
   return newProblems;
}

export const reducer = (state: StoreState, action: ScoreboardActions) => {
   switch (action.type) {
      case getType(scoreboardActions.receiveContests):
         return { ...state, contests: action.payload };

      case getType(scoreboardActions.clearErrorMessage):
         return { ...state, errorMessage: undefined};

      case getType(scoreboardActions.setErrorMessage):
         return { ...state, errorMessage: action.payload};

      case getType(scoreboardActions.setTitle):
         return { ...state, title: action.payload};


      case getType(scoreboardActions.startProblemUpdate):
         return { ...state, problemIdBeingUpdated: action.payload.id };

      case getType(scoreboardActions.setProblemStateFailed):
         return { ...state, problemIdBeingUpdated: undefined, errorMessage: action.payload};


      case getType(scoreboardActions.sortProblems):
         let newProblems2: Problem[] = getSortedProblems(state.problems, action.payload);
         return { ...state, problems: newProblems2, problemsSortedBy: action.payload };

      case getType(scoreboardActions.receiveContenderData):
         let contenderData:ContenderData = action.payload;
         if(contenderData.compClassId == null) {
            contenderData.compClassId = undefined;
         }
         if(contenderData.name == null) {
            contenderData.name = undefined;
         }
         return { ...state, contenderData: contenderData, contenderNotFound: false};

      case getType(scoreboardActions.receiveContenderNotFound):
         return { ...state, contenderData: undefined, contenderNotFound: true};

      case getType(scoreboardActions.receiveScoreboardData):
         return { ...state, scoreboardData: action.payload };

      case getType(scoreboardActions.receiveContest):
         return { ...state, contest: action.payload };

      case getType(scoreboardActions.receiveCompClasses):
         return { ...state, compClasses: action.payload.sort((a, b) => a.id - b.id) };

      case getType(scoreboardActions.receiveProblems):
         const sortedBy = state.problemsSortedBy || SortBy.BY_NUMBER;
         const problems = getSortedProblems(action.payload, sortedBy);
         return { ...state, problems: problems, problemsSortedBy: sortedBy};

      case getType(scoreboardActions.receiveColors):
         const colorMap = new Map<number, Color>();
         action.payload.forEach(color => colorMap.set(color.id, color));
         return { ...state, colors: action.payload, colorMap: colorMap };

      case getType(scoreboardActions.receiveLocations):
         const locationMap = new Map<number, CompLocation>();
         action.payload.forEach(location => locationMap.set(location.id, location));
         return { ...state, locations: action.payload, locationMap: locationMap };

      case getType(scoreboardActions.receiveOrganizers):
         const organizerMap = new Map<number, Organizer>();
         action.payload.forEach(organizer => organizerMap.set(organizer.id, organizer));
         return { ...state, organizers: action.payload, organizerMap: organizerMap };



      case getType(scoreboardActions.receiveTicks):
         return { ...state, ticks: action.payload };

      case getType(scoreboardActions.createTick):
         let newTicks1 = [...state.ticks, action.payload];
         return { ...state, ticks: newTicks1, problemIdBeingUpdated: undefined};

      case getType(scoreboardActions.updateTick):
         let newTicks2 = state.ticks.filter(tick => tick.id !== action.payload.id);
         newTicks2.push(action.payload);
         return { ...state, ticks: newTicks2, problemIdBeingUpdated: undefined};

      case getType(scoreboardActions.deleteTick):
         let newTicks3 = state.ticks.filter(tick => tick.id !== action.payload.id);
         return { ...state, ticks: newTicks3, problemIdBeingUpdated: undefined};

      default:
         return state;
   }
};