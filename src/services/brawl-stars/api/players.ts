import axios, { AxiosRequestConfig } from "axios";
import { Player } from "@services/brawl-stars/api/types/player";
import { BrawlStarsService } from "./service";
import { BattleLogResponse } from "@services/brawl-stars/api/types";
import { logger } from "@helpers/logs";

class Players {
  private root: BrawlStarsService;
  private baseUrl: string;
  constructor(root: BrawlStarsService) {
    this.root = root;
    this.baseUrl = root.getUrl() + "/players/";
  }

  public async getPlayerInfo(playerTag: string): Promise<Player | null> {
    const config: AxiosRequestConfig = {
      headers: this.root.getHeaders(),
    };
    const url = this.baseUrl + `${encodeURIComponent(playerTag)}`;

    try {
      const response = await axios.get<Player>(url, config);

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message);
      } else {
        logger.error(BrawlStarsService.getDefaultErrorText("get player info"));
      }

      return null;
    }
  }

  public async getPlayerBattleLog(
    playerTag: string
  ): Promise<BattleLogResponse | null> {
    const config: AxiosRequestConfig = {
      headers: this.root.getHeaders(),
    };
    const url = this.baseUrl + `${encodeURIComponent(playerTag)}/battlelog`;

    try {
      const response = await axios.get<BattleLogResponse>(url, config);

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error: ${error.message}`);
      } else {
        logger.error(
          BrawlStarsService.getDefaultErrorText("get player battle log")
        );
      }
      return null;
    }
  }
}

export { Players };
