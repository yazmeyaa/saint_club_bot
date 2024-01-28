import axios from "axios";
import { BrawlStarsService } from "./service";
import { Player } from "@services/brawl-stars/api/types";
import { logger } from "@helpers/logs";

type PlayerIcons = Record<number, PlayerIcon>;

interface PlayerIcon {
  brawler: number | null;
  id: number;
  imageUrl: string;
  imageUrl2: string;
  isAvailableForOffers: boolean;
  isReward: boolean;
  name: string;
  name2: string;
  requiredTotalTrophies: number;
  sortOrder: number;
}

type ClubIcons = Record<number, ClubIcon>;

interface ClubIcon {
  id: number;
  imageUrl: string;
}

type IconsResponseType = {
  player: PlayerIcons;
  club: ClubIcons;
};

export class Icons {
  root: BrawlStarsService;
  iconListUrl = "https://api.brawlapi.com/v1/icons";

  constructor(root: BrawlStarsService) {
    this.root = root;
  }

  public async getIconsList(): Promise<IconsResponseType | null> {
    try {
      const request = await axios.get<IconsResponseType>(this.iconListUrl);
      return request.data;
    } catch (err) {
      if (err instanceof Error) {
        logger.error(err.message);
      } else {
        logger.error(BrawlStarsService.getDefaultErrorText("get rotation"));
      }

      return null;
    }
  }

  public async getProfileIconUrl(profile: Player): Promise<string | null> {
    const response = await this.getIconsList();
    if (!response) return null;
    const icon = response.player[Number(profile.icon.id)];
    return icon.imageUrl ?? icon.imageUrl2 ?? null;
  }
}
