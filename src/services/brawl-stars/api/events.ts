import {
  BrawlifyEventsResponse,
  SheduledEvents,
} from "@services/brawl-stars/api/types/rotation";
import { BrawlStarsService } from "./service";
import axios from "axios";
import { logger } from "@helpers/logs";

class Events {
  root: BrawlStarsService;

  constructor(root: BrawlStarsService) {
    this.root = root;
  }

  public async getRotation(): Promise<SheduledEvents | null> {
    const url = this.root.getUrl() + "/events/rotation";

    try {
      const request = await axios.get<SheduledEvents>(url, {
        headers: this.root.getHeaders(),
      });
      return request.data;
    } catch (err) {
      if (err instanceof Error) {
        logger.error(err.message);
      } else {
        logger.error(BrawlStarsService.getDefaultError("get rotation"));
      }

      return null;
    }
  }

  public async getEventsBrawlify(): Promise<BrawlifyEventsResponse | null> {
    const url = "https://api.brawlapi.com/v1/events";
    try {
      const request = await axios.get<BrawlifyEventsResponse>(url);

      return request.data;
    } catch (err) {
      if (err instanceof Error) {
        logger.error(err.message);
      } else {
        logger.error(BrawlStarsService.getDefaultError("get rotation"));
      }

      return null;
    }
  }
}

export { Events };
