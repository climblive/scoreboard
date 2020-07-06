import { createSelector } from 'reselect'
import { StoreState } from '../model/storeState';
import {Color} from "../model/color";
import {CompClass} from "../model/compClass";
import {Organizer} from "../model/organizer";
import {CompLocation} from "../model/compLocation";
import {Problem} from "../model/problem";
import {ContenderData} from "../model/contenderData";
import {SortBy} from "../constants/sortBy";
import {Series} from 'src/model/series';

const getColors = (state: StoreState) => state.colors;
const getCompClasses = (state: StoreState) => state.compClasses;
const getContests = (state: StoreState) => state.contests;
const getOrganizers = (state: StoreState) => state.organizers;
const getLocations = (state: StoreState) => state.locations;
const getSeries = (state: StoreState) => state.series;
const getProblems = (state: StoreState) => state.problems;
const getContenders = (state: StoreState) => state.contenders;
const getTicks = (state: StoreState) => state.ticks;
const getContest = (state: StoreState) => state.contest;
const getContenderFilterCompClassId = (state: StoreState) => state.contenderFilterCompClassId;
const getContenderSortBy = (state: StoreState) => state.contenderSortBy;

const getOrganizer = (state: StoreState) => state.organizer;

export const getColorMap = createSelector(
   [getColors],
   (colors) => {
      const colorMap = new Map<number, Color>();
      if(colors) {
         colors.filter(color => color.id != undefined).forEach(color => colorMap.set(color.id!, color));
      }
      return colorMap;
   }
);

export const getCompClassMap = createSelector(
   [getCompClasses],
   (compClasses) => {
      const map = new Map<number, CompClass>();
      if(compClasses) {
         compClasses.filter(compClass => compClass.id != undefined).forEach(compClass => map.set(compClass.id!, compClass));
      }
      return map;
   }
);

export const getContenderMap = createSelector(
   [getContenders],
   (contenders) => {
      const map = new Map<number, ContenderData>();
      if(contenders) {
         contenders.forEach(contender => map.set(contender.id, contender));
      }
      return map;
   }
);

export const getLocationMap = createSelector(
   [getLocations],
   (locations) => {
      const map = new Map<number, CompLocation>();
      if(locations) {
         locations.filter(location => location.id != undefined).forEach(location => map.set(location.id!, location));
      }
      return map;
   }
);

export const getOrganizerMap = createSelector(
   [getOrganizers],
   (organizers) => {
      const map = new Map<number, Organizer>();
      if(organizers) {
         organizers.filter(organizer => organizer.id != undefined).forEach(organizer => map.set(organizer.id!, organizer));
      }
      return map;
   }
);

export const getSeriesMap = createSelector(
   [getSeries],
   (series) => {
      const map = new Map<number, Series>();
      if (series) {
         series.filter(s => s.id != undefined).forEach(s => map.set(s.id!, s));
      }
      return map;
   }
);

export const getProblemMap = createSelector(
   [getProblems],
   (problems) => {
      const map = new Map<number, Problem>();
      if(problems) {
         problems.filter(problem => problem.id != undefined).forEach(problem => map.set(problem.id!, problem));
      }
      return map;
   }
);

export const getOrganizerContests = createSelector(
   [getContests, getOrganizer],
   (contests, organizer) => {
      return contests && organizer ? contests.filter(c => c.organizerId == organizer.id) : undefined;
   }
);

export const getOrganizerSeries = createSelector(
   [getSeries, getOrganizer],
   (series, organizer) => {
      return series && organizer ? series.filter(c => c.organizerId == organizer.id) : undefined;
   }
);

export const getOrganizerLocations = createSelector(
   [getLocations, getOrganizer],
   (locations, organizer) => {
      return locations && organizer ? locations.filter(c => c.organizerId == organizer.id) : undefined;
   }
);

export const getOrganizerColors = createSelector(
   [getColors, getOrganizer],
   (colors, organizer) => {
      return colors && organizer ? colors.filter(c => c.organizerId == organizer.id || c.shared) : undefined;
   }
);

export const getProblemsWithTicks = createSelector(
   [getProblems, getTicks],
   (problems, ticks) => {
      let problemsMap = new Map<number | undefined, Problem>();
      let newProblems:Problem[] = [];
      if(problems) {
         for (let problem of problems) {
            let newProblem = {...problem, ticks: []};
            newProblems.push(newProblem);
            problemsMap.set(problem.id, newProblem);
         }
      }
      if(ticks) {
         for (let tick of ticks) {
            let problem = problemsMap.get(tick.problemId);
            if(problem) {
               problem.ticks!.push(tick);
            }
         }
      }
      return newProblems;
   }
);

