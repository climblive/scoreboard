export interface CompClass {
   id: number;
   name: string;
   description: string;
   start: number;
   end: number;

   inProgress: boolean;
   statusString?: string;
   time?: string;
}