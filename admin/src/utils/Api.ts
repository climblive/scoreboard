import { ContenderData } from "../model/contenderData";
import { Contest } from "../model/contest";
import { Problem } from "../model/problem";
import { CompClass } from "../model/compClass";
import { Color } from "../model/color";
import { Organizer } from "../model/organizer";
import { CompLocation } from "../model/compLocation";
import { Series } from "../model/series";
import { User } from "../model/user";
import { Tick } from "../model/tick";
import { Raffle } from "../model/raffle";
import { RaffleWinner } from "../model/raffleWinner";
import { Environment } from "../environment";

export class Api {
  static credentials?: string;
  static organizerId?: number;

  static readonly url = "https://api." + Environment.siteDomain;
  static readonly defaultPageSize = 1000;

  private static getBaseUrl(): string {
    return Api.url;
  }

  private static async handleErrors(data: Response): Promise<Response> {
    if (!data.ok) {
      let errorBody = await data.json();
      console.error(errorBody);
      throw errorBody.message;
    }
    return data;
  }

  private static getAuthHeader(url: string): any {
    let authHeaders: any = {};
    if (this.credentials) {
      authHeaders.Authorization = "Bearer " + this.credentials;
    }
    if (this.organizerId != undefined && !url.startsWith("/organizer")) {
      authHeaders["Organizer-Id"] = this.organizerId;
    }
    return authHeaders;
  }

  private static async get(url: string) {
    let response = await fetch(this.getBaseUrl() + url, {
      headers: Api.getAuthHeader(url),
    });
    return (await this.handleErrors(response)).json();
  }

