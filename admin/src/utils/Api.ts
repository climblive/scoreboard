import { Environment } from "../environment";
import { Color } from "../model/color";
import { CompClass } from "../model/compClass";
import { CompLocation } from "../model/compLocation";
import { ContenderData } from "../model/contenderData";
import { Contest } from "../model/contest";
import { Organizer } from "../model/organizer";
import { Problem } from "../model/problem";
import { Raffle } from "../model/raffle";
import { RaffleWinner } from "../model/raffleWinner";
import { Series } from "../model/series";
import { Tick } from "../model/tick";
import { User } from "../model/user";

export class Api {
  private static useLocalhost = false;
  static credentials?: string;
  static organizerId?: number;
  static userId?: number;

  static readonly defaultPageSize = 1000;

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

  private static getAuthHeader(url: string): Record<string, string> {
    let authHeaders: Record<string, string> = {};
    if (this.credentials) {
      authHeaders.Authorization = "Bearer " + this.credentials;
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

  static setUserId(userId?: number) {
    this.userId = userId;
  }

  // ---------------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------------

  static getUser(): Promise<User> {
    return this.get("/users/me");
  }

  static getUsersForOrganizer(organizerId: number): Promise<User[]> {
    return this.get(`/organizers/${organizerId}/users`);
  }

  // ---------------------------------------------------------------------------
  // Contests
  // ---------------------------------------------------------------------------

  static getContests(): Promise<Contest[]> {
    return this.get(`/organizers/${this.organizerId}/contests`);
  }

  static getContest(contestId: number): Promise<Contest> {
    return this.get("/contests/" + contestId);
  }

  static saveContest(contest: Contest): Promise<Contest> {
    if (contest.id === undefined) {
      return this.post(`/organizers/${this.organizerId}/contests`, contest);
    } else {
      return this.put(`/contests/${contest.id}`, contest);
    }
  }

  static deleteContest(contest: Contest): Promise<any> {
    return this.delete(`/contests/${contest.id}`);
  }

  static copyContest(contestId: number): Promise<Contest> {
    return this.post(`/contests/${contestId}/copy`, {});
  }

  static async exportContest(contestId: number) {
    let url = "/contests/export/" + contestId;
    let response = await fetch(this.getBaseUrl() + url, {
      headers: Api.getAuthHeader(url),
    });
    return (await this.handleErrors(response)).blob();
  }

  static async createPdf(contestId: number) {
    let url = "/contests/" + contestId + "/pdf";
    let response = await fetch(this.getBaseUrl() + url, {
      method: "GET",
      headers: {
        ...Api.getAuthHeader(url),
      },
    });
    return (await this.handleErrors(response)).blob();
  }

  static async createPdfFromTemplate(contestId: number, arrayBuffer: any) {
    let url = "/contests/" + contestId + "/pdf";
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
    return this.get(`/contests/${contestId}/problems`);
  }

  static saveProblem(problem: Problem): Promise<Problem> {
    if (problem.id === undefined) {
      return this.post(`/contests/${problem.contestId}/problems`, problem);
    } else {
      return this.put(`/problems/${problem.id}`, problem);
    }
  }

  static deleteProblem(problem: Problem): Promise<any> {
    return this.delete(`/problems/${problem.id}`);
  }

  // ---------------------------------------------------------------------------
  // Classes
  // ---------------------------------------------------------------------------

  static getCompClasses(contestId: number): Promise<CompClass[]> {
    return this.get(`/contests/${contestId}/compClasses`);
  }

  static saveCompClass(compClass: CompClass): Promise<CompClass> {
    if (compClass.id === undefined) {
      return this.post(
        `/contests/${compClass.contestId}/compClasses`,
        compClass
      );
    } else {
      return this.put(`/compClasses/${compClass.id}`, compClass);
    }
  }

  static deleteCompClass(compClass: CompClass): Promise<any> {
    return this.delete(`/compClasses/${compClass.id}`);
  }

  // ---------------------------------------------------------------------------
  // Contenders
  // ---------------------------------------------------------------------------

  static getContenders(contestId: number): Promise<ContenderData[]> {
    return this.get(`/contests/${contestId}/contenders`);
  }

  static saveContender(contender: ContenderData): Promise<ContenderData> {
    if (contender.id === undefined) {
      return this.post(
        `/contests/${contender.contestId}/contenders`,
        contender
      );
    } else {
      return this.put(`/contenders/${contender.id}`, contender);
    }
  }

  static createContenders(contestId: number, nNewContenders: number) {
    return this.put(`/contests/${contestId}/createContenders`, {
      count: nNewContenders,
    });
  }

  // ---------------------------------------------------------------------------
  // Raffles
  // ---------------------------------------------------------------------------

  static getRaffles(contestId: number): Promise<Raffle[]> {
    return this.get(`/contests/${contestId}/raffles`);
  }

  static saveRaffle(raffle: Raffle): Promise<Raffle> {
    if (raffle.id === undefined) {
      return this.post(`/contests/${raffle.contestId}/raffles`, raffle);
    } else {
      return this.put(`/raffles/${raffle.id}`, raffle);
    }
  }

  static deleteRaffle(raffle: Raffle): Promise<any> {
    return this.delete(`/raffles/${raffle.id}`);
  }

  static drawWinner(raffle: Raffle): Promise<RaffleWinner> {
    return this.post(`/raffles/${raffle.id}/winners`, {});
  }

  static getRaffleWinners(raffle: Raffle): Promise<RaffleWinner[]> {
    return this.get(`/raffles/${raffle.id}/winners`);
  }

  // ---------------------------------------------------------------------------
  // Colors
  // ---------------------------------------------------------------------------

  static getColors(): Promise<Color[]> {
    return this.get(`/organizers/${this.organizerId}/colors`);
  }

  static saveColor(color: Color): Promise<Color> {
    if (color.id === undefined) {
      return this.post(`/organizers/${this.organizerId}/colors`, color);
    } else {
      return this.put(`/colors/${color.id}`, color);
    }
  }

  static deleteColor(color: Color): Promise<any> {
    return this.delete(`/colors/${color.id}`);
  }

  // ---------------------------------------------------------------------------
  // Series
  // ---------------------------------------------------------------------------

  static deleteSeries(series: Series): Promise<any> {
    return this.delete(`/series/${series.id}`);
  }

  static getSeries(): Promise<Series[]> {
    return this.get(`/organizers/${this.organizerId}/series`);
  }

  static saveSeries(series: Series): Promise<Series> {
    if (series.id === undefined) {
      return this.post(`/organizers/${this.organizerId}/series`, series);
    } else {
      return this.put(`/series/${series.id}`, series);
    }
  }

  // ---------------------------------------------------------------------------
  // Locations
  // ---------------------------------------------------------------------------

  static getLocations(): Promise<CompLocation[]> {
    return this.get(`/organizers/${this.organizerId}/locations`);
  }

  static saveLocation(location: CompLocation): Promise<CompLocation> {
    if (location.id === undefined) {
      return this.post(`/organizers/${this.organizerId}/locations`, location);
    } else {
      return this.put(`/locations/${location.id}`, location);
    }
  }

  static deleteLocation(location: CompLocation): Promise<any> {
    return this.delete(`/locations/${location.id}`);
  }

  // ---------------------------------------------------------------------------
  // Organizers
  // ---------------------------------------------------------------------------

  static deleteOrganizer(organizer: Organizer): Promise<any> {
    return this.delete(`/organizers/${organizer.id}`);
  }

  static getOrganizers(): Promise<Organizer[]> {
    return this.get(`/users/${this.userId}/organizers`);
  }

  static saveOrganizer(organizer: Organizer): Promise<Organizer> {
    if (organizer.id === undefined) {
      return this.post("/organizers", organizer);
    } else {
      return this.put(`/organizers/${organizer.id}`, organizer);
    }
  }

  // ---------------------------------------------------------------------------
  // Ticks
  // ---------------------------------------------------------------------------

  static getTicks(contestId: number): Promise<Tick[]> {
    return this.get(`/contests/${contestId}/ticks`);
  }
}
