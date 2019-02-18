export interface CompClass {
   name: string;
   description: string;
   start: number;
   end: number;

   inProgress: boolean;
   statusString?: string;
   time?: string;
}