export interface Tick {
  id?: number;
  timestamp?: string;
  contenderId: number;
  problemId: number;
  flash: boolean;
}
