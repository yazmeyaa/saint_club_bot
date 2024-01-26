import { TemplateKind } from "./types";

export const TEMPALTE_PATHES: Record<TemplateKind, string> = {
  PROFILE: "profile.template",
  TOP_DAILY: "top_daily.template",
  CLUB_LIST: "club_list.template"
} as const;
