import { ContenderData } from '../model/contenderData';
import { Contest } from '../model/contest';
import {Problem} from "../model/problem";
import {CompClass} from "../model/compClass";
import {Color} from "../model/color";
import {Organizer} from "../model/organizer";
import {CompLocation} from "../model/compLocation";
import {Series} from "../model/series";
import {User} from "../model/user";
import {Tick} from "../model/tick";
import {Raffle} from "../model/raffle";
import {RaffleWinner} from "../model/raffleWinner";
import {Environment} from "../environment";

export class Api {

   static oldCredentials?:string = "YWRtaW46bm90aW1lZm9yY2xpbWJpbmc=";
   static credentials?:string;

   static readonly url = "https://api." + Environment.siteDomain;

   private static getBaseUrl(): string {
      return Api.url;
   }

   private static async handleErrors(data: Response): Promise<Response> {
      if(!data.ok) {
         let errorBody = await data.json();
         console.error(errorBody);
         throw errorBody.message;
         //throw Error("Failed: " + data.statusText);
      }
      return data;
   }

   private static getAuthHeader() : any {
      let authHeaders:any = {};
      if(this.credentials) {
         authHeaders.Authorization = "Bearer " + this.credentials;
      } else if(this.oldCredentials) {
         authHeaders.Authorization = "Basic " + this.oldCredentials;
      }
      return authHeaders;
   }

