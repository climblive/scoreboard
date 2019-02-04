export interface CompClass {
   name: string;
   start: number;
   end: number;

   inProgress: boolean;
   statusString?: string;
   time?: string;
}