import {StoreState} from '../model/storeState';
import * as scoreboardActions from '../actions/actions';
import {ActionType, getType} from 'typesafe-actions';
import {Color} from "../model/color";
import {Problem} from "../model/problem";
import {CompLocation} from "../model/compLocation";
import {Organizer} from "../model/organizer";
import {CompClass} from "../model/compClass";

export type ScoreboardActions = ActionType<typeof scoreboardActions>;

let getColorMap = (colors:Color[]) => {
   const colorMap = new Map<number, Color>();
   colors.forEach(color => colorMap.set(color.id, color));
   return colorMap;
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
         const problems2 = action.payload.sort((a, b) => (a.number || 0) - (b.number || 0));
         let editProblem = undefined;
         if(problems2.length == 0) {
            editProblem = {
               id: -1,
               contestId: state.contest.id,
               number: 1
            };
            problems2.push(editProblem);
         }
         return { ...state, problems: problems2, editProblem: editProblem};

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

      case getType(scoreboardActions.receiveContenders):
         return { ...state, contenders: action.payload };

      case getType(scoreboardActions.receiveColors):
         return { ...state, colors: action.payload, colorMap: getColorMap(action.payload)};

      case getType(scoreboardActions.startEditColor):
         return { ...state, editColor: action.payload};

      case getType(scoreboardActions.cancelEditColor):
         const newColors = state.colors.filter(p2 => p2.id != -1);
         return { ...state, editColor: undefined, colors: newColors, newColors};

      case getType(scoreboardActions.startAddColor):
         const newColors2 = [...state.colors];
         let newColor:Color = {
            rgbPrimary:"#000000",
            id: -1,
            name: "",
         };
         newColors2.push(newColor);
         return { ...state, editColor: newColor, colors: newColors2};

      case getType(scoreboardActions.updateEditColor):
         let newEditColor = {...state.editColor!};
         newEditColor[action.payload.propName] = action.payload.value;
         return { ...state, editColor: newEditColor};

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