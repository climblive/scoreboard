import { UserData } from '../model/userData';
import { ScoreboardContenderList } from '../model/scoreboardContenderList';
import { Contest } from '../model/contest';

export class Api {

   static getLiveUrl(): any {
      var url: string = "";
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

   private static get(url: string) { 
      return fetch(this.getBaseUrl() + url).then((data) => data.json());
   }

   private static post(url: string, postData: any) { 
      return fetch(this.getBaseUrl() + url,
         {
            method: "POST",
            body: JSON.stringify(postData),
            headers: {
               "Content-Type": "application/json"
            },
         }
      ).then((data) => data.json())
   }

   static getContest(): Promise<Contest> {
      return this.get("contest");
   }

   static getContender(code: string): Promise<UserData> {
      return this.get("contender/" + code);
   }
 
   static setContender(contenderData : UserData): Promise<UserData> {
      return this.post("contender/" + contenderData.code, contenderData);
   }

   static getScoreboard(): Promise<ScoreboardContenderList[]> {
      return this.get("scoreboard");
   }
} 