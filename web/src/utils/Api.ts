import { UserData } from '../model/userData';

export class Api { 

   private static getBaseUrl(): string {
      return "http://localhost:8080/";
   }

   private static get(url: string) { 
      return fetch(this.getBaseUrl() + url).then((data) => data.json());
   }

   private static post(url: string, postData: any) { 
      return fetch(this.getBaseUrl() + url,
         {
            method: "POST",
            body: JSON.stringify(postData)
         }
      ).then((data) => data.json())
   }

   static getContenderData(code: string): Promise<UserData> {
      return this.get("contender/" + code);
   }
 
   static setContenderData(contenderData : UserData): Promise<UserData> {
      return this.post("contender/" + contenderData.code, contenderData);
   }
} 