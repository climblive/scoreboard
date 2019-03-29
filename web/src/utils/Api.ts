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

   private static handleErrors(data: Response): Response {
      if(!data.ok) {
         throw Error("Failed: " + data.statusText);
      }
      return data;
   }

   private static async get(url: string) {
      let response = await fetch(this.getBaseUrl() + url);
      return this.handleErrors(response).json();
   }

   private static async post(url: string, postData: any) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            method: "POST",
            body: JSON.stringify(postData),
            headers: {
               "Content-Type": "application/json"
            },
         }
      );
      return this.handleErrors(response).json();
   }

   private static async delete(url: string) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json"
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
               "Content-Type": "application/json"
            },
         }
      );
      return this.handleErrors(response).json();
   }

   static getContest(contestId: number): Promise<Contest> {
      return this.get("contest/" + contestId);
   }

   static getProblems(contestId: number): Promise<Problem[]> {
      return this.get("contest/" + contestId + "/problem");
   }

   static getCompClasses(contestId: number): Promise<CompClass[]> {
      return this.get("contest/" + contestId + "/compClass");
   }

   static getTicks(contenderId: number): Promise<Tick[]> {
      return this.get("contender/" + contenderId + "/tick");
   }

   static createTick(problemId: number, contenderId: number, flash: boolean): Promise<Tick> {
      const newTick:Tick = {
         flash,
         contenderId,
         problemId
      }
      return this.post("tick", newTick);
   }

   static updateTick(tick: Tick): Promise<any> {
      return this.put("tick/" + tick.id, tick);
   }

   static deleteTick(tick: Tick): Promise<any> {
      return this.delete("tick/" + tick.id);
   }

   static getColors(): Promise<Color[]> {
      return this.get("color");
   }

   static getContender(code: string): Promise<ContenderData> {
      return this.get("contender/findByCode?code=" + code);
   }
 
   static setContender(contenderData : ContenderData): Promise<ContenderData> {
      return this.put("contender/" + contenderData.id, contenderData);
   }

   static getScoreboard(id:number): Promise<ScoreboardContenderList[]> {
      return this.get("contest/" + id + "/scoreboard");
   }
}