import { ContenderData } from '../model/contenderData';
import { ScoreboardContenderList } from '../model/scoreboardContenderList';
import { Contest } from '../model/contest';
import {Problem} from "../model/problem";
import {CompClass} from "../model/compClass";
import {Tick} from "../model/tick";
import {Color} from "../model/color";

export class Api {

   static credentials?:string = "YWRtaW46bm90aW1lZm9yY2xpbWJpbmc=" + "dummy";

   static getLiveUrl(): any {
      let url: string = "";
      console.log(window.location.protocol);
      if (window.location.hostname === "localhost") {
         url = "ws://localhost:8080";
      } else {
         if (window.location.protocol.indexOf("https") === 0) {
            url = "wss"
         } else { 
            url = "ws"
         }
         url += "://" + window.location.hostname
      }
      url += "/api/live/websocket";
      return url;
   } 

   private static getBaseUrl(): string {
      return (window.location.hostname === "localhost" ?  "https://clmb.live" : "") + "/api/";
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
      return this.credentials ? {Authorization: "Basic " + this.credentials} : {}
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

   static setCredentials(credentials:string) {
      this.credentials = credentials
   }

   static getContests(): Promise<Contest[]> {
      return this.get("contest");
   }

   static getContest(contestId: number, activationCode: string): Promise<Contest> {
      return this.get("contest/" + contestId);
   }

   static getProblems(contestId: number, activationCode: string): Promise<Problem[]> {
      return this.get("contest/" + contestId + "/problem");
   }

   static getCompClasses(contestId: number, activationCode: string): Promise<CompClass[]> {
      return this.get("contest/" + contestId + "/compClass");
   }

   static getTicks(contenderId: number, activationCode: string): Promise<Tick[]> {
      return this.get("contender/" + contenderId + "/tick");
   }

   static createTick(problemId: number, contenderId: number, flash: boolean, activationCode: string): Promise<Tick> {
      const newTick:Tick = {
         flash,
         contenderId,
         problemId
      }
      return this.post("tick", newTick);
   }

   static updateTick(tick: Tick, activationCode: string): Promise<any> {
      return this.put("tick/" + tick.id, tick);
   }

   static deleteTick(tick: Tick, activationCode: string): Promise<any> {
      return this.delete("tick/" + tick.id);
   }

   static getColors(activationCode: string): Promise<Color[]> {
      return this.get("color");
   }

   static getContender(code: string): Promise<ContenderData> {
      return this.get("contender/findByCode?code=" + code);
   }
 
   static setContender(contenderData : ContenderData, activationCode: string): Promise<ContenderData> {
      return this.put("contender/" + contenderData.id, contenderData);
   }

   static getScoreboard(id:number): Promise<ScoreboardContenderList[]> {
      return this.get("contest/" + id + "/scoreboard");
   }
}