import {StoreState} from '../model/storeState';
import * as scoreboardActions from '../actions/actions';
import {ActionType, getType} from 'typesafe-actions';
import {Color} from "../model/color";
import {Problem} from "../model/problem";
import {SortBy} from "../constants/constants";
import {CompLocation} from "../model/compLocation";
import {Organizer} from "../model/organizer";
import {CompClass} from "../model/compClass";

export type ScoreboardActions = ActionType<typeof scoreboardActions>;

function getSortedProblems(problems: Problem[], sortBy:SortBy): Problem[] {
   let newProblems: Problem[] = [...problems];
   if (sortBy === SortBy.BY_POINTS) {
      newProblems = newProblems.sort((a, b) => (a.points || 0) - (b.points || 0));
   } else {
      newProblems = newProblems.sort((a, b) => (a.number || 0) - (b.number || 0));
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

      case getType(scoreboardActions.receiveContest):
         return { ...state, contest: action.payload };

      case getType(scoreboardActions.setNewContest):
         return { ...state, contest: {
               id: -1,
               name: "",
               description: "",
               organizerId: 1,
               locationId: 1,
               qualifyingProblems:10,
               gracePeriod: 15,
               rules: "",
               isNew: true
            }};

      case getType(scoreboardActions.updateContest):
         let newContest = {...state.contest};
         newContest[action.payload.propName] = action.payload.value;
         return { ...state, contest: newContest};

      case getType(scoreboardActions.receiveCompClasses):
         return { ...state, compClasses: action.payload.sort((a, b) => a.id - b.id) };

      case getType(scoreboardActions.startEditCompClass):
         return { ...state, editCompClass: action.payload};

      case getType(scoreboardActions.cancelEditCompClass):
         const newCompClasses1 = state.compClasses.filter(p2 => p2.id != -1);
         return { ...state, editCompClass: undefined, compClasses: newCompClasses1};

      case getType(scoreboardActions.startAddCompClass):
         const newCompClasses = [...state.compClasses];
         let newCompClass:CompClass = {
            id: -1,
            contestId: state.contest.id,
            name: "",
            description: "",
            timeBegin: "",
            timeEnd: ""
         };
         newCompClasses.push(newCompClass);
         return { ...state, editCompClass: newCompClass, compClasses: newCompClasses};

      case getType(scoreboardActions.updateEditCompClass):
         let newEditCompClass = {...state.editCompClass!};
         newEditCompClass[action.payload.propName] = action.payload.value;
         return { ...state, editCompClass: newEditCompClass};

      case getType(scoreboardActions.receiveProblems):
         const sortedBy = state.problemsSortedBy || SortBy.BY_NUMBER;
         const problems = getSortedProblems(action.payload, sortedBy);
         return { ...state, problems: problems, problemsSortedBy: sortedBy};

      case getType(scoreboardActions.startEditProblem):
         return { ...state, editProblem: action.payload};

      case getType(scoreboardActions.cancelEditProblem):
         const newProblems1 = state.problems.filter(p1 => p1.id != -1);
         return { ...state, editProblem: undefined, problems: newProblems1};

      case getType(scoreboardActions.startAddProblem):
         const problem = action.payload;
         const newProblems = [];
         let newProblem:Problem = {
            id: -1,
            contestId: state.contest.id,
            number: -1
         };
         for(let p of state.problems) {
            newProblems.push(p);
            if (p == problem) {
               newProblem.number = p.number + 1;
               newProblems.push(newProblem);
            }
         }
         return { ...state, editProblem: newProblem, problems: newProblems};

      case getType(scoreboardActions.updateEditProblem):
         let newEditProblem = {...state.editProblem!};
         newEditProblem[action.payload.propName] = action.payload.value;
         return { ...state, editProblem: newEditProblem};

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

      default:
         console.log("ACTION", action);
         return state;
   }
};