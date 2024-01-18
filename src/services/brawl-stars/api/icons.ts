import axios from "axios";
import { BrawlStarsService } from "./service";
import { Player } from "@services/brawl-stars/api/types";

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

  public async getIconsList(): Promise<IconsResponseType> {
    const request = await axios.get<IconsResponseType>(this.iconListUrl);
    return request.data;
  }

  public async getProfileIconUrl(profile: Player): Promise<string | null> {
    const response = await this.getIconsList();
    const icon = response.player[Number(profile.icon.id)];
    console.log({ icon });
    return icon.imageUrl ?? icon.imageUrl2 ?? null;
  }
}
