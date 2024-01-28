import axios, { AxiosRequestConfig } from "axios";
import { BrawlStarsService } from "./service";
import { BrawlStarsClub } from "@services/brawl-stars/api/types";
import { ClubMemberListReponseType } from "@services/brawl-stars/api/types/club";
import { logger } from "@helpers/logs";

export type GetClanMembersOptions = {
  before?: string;
  after?: string;
  limit?: string;
};

const endpoints = {
  getClanMembers: (clubTag: string) => {
    const tag = encodeURIComponent(clubTag);
    return `/clubs/${tag}/members`;
  },
  getClubInfo: (clubTag: string) => {
    const tag = encodeURIComponent(clubTag);
    return `/clubs/${tag}`;
  },
} as const;

class Clubs {
  root: BrawlStarsService;

  constructor(root: BrawlStarsService) {
    this.root = root;
  }

  private getDefaultError(what: string) {
    return `Unexpected error while processing ${what}`;
  }

  public async getClanInfo(clubTag: string): Promise<BrawlStarsClub | null> {
    try {
      const url = this.root.getUrl() + endpoints.getClubInfo(clubTag);

      const config: AxiosRequestConfig = {
        headers: this.root.getHeaders(),
      };

      const response = await axios.get<BrawlStarsClub>(url, config);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message);
      } else {
        logger.error(this.getDefaultError("club info"));
      }
      return null;
    }
  }

  public async getClanMembers(
    clubTag: string,
    options?: GetClanMembersOptions
  ): Promise<ClubMemberListReponseType | null> {
    const url = this.root.getUrl() + endpoints.getClanMembers(clubTag);
    const params = new URLSearchParams(options);
    const requestOptions: AxiosRequestConfig = {
      headers: this.root.getHeaders(),
      params,
    };

    try {
      const response = await axios.get<ClubMemberListReponseType>(
        url,
        requestOptions
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message);
      }

      logger.error(this.getDefaultError("club members"))

      return null;
    }
  }
}

export { Clubs };
