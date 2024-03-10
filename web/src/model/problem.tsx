export interface Problem {
  id: number;
  number: number;
  holdColorPrimary: string;
  holdColorSecondary?: string;
  points: number;
  flashBonus?: number;
  name: string;
  description?: string;
}
