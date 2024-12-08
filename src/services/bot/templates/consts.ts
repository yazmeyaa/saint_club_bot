import { TemplateKind } from "./types";

export const TEMPALTE_PATHES: Record<TemplateKind, string> = {
  PROFILE: "profile.template",
  TOP_DAILY: "top_daily.template",
  CLUB_LIST: "club_list.template",
  TOP_MYSTERY: "top_mystery.template",
  TOP_WEEKLY: "top_weekly.template",
  TROPHY_CHANGE_WEEK: "trophy_change_week.template",
  TROPHY_CHANGE_MONTH: "trophy_change_month.template",
  TROPHY_CHANGE_YEAR: "trophy_change_year.template"
} as const;
