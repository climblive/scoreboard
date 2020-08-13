import { createSelector } from "reselect";
import { StoreState } from "../model/storeState";
import { CompClass } from "../model/compClass";
import { Problem } from "../model/problem";
import { ContenderData } from "../model/contenderData";
import { createCachedSelector } from "re-reselect";
import { Tick } from "src/model/tick";
import { ContenderScoringInfo } from "src/model/contenderScoringInfo";
import { Contest } from "src/model/contest";

const getSelectedOrganizerId = (state: StoreState) => state.selectedOrganizerId;
const getOrganizers = (state: StoreState) => state.organizers;

export const getSelectedOrganizer = createSelector(
  [getOrganizers, getSelectedOrganizerId],
  (organizers, selectedOrganizerId) => {
    return selectedOrganizerId != undefined
      ? organizers?.get(selectedOrganizerId)
      : undefined;
  }
);

export const groupTicksByProblem = (ticks: Tick[]) => {
  let buckets = new Map<number, Tick[]>();

  for (let tick of ticks) {
    let key = tick.problemId;
    let bucket;
    if (buckets.has(key)) {
      bucket = buckets.get(key);
    } else {
      bucket = [];
      buckets.set(key, bucket);
    }

    bucket.push(tick);
  }

  return buckets;
};

export const calculateContenderScoringInfo = (
  contenders: ContenderData[],
  ticks: Tick[],
  problems: Problem[],
  contest: Contest
) => {
  // Create the problem map:
  const problemMap = new Map<number | undefined, Problem>();
  if (problems) {
    problems.forEach((problem) => problemMap.set(problem.id, problem));
  }

  // Create contenders list:
  let scoringsMap = new Map<number, ContenderScoringInfo>();
  let scoringsPerClass = new Map<number, ContenderScoringInfo[]>();
  let scorings: ContenderScoringInfo[] = [];
  if (contenders) {
    for (let contender of contenders) {
      let newContender: ContenderScoringInfo = { ticks: [] };
      scorings.push(newContender);
      scoringsMap.set(contender.id!, newContender);

      if (contender.compClassId != undefined) {
        if (!scoringsPerClass.has(contender.compClassId!)) {
          scoringsPerClass.set(contender.compClassId, []);
        }
        scoringsPerClass.get(contender.compClassId!)?.push(newContender);
      }
    }
  }

  // Place ticks on contenders:
  if (ticks) {
    for (let tick of ticks) {
      let contender = scoringsMap.get(tick.contenderId);
      if (contender) {
        contender.ticks?.push(tick);
      }
    }
  }

  // Calculate scores on contenders:
  for (let contender of scorings) {
    let pointsList: number[] = [];
    contender.totalScore = 0;
    for (let tick of contender.ticks!) {
      let problem = problemMap.get(tick.problemId);
      let points = problem!.points!;
      if (tick.flash && problem!.flashBonus) {
        points += problem!.flashBonus;
      }
      contender.totalScore += points;
      pointsList.push(points);
    }
    if (pointsList.length) {
      pointsList.sort((a, b) => b - a);
      pointsList = pointsList.slice(0, contest!.qualifyingProblems);
      contender.qualifyingScore = pointsList.reduce(
        (total, num) => total + num
      );
    } else {
      contender.qualifyingScore = 0;
    }
  }

  // Calculate positions:
  scoringsPerClass.forEach((list) => {
    list.sort((a, b) => b.totalScore! - a.totalScore!);
    let lastScore = -1;
    let lastPos = 0;
    list.forEach((contender, index) => {
      if (lastScore != contender.totalScore) {
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
      if (lastScore != contender.qualifyingScore) {
        lastScore = contender.qualifyingScore!;
        lastPos = index + 1;
        isFinalist = lastPos <= contest!.finalists && lastScore > 0;
      }
      contender.qualifyingPosition = lastPos;
      contender.isFinalist = isFinalist;
    });
  });

  return scoringsMap;
};
