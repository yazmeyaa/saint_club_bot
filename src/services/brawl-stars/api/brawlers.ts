import {
  BaseBrawler,
  BrawlersResponseType,
} from "@services/brawl-stars/api/types/player";
import { BrawlStarsService } from "./service";
import axios from "axios";
import { logger } from "@helpers/logs";

class Brawlers {
  root: BrawlStarsService;

  constructor(root: BrawlStarsService) {
    this.root = root;
  }

  public async getBrawlersList(): Promise<BrawlersResponseType | null> {
    const url = encodeURI(this.root.getUrl() + "/brawlers");
    try {
      const response = await axios.get<BrawlersResponseType>(url, {
        headers: this.root.getHeaders(),
      });
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        logger.error(err.message);
      } else {
        logger.error(
          "Unexpected error while getting brawlers list (BrawlStarsApi.brawlers"
        );
      }
      return null;
    }
  }
}

export { Brawlers };
