import { Organizer } from "./organizer";

export interface User {
  id?: number;
  name: string;
  username: string;
  admin: boolean;
  organizers: Organizer[];
}
