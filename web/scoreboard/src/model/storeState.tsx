import { Problem } from './problem';

export interface StoreState {
   languageName: string;
   enthusiasmLevel: number;
   problems: Problem[];
}