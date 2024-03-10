export interface Problem {
  id?: number;
  holdColorPrimary: string;
  holdColorSecondary?: string;
  contestId: number;
  number: number;
  name?: string;
  description?: string;
  points?: number;
  flashBonus?: number;
}
