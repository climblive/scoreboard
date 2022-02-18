import { Environment } from "../environment";
import { CompClass } from "../model/compClass";
import { ContenderData } from "../model/contenderData";
import { Contest } from "../model/contest";
import { Problem } from "../model/problem";
import { ScoreboardDescription } from "../model/scoreboardDescription";
import { Tick } from "../model/tick";

export class Api {
  private static useLocalhost = false;

  static getLiveUrl(): string {
    return (
      (Api.useLocalhost
        ? "ws://localhost:8080/api"
        : "wss://api." + Environment.siteDomain) + "/live/websocket"
    );
  }

  private static getBaseUrl(): string {
    return Api.useLocalhost
      ? "http://localhost:8080/api"
      : "https://api." + Environment.siteDomain;
  }

  private static async handleErrors(data: Response): Promise<Response> {
    if (!data.ok) {
      let errorBody = await data.json();
      console.error(errorBody);
      throw errorBody.message;
    }
    return data;
  }

  private static getAuthHeader(
    registrationCode?: string
  ): Record<string, string> {
    return registrationCode
      ? { Authorization: "Regcode " + registrationCode }
      : {};
  }

  private static async get(url: string, registrationCode?: string) {
    let response = await fetch(this.getBaseUrl() + url, {
      headers: Api.getAuthHeader(registrationCode),
    });
    return (await this.handleErrors(response)).json();
  }

  private static async post(
    url: string,
    postData: any,
    registrationCode?: string
  ) {
    let response = await fetch(this.getBaseUrl() + url, {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
        ...Api.getAuthHeader(registrationCode),
      },
    });
    return (await this.handleErrors(response)).json();
  }

  private static async delete(url: string, registrationCode?: string) {
    let response = await fetch(this.getBaseUrl() + url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...Api.getAuthHeader(registrationCode),
      },
    });
    return this.handleErrors(response);
  }

  private static async put(
    url: string,
    postData: any,
    registrationCode?: string
  ) {
    let response = await fetch(this.getBaseUrl() + url, {
      method: "PUT",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
        ...Api.getAuthHeader(registrationCode),
      },
    });
    return (await this.handleErrors(response)).json();
  }

  static getContest(
    contestId: number,
    registrationCode?: string
  ): Promise<Contest> {
    return this.get(`/contests/${contestId}`, registrationCode);
  }

  static getProblems(
    contestId: number,
    registrationCode: string
  ): Promise<Problem[]> {
    return this.get(`/contests/${contestId}/problem`, registrationCode);
  }

  static getCompClasses(
    contestId: number,
    registrationCode: string
  ): Promise<CompClass[]> {
    return this.get(`/contests/${contestId}/compClass`, registrationCode);
  }

  static getTicks(
    contenderId: number,
    registrationCode: string
  ): Promise<Tick[]> {
    return this.get(`/contenders/${contenderId}/tick`, registrationCode);
  }

  static createTick(
    problemId: number,
    contenderId: number,
    flash: boolean,
    registrationCode: string
  ): Promise<Tick> {
    const tick: Tick = {
      flash,
      contenderId,
      problemId,
    };
    return this.post(`/contenders/${contenderId}/tick`, tick, registrationCode);
  }

  static updateTick(tick: Tick, registrationCode: string): Promise<any> {
    return this.put(`/ticks/${tick.id}`, tick, registrationCode);
  }

  static deleteTick(tick: Tick, registrationCode: string): Promise<any> {
    return this.delete(`/ticks/${tick.id}`, registrationCode);
  }

  static getContender(registrationCode: string): Promise<ContenderData> {
    return this.get(
      `/contenders/findByCode?code=${registrationCode}`,
      registrationCode
    );
  }

  static updateContender(
    contenderData: ContenderData,
    registrationCode: string
  ): Promise<ContenderData> {
    return this.put(
      `/contenders/${contenderData.id}`,
      contenderData,
      registrationCode
    );
  }

  static getScoreboard(id: number): Promise<ScoreboardDescription> {
    return this.get(`/contests/${id}/scoreboard`);
  }
}
