import { ContenderData } from '../model/contenderData';
import { ScoreboardContenderList } from '../model/scoreboardContenderList';
import { Contest } from '../model/contest';
import {Problem} from "../model/problem";
import {CompClass} from "../model/compClass";
import {Tick} from "../model/tick";
import {Color} from "../model/color";

export class Api {

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
      return (window.location.hostname === "localhost" ?  "http://localhost:8080" : "") + "/api/";
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

   private static getAuthHeader(activationCode?: string) : any {
      return activationCode ? {Authorization: "Basic " + window.btoa(activationCode + ":" + activationCode)} : {}
   }

   private static async get(url: string, activationCode?: string) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            headers: Api.getAuthHeader(activationCode)
         });
      return (await this.handleErrors(response)).json();
   }

   private static async post(url: string, postData: any, activationCode?: string) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            method: "POST",
            body: JSON.stringify(postData),
            headers: {
               "Content-Type": "application/json",
               ...Api.getAuthHeader(activationCode)
            }
         }
      );
      return (await this.handleErrors(response)).json();
   }

   private static async delete(url: string, activationCode?: string) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
               ...Api.getAuthHeader(activationCode)
            },
         }
      );
      return this.handleErrors(response);
   }

   private static async put(url: string, postData: any, activationCode?: string) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            method: "PUT",
            body: JSON.stringify(postData),
            headers: {
               "Content-Type": "application/json",
               ...Api.getAuthHeader(activationCode)
            },
         }
      );
      return (await this.handleErrors(response)).json();
   }

   static getContests(): Promise<Contest[]> {
      return this.get("contest");
   }

   static getContest(contestId: number, activationCode: string): Promise<Contest> {
      return this.get("contest/" + contestId, activationCode);
   }

   static getProblems(contestId: number, activationCode: string): Promise<Problem[]> {
      return this.get("contest/" + contestId + "/problem", activationCode);
   }

   static getCompClasses(contestId: number, activationCode: string): Promise<CompClass[]> {
      return this.get("contest/" + contestId + "/compClass", activationCode);
   }

   static getTicks(contenderId: number, activationCode: string): Promise<Tick[]> {
      return this.get("contender/" + contenderId + "/tick", activationCode);
   }

   static createTick(problemId: number, contenderId: number, flash: boolean, activationCode: string): Promise<Tick> {
      const newTick:Tick = {
         flash,
         contenderId,
         problemId
      }
      return this.post("tick", newTick, activationCode);
   }

   static updateTick(tick: Tick, activationCode: string): Promise<any> {
      return this.put("tick/" + tick.id, tick, activationCode);
   }

   static deleteTick(tick: Tick, activationCode: string): Promise<any> {
      return this.delete("tick/" + tick.id, activationCode);
   }

   static getColors(activationCode: string): Promise<Color[]> {
      return this.get("color", activationCode);
   }

   static getContender(code: string): Promise<ContenderData> {
      return this.get("contender/findByCode?code=" + code, code);
   }
 
   static setContender(contenderData : ContenderData, activationCode: string): Promise<ContenderData> {
      return this.put("contender/" + contenderData.id, contenderData, activationCode);
   }

   static getScoreboard(id:number): Promise<ScoreboardContenderList[]> {
      return this.get("contest/" + id + "/scoreboard");
   }
}