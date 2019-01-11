import { Problem } from './problem';

export interface StoreState {
   name: string;
   compClass: string;
   problems: Problem[];
}