import { createSelector } from "reselect";
import { StoreState } from "../model/storeState";
import { Color } from "../model/color";
import { CompClass } from "../model/compClass";
import { Organizer } from "../model/organizer";
import { CompLocation } from "../model/compLocation";
import { Problem } from "../model/problem";
import { ContenderData } from "../model/contenderData";
import { Series } from "src/model/series";
import { createCachedSelector } from "re-reselect";
import { Tick } from "src/model/tick";
import { ContenderScoring } from "src/model/contenderScoring";
import { Contest } from "src/model/contest";

const getSelectedOrganizerId = (state: StoreState) => state.selectedOrganizerId;
const getColors = (state: StoreState) => state.colors;
const getCompClasses = (state: StoreState) => state.compClasses;
const getOrganizers = (state: StoreState) => state.organizers;
const getLocations = (state: StoreState) => state.locations;
const getSeries = (state: StoreState) => state.series;
const getProblems = (state: StoreState) => state.problems;
const getContenders = (state: StoreState) => state.contenders;
const getTicks = (state: StoreState) => state.ticks;
const getRaffles = (state: StoreState) => state.raffles;

export const getSelectedOrganizer = createSelector(
  [getOrganizers, getSelectedOrganizerId],
  (organizers, selectedOrganizerId) => {
    return organizers?.find((organizer) => organizer.id == selectedOrganizerId);
  }
);

export const getColorMap = createSelector([getColors], (colors) => {
  const colorMap = new Map<number, Color>();
  if (colors) {
    colors
      .filter((color) => color.id != undefined)
      .forEach((color) => colorMap.set(color.id!, color));
  }
  return colorMap;
});

export const getCompClassMap = createSelector(
  [getCompClasses],
  (compClasses) => {
    const map = new Map<number, CompClass>();
    if (compClasses) {
      compClasses
        .filter((compClass) => compClass.id != undefined)
        .forEach((compClass) => map.set(compClass.id!, compClass));
    }
    return map;
  }
);

export const getContenderMap = createSelector([getContenders], (contenders) => {
  const map = new Map<number, ContenderData>();
  if (contenders) {
    contenders
      .filter((contender) => contender.id != undefined)
      .forEach((contender) => map.set(contender.id!, contender));
  }
  return map;
});

export const getLocationMap = createSelector([getLocations], (locations) => {
  const map = new Map<number, CompLocation>();
  if (locations) {
    locations
      .filter((location) => location.id != undefined)
      .forEach((location) => map.set(location.id!, location));
  }
  return map;
});

export const getOrganizerMap = createSelector([getOrganizers], (organizers) => {
  const map = new Map<number, Organizer>();
  if (organizers) {
    organizers
      .filter((organizer) => organizer.id != undefined)
      .forEach((organizer) => map.set(organizer.id!, organizer));
  }
  return map;
});

export const getSeriesMap = createSelector([getSeries], (series) => {
  const map = new Map<number, Series>();
  if (series) {
    series.filter((s) => s.id != undefined).forEach((s) => map.set(s.id!, s));
  }
  return map;
});

export const getProblemMap = createSelector([getProblems], (problems) => {
  const map = new Map<number, Problem>();
  if (problems) {
    problems
      .filter((problem) => problem.id != undefined)
      .forEach((problem) => map.set(problem.id!, problem));
  }
  return map;
});

export const getCompClassesForContest = createCachedSelector(
  getCompClasses,
  (_, contestId: number) => contestId,
  (compClasses, contestId) => {
    return compClasses?.filter(
      (compClass) => compClass.contestId === contestId
    );
  }
)((_, contestId) => contestId);

export const getProblemsForContestSorted = createCachedSelector(
  getProblems,
  (_, contestId: number) => contestId,
  (problems, contestId) => {
    return problems
      ?.filter((problem) => problem.contestId === contestId)
      .sort((p1, p2) => p1.number - p2.number);
  }
)((_, contestId) => contestId);

export const getContendersForContest = createCachedSelector(
  getContenders,
  (_, contestId: number) => contestId,
  (contenders, contestId) => {
    return contenders?.filter((contender) => contender.contestId === contestId);
  }
)((_, contestId) => contestId);

export const getRafflesForContest = createCachedSelector(
  getRaffles,
  (_, contestId: number) => contestId,
  (raffles, contestId) => {
    return raffles?.filter((raffle) => raffle.contestId == contestId);
  }
)((_, contestId) => contestId);

export const getTicksForContest = createCachedSelector(
  getTicks,
  (_, contestId: number) => contestId,
  (ticks, contestId) => {
    return ticks?.filter((tick) => tick.contestId == contestId);
  }
)((_, contestId) => contestId);

export const getTicksByProblem = createSelector([getTicks], (ticks) => {
  if (ticks == undefined) {
    return undefined;
  }

  let buckets = new Map<number | undefined, Tick[]>();

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
});