export const getContendersWithTicks = createSelector(
   [getContenders, getTicks, getProblems, getContest, getContenderFilterCompClassId, getContenderSortBy],
   (contenders, ticks, problems, contest, contenderFilterCompClassId, contenderSortBy) => {
      // Create the problem map:
      const problemMap = new Map<number | undefined, Problem>();
      if(problems) {
         problems.forEach(problem => problemMap.set(problem.id, problem));
      }

      // Create contenders list:
      let contendersMap = new Map<number, ContenderData>();
      let contendersPerClass = new Map<number, ContenderData[]>();
      let newContenders:ContenderData[] = [];
      if(contenders) {
         for (let contender of contenders) {
            if(contenderFilterCompClassId == undefined || contender.compClassId == contenderFilterCompClassId) {
               let newContender = {...contender, ticks: []};
               newContenders.push(newContender);
               contendersMap.set(contender.id, newContender);

               if (contender.compClassId != undefined) {
                  if (!contendersPerClass.has(contender.compClassId!)) {
                     contendersPerClass.set(contender.compClassId, []);
                  }
                  contendersPerClass.get(contender.compClassId!)!.push(newContender);
               }
            }
         }
      }

      // Place ticks on contenders:
      if(ticks) {
         for (let tick of ticks) {
            let contender = contendersMap.get(tick.contenderId);
            if(contender) {
               contender.ticks!.push(tick);
            }
         }
      }

      // Calculate scores on contenders:
      for (let contender of newContenders) {
         let pointsList: number[] = [];
         contender.totalScore = 0;
         for (let tick of contender.ticks!) {
            let problem = problemMap.get(tick.problemId);
            let points = problem!.points!;
            if(tick.flash && problem!.flashBonus) {
               points += problem!.flashBonus;
            }
            contender.totalScore += points;
            pointsList.push(points)
         }
         if(pointsList.length) {
            pointsList.sort((a, b) => b - a);
            pointsList = pointsList.slice(0, contest!.qualifyingProblems);
            contender.qualifyingScore = pointsList.reduce((total, num) => total + num);
         } else {
            contender.qualifyingScore = 0;
         }
      }

      // Calculate positions:
      contendersPerClass.forEach((list) => {
         list.sort((a, b) => b.totalScore! - a.totalScore!);
         let lastScore = -1;
         let lastPos = 0;
         list.forEach((contender, index) => {
            if(lastScore != contender.totalScore) {
               lastScore = contender.totalScore!;
               lastPos = index + 1;
            }
            contender.totalPosition = lastPos;
         });

         list.sort((a, b) => b.qualifyingScore! - a.qualifyingScore!);
         lastScore = -1;
         lastPos = 0;
         let isFinalist = true;
         list.forEach((contender, index) => {
            if(lastScore != contender.qualifyingScore) {
               lastScore = contender.qualifyingScore!;
               lastPos = index + 1;
               isFinalist = lastPos <= contest!.finalists  && lastScore > 0;
            }
            contender.qualifyingPosition = lastPos;
            contender.isFinalist = isFinalist;
         });
      });

      // Sort the contenders:
      if(contenderSortBy == SortBy.BY_NUMBER_OF_TICKS) {
         newContenders.sort((a, b) => b.ticks!.length - a.ticks!.length);
      } else if(contenderSortBy == SortBy.BY_TOTAL_POINTS) {
         newContenders.sort((a, b) => b.totalScore! - a.totalScore!);
      } else if(contenderSortBy == SortBy.BY_QUALIFYING_POINTS) {
         newContenders.sort((a, b) => b.qualifyingScore! - a.qualifyingScore!);
      } else {
         newContenders.sort((a, b) => {
            let aName = a.name ? a.name.toLocaleUpperCase() : "ööööööööööö";
            let bName = b.name ? b.name.toLocaleUpperCase() : "ööööööööööö";
            return aName.localeCompare(bName);
         });
      }

      return newContenders;
   }
);

export const getContestIssues = createSelector(
   [getProblems, getCompClasses, getContenders],
   (problems, compClasses, contenders) => {
      let issues: string[] = [];
      if(problems && (problems.length == 0  || (problems.length == 1 && problems[0].colorId == undefined))) {
         issues.push("Please add problems")
      }
      if(compClasses && compClasses.length == 0) {
         issues.push("Please add at least one competition class")
      }
      if(contenders && contenders.length == 0) {
         issues.push("Please add contenders")
      }
      return issues;
   }
);