  private static async post(url: string, postData: any) {
    let response = await fetch(this.getBaseUrl() + url, {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
        ...Api.getAuthHeader(url),
      },
    });
    return (await this.handleErrors(response)).json();
  }

  private static async delete(url: string) {
    let response = await fetch(this.getBaseUrl() + url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...Api.getAuthHeader(url),
      },
    });
    return this.handleErrors(response);
  }

  private static async put(url: string, postData: any) {
    let response = await fetch(this.getBaseUrl() + url, {
      method: "PUT",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
        ...Api.getAuthHeader(url),
      },
    });
    return (await this.handleErrors(response)).json();
  }

  static setCredentials(credentials?: string) {
    this.credentials = credentials;
  }

  static setOrganizerId(organizerId?: number) {
    this.organizerId = organizerId;
  }

  // ---------------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------------

  static getUser(): Promise<User> {
    return this.get("/user/me");
  }

  // ---------------------------------------------------------------------------
  // Contests
  // ---------------------------------------------------------------------------

  static getContests(): Promise<Contest[]> {
    return this.get(`/contest?size=${this.defaultPageSize}`);
  }

  static getContest(contestId: number): Promise<Contest> {
    return this.get("/contest/" + contestId);
  }

  static saveContest(contest: Contest): Promise<Contest> {
    if (contest.id == undefined) {
      return this.post("/contest", contest);
    } else {
      return this.put("/contest/" + contest.id, contest);
    }
  }

  static deleteContest(contest: Contest): Promise<any> {
    return this.delete("/contest/" + contest.id);
  }

  static async exportContest(contestId: number) {
    let url = "/contest/export/" + contestId;
    let response = await fetch(this.getBaseUrl() + url, {
      headers: Api.getAuthHeader(url),
    });
    return (await this.handleErrors(response)).blob();
  }

  static async createPdf(contestId: number) {
    let url = "/contest/" + contestId + "/pdf";
    let response = await fetch(this.getBaseUrl() + url, {
      method: "GET",
      headers: {
        ...Api.getAuthHeader(url),
      },
    });
    return (await this.handleErrors(response)).blob();
  }

  static async createPdfFromTemplate(contestId: number, arrayBuffer: any) {
    let url = "/contest/" + contestId + "/pdf";
    let response = await fetch(this.getBaseUrl() + url, {
      method: "POST",
      body: arrayBuffer,
      headers: {
        "Content-Type": "application/pdf",
        ...Api.getAuthHeader(url),
      },
    });
    return (await this.handleErrors(response)).blob();
  }

  // ---------------------------------------------------------------------------
  // Problems
  // ---------------------------------------------------------------------------

  static getProblems(contestId: number): Promise<Problem[]> {
    return this.get("/contest/" + contestId + "/problem");
  }

  static saveProblem(problem: Problem): Promise<Problem> {
    if (problem.id == undefined) {
      return this.post("/problem", Problem.makeRequestBody(problem));
    } else {
      return this.put(
        "/problem/" + problem.id,
        Problem.makeRequestBody(problem)
      );
    }
  }

  static deleteProblem(problem: Problem): Promise<any> {
    return this.delete("/problem/" + problem.id);
  }

  // ---------------------------------------------------------------------------
  // Classes
  // ---------------------------------------------------------------------------

  static getCompClasses(contestId: number): Promise<CompClass[]> {
    return this.get("/contest/" + contestId + "/compClass");
  }

  static saveCompClass(compClass: CompClass): Promise<CompClass> {
    if (compClass.id == undefined) {
      return this.post("/compClass", compClass);
    } else {
      return this.put("/compClass/" + compClass.id, compClass);
    }
  }

  static deleteCompClass(compClass: CompClass): Promise<any> {
    return this.delete("/compClass/" + compClass.id);
  }

  // ---------------------------------------------------------------------------
  // Contenders
  // ---------------------------------------------------------------------------

  static getContenders(contestId: number): Promise<ContenderData[]> {
    return this.get("/contest/" + contestId + "/contender");
  }

  static saveContender(contender: ContenderData): Promise<ContenderData> {
    if (contender.id == undefined) {
      return this.post("/contender", ContenderData.makeRequestBody(contender));
    } else {
      return this.put(
        "/contender/" + contender.id,
        ContenderData.makeRequestBody(contender)
      );
    }
  }

  static createContenders(contestId: number, nNewContenders: number) {
    return this.put("/contest/" + contestId + "/createContenders", {
      count: nNewContenders,
    });
  }

  static resetContenders(contestId: number): Promise<any> {
    return this.put("/contest/" + contestId + "/resetContenders", {});
  }

  // ---------------------------------------------------------------------------
  // Raffles
  // ---------------------------------------------------------------------------

  static getRaffles(contestId: number): Promise<Raffle[]> {
    return this.get("/contest/" + contestId + "/raffle");
  }

  static saveRaffle(raffle: Raffle): Promise<Raffle> {
    if (raffle.id == undefined) {
      return this.post("/raffle", Raffle.makeRequestBody(raffle));
    } else {
      return this.put("/raffle/" + raffle.id, Raffle.makeRequestBody(raffle));
    }
  }

  static deleteRaffle(raffle: Raffle): Promise<any> {
    return this.delete("/raffle/" + raffle.id);
  }

  static drawWinner(raffle: Raffle): Promise<RaffleWinner> {
    return this.post("/raffle/" + raffle.id + "/winner", {});
  }

  static getRaffleWinners(raffle: Raffle): Promise<RaffleWinner[]> {
    return this.get("/raffle/" + raffle.id + "/winner");
  }

  // ---------------------------------------------------------------------------
  // Colors
  // ---------------------------------------------------------------------------

  static getColors(): Promise<Color[]> {
    return this.get(`/color?size=${this.defaultPageSize}`);
  }

  static saveColor(color: Color): Promise<Color> {
    if (color.id == undefined) {
      return this.post("/color", color);
    } else {
      return this.put("/color/" + color.id, color);
    }
  }

  static deleteColor(color: Color): Promise<any> {
    return this.delete("/color/" + color.id);
  }

  // ---------------------------------------------------------------------------
  // Series
  // ---------------------------------------------------------------------------

  static deleteSeries(series: Series): Promise<any> {
    return this.delete("/series/" + series.id);
  }

  static getSeries(): Promise<Series[]> {
    return this.get(`/series?size=${this.defaultPageSize}`);
  }

  static saveSeries(series: Series): Promise<Series> {
    if (series.id == undefined) {
      return this.post("/series", series);
    } else {
      return this.put("/series/" + series.id, series);
    }
  }

  // ---------------------------------------------------------------------------
  // Locations
  // ---------------------------------------------------------------------------

  static getLocations(): Promise<CompLocation[]> {
    return this.get(`/location?size=${this.defaultPageSize}`);
  }

  static saveLocation(location: CompLocation): Promise<CompLocation> {
    if (location.id == undefined) {
      return this.post("/location", location);
    } else {
      return this.put("/location/" + location.id, location);
    }
  }

  static deleteLocation(location: CompLocation): Promise<any> {
    return this.delete("/location/" + location.id);
  }

  // ---------------------------------------------------------------------------
  // Organizers
  // ---------------------------------------------------------------------------

  static deleteOrganizer(organizer: Organizer): Promise<any> {
    return this.delete("/organizer/" + organizer.id);
  }

  static getOrganizers(): Promise<Organizer[]> {
    return this.get(`/organizer?size=${this.defaultPageSize}`);
  }

  static saveOrganizer(organizer: Organizer): Promise<Organizer> {
    if (organizer.id == undefined) {
      return this.post("/organizer", organizer);
    } else {
      return this.put("/organizer/" + organizer.id, organizer);
    }
  }

  // ---------------------------------------------------------------------------
  // Ticks
  // ---------------------------------------------------------------------------

  static getTicks(contestId: number): Promise<Tick[]> {
    return this.get("/contest/" + contestId + "/tick");
  }
}
