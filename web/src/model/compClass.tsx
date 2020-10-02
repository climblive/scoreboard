export interface CompClass {
  id: number;
  name: string;
  description: string;
  timeBegin: string;
  timeEnd: string;
  color: string;

  inProgress: boolean;
  statusString?: string;
  time?: string;
  scoreboardIndex?: number;
}
