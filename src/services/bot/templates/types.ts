import type { Data } from "template-file";

export interface LogsObject {
  trophyChange25: number;
  trophyChangeDay: number;
  trophyChangeWeek: number;
  trophyChangeMonth: number;
}

export interface TemplateType<T extends Data> {
  type: string;
  payload: T;
}

export type ProfilePayload = {
  name: string;
  tag: string;
  expLevel: number;
  expPoints: number;
  club: {
    name: string;
    tag: string;
  };
  trophies: number;
  highestTrophies: number;
  trophyChange25: number;
  trophyChangeDay: number;
  trophyChangeWeek: number;
  trophyChangeMonth: number;
  mystery_points: number;

  "3vs3Victories": number;
  soloVictories: number;
  duoVictories: number;
};

export interface ProfileTemplate extends TemplateType<ProfilePayload> {
  type: "PROFILE";
}

export type TopDailyPayload = {
  players: Array<{
    index: number;
    name: string;
    trophyChange: number;
  }>;
};

export interface TopDailyTemplate extends TemplateType<TopDailyPayload> {
  type: "TOP_DAILY";
}

export type ClubListPayload = {
  club: {
    name: string;
    trophies: number;
  };
  members: Array<{
    name: string;
    tag: string;
  }>;
};

export interface ClubListTemplate extends TemplateType<ClubListPayload> {
  type: "CLUB_LIST";
}

export type TemplateInterface =
  | ProfileTemplate
  | TopDailyTemplate
  | ClubListTemplate;
export type TemplateKind = TemplateInterface["type"];