   private static async get(url: string) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            headers: Api.getAuthHeader()
         });
      return (await this.handleErrors(response)).json();
   }

   private static async post(url: string, postData: any) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            method: "POST",
            body: JSON.stringify(postData),
            headers: {
               "Content-Type": "application/json",
               ...Api.getAuthHeader()
            }
         }
      );
      return (await this.handleErrors(response)).json();
   }

   private static async delete(url: string) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
               ...Api.getAuthHeader()
            },
         }
      );
      return this.handleErrors(response);
   }

   private static async put(url: string, postData: any) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            method: "PUT",
            body: JSON.stringify(postData),
            headers: {
               "Content-Type": "application/json",
               ...Api.getAuthHeader()
            },
         }
      );
      return (await this.handleErrors(response)).json();
   }

   static setCredentials(credentials?:string) {
      this.credentials = credentials
   }

   static getUser(): Promise<User> {
      return this.get("/user/me");
   }

   static getContests(): Promise<Contest[]> {
      return this.get("/contest");
   }

   static getContest(contestId: number): Promise<Contest> {
      return this.get("/contest/" + contestId);
   }

   static saveContest(contest: Contest): Promise<Contest> {
      if(contest.isNew) {
         return this.post("/contest", contest);
      } else {
         return this.put("/contest/" + contest.id, contest);
      }
   }

   static getProblems(contestId: number): Promise<Problem[]> {
      return this.get("/contest/" + contestId + "/problem");
   }

   static saveProblem(problem:Problem): Promise<Problem> {
      if(problem.id == -1) {
         return this.post("/problem", problem);
      } else {
         return this.put("/problem/" + problem.id, problem);
      }
   }

   static deleteProblem(problem: Problem): Promise<any> {
      return this.delete("/problem/" + problem.id);
   }

   static getCompClasses(contestId: number): Promise<CompClass[]> {
      return this.get("/contest/" + contestId + "/compClass");
   }

   static saveCompClass(compClass:CompClass): Promise<CompClass> {
      if(compClass.id == -1) {
         return this.post("/compClass", compClass);
      } else {
         return this.put("/compClass/" + compClass.id, compClass);
      }
   }

   static deleteCompClass(compClass: CompClass): Promise<any> {
      return this.delete("/compClass/" + compClass.id);
   }

   static getContenders(contestId: number): Promise<ContenderData[]> {
      return this.get("/contest/" + contestId + "/contender");
   }

   static getRaffles(contestId: number): Promise<Raffle[]> {
      return this.get("/contest/" + contestId + "/raffle");
   }

   static getRaffleWinners(raffle: Raffle): Promise<RaffleWinner[]> {
      return this.get("/raffle/" + raffle.id + "/winner");
   }

   static saveRaffle(raffle:Raffle): Promise<Raffle> {
      if(raffle.id == -1) {
         return this.post("/raffle", raffle);
      } else {
         return this.put("/raffle/" + raffle.id, raffle);
      }
   }

   static drawWinner(raffle:Raffle): Promise<RaffleWinner> {
      return this.post("/raffle/" + raffle.id + "/winner", {});
   }

   static deleteRaffle(raffle:Raffle): Promise<any> {
      return this.delete("/raffle/" + raffle.id);
   }

   static getColors(): Promise<Color[]> {
      return this.get("/color");
   }

   static saveColor(color:Color): Promise<Color> {
      if(color.id == -1) {
         return this.post("/color", color);
      } else {
         return this.put("/color/" + color.id, color);
      }
   }

   static deleteSeries(series: Series): Promise<any> {
      return this.delete("/series/" + series.id);
   }

   static getSeries(): Promise<Series[]> {
      return this.get("/series");
   }

   static saveSeries(series:Series): Promise<Series> {
      if(series.id == -1) {
         return this.post("/series", series);
      } else {
         return this.put("/series/" + series.id, series);
      }
   }

   static deleteColor(color: Color): Promise<any> {
      return this.delete("/color/" + color.id);
   }

   static getLocations(): Promise<CompLocation[]> {
      return this.get("/location");
   }

   static saveLocation(location: CompLocation): Promise<CompLocation> {
      if(location.id == -1) {
         return this.post("/location", location);
      } else {
         return this.put("/location/" + location.id, location);
      }
   }

   static deleteLocation(location: CompLocation): Promise<any> {
      return this.delete("/location/" + location.id);
   }

   static deleteOrganizer(organizer: Organizer): Promise<any> {
      return this.delete("/organizer/" + organizer.id);
   }

   static getOrganizers(): Promise<Organizer[]> {
      return this.get("/organizer");
   }

   static saveOrganizer(organizer: Organizer): Promise<Organizer> {
      if(organizer.id == -1) {
         return this.post("/organizer", organizer);
      } else {
         return this.put("/organizer/" + organizer.id, organizer);
      }
   }

   static setContender(contenderData : ContenderData): Promise<ContenderData> {
      return this.put("/contender/" + contenderData.id, contenderData);
   }

   static createContenders(contestId: number, nNewContenders: number) {
      return this.put("/contest/" + contestId + "/createContenders",
         {
            count: nNewContenders
         })
   }

   static resetContenders(contestId: number): Promise<any> {
      return this.put("/contest/" + contestId + "/resetContenders", {})
   }

   static async exportContest(contestId: number) {
      let url = "/contest/export/" + contestId;
      let response = await fetch(this.getBaseUrl() + url,
         {
            headers: Api.getAuthHeader()
         });
      return (await this.handleErrors(response)).blob();
   }

   static async createPdf(contestId: number) {
      let url = "/contest/" + contestId + "/pdf";
      let response = await fetch(this.getBaseUrl() + url,
         {
            method: "GET",
            headers: {
               ...Api.getAuthHeader()
            }
         });
      return (await this.handleErrors(response)).blob();
   }

   static async createPdfFromTemplate(contestId: number, arrayBuffer: any) {
      let url = "/contest/" + contestId + "/pdf";
      let response = await fetch(this.getBaseUrl() + url,
         {
            method: "POST",
            body: arrayBuffer,
            headers: {
               "Content-Type": "application/pdf",
               ...Api.getAuthHeader()
            }
         });
      return (await this.handleErrors(response)).blob();
   }

   static getTicks(contestId: number): Promise<Tick[]> {
      return this.get("/contest/" + contestId + "/tick");
   }

}
