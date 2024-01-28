import { AxiosHeaders } from "axios";
import { Clubs } from "./clubs";
import { Players } from "./players";
import { environments } from "@config/env";
import { Brawlers } from "./brawlers";
import { Events } from "./events";
import { Rankings } from "./rankings";
import { Icons } from "./icons";

export class BrawlStarsService {
  private baseHeaders: AxiosHeaders;
  private baseUrl = "https://api.brawlstars.com/v1";

  public readonly players: Players;
  public readonly clubs: Clubs;
  public readonly brawlers: Brawlers;
  public readonly events: Events;
  public readonly rankings: Rankings;
  public readonly icons: Icons;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error("NO BRAWL_API_KEY PROVIDED ");
    this.baseHeaders = new AxiosHeaders({
      Authorization: `Bearer ${apiKey}`,
    });
    this.players = new Players(this);
    this.clubs = new Clubs(this);
    this.brawlers = new Brawlers(this);
    this.events = new Events(this);
    this.rankings = new Rankings(this);
    this.icons = new Icons(this);
  }

  static getDefaultErrorText(what: string) {
    return `Unexpected error while processing ${what}`;
  }

  getHeaders() {
    return this.baseHeaders;
  }

  getUrl() {
    return this.baseUrl;
  }
}

const { bwarlstars_api_key } = environments;
export const brawlStarsService = new BrawlStarsService(bwarlstars_api_key);
