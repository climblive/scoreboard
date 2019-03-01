import { ContenderData } from '../model/contenderData';
import { ScoreboardContenderList } from '../model/scoreboardContenderList';
import { Contest } from '../model/contest';
import {ProblemState} from "../model/problemState";
import {Problem} from "../model/problem";

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

   static getContest(): Promise<Contest> {
      return this.get("contest");
   }

   static getContender(code: string): Promise<ContenderData> {
      return this.get("contender/" + code);
   }
 
   static setContender(contenderData : ContenderData): Promise<ContenderData> {
      return this.post("contender/" + contenderData.code, contenderData);
   }

   static getScoreboard(): Promise<ScoreboardContenderList[]> {
      return this.get("scoreboard");
   }

   static setProblemState(contenderData: ContenderData, problem: Problem, problemState: ProblemState) {
      return this.post("contender/" + contenderData.code + "/problems/" + problem.id, {state: problemState});
   }
}