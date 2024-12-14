import { Composer, Context, MiddlewareFn } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { meCommand } from "./me";
import { profileCommand } from "./profile";
import { linkCommand } from "./link";
import { unlinkCommand } from "./unlink";
import { clubListCommand } from "./club_list";
import { topDailyCommand } from "./top_daily";
import { getTopMysteryPlayers } from "./get_top_mystery_points";
import { topWeeklyCommand } from "./top_weekly";
import { trophiesChangeWeekCommand } from "./trophies_change_week";
import { addBallCommand } from "./add_mystery";
import { addTitleCommand } from "./add_title";
import { trophiesChangeMonthCommand } from "./trophies_change_month";
import { trophiesChangeYearCommand } from "./trophies_change_year";

export const brawlStarsComposer: Composer<Context<Update>> = new Composer();
export type CommandType = MiddlewareFn<Context<Update>>;

brawlStarsComposer.use(
  profileCommand,
  meCommand,
  linkCommand,
  unlinkCommand,
  clubListCommand,
  topDailyCommand,
  getTopMysteryPlayers,
  topWeeklyCommand,
  trophiesChangeWeekCommand,
  addBallCommand,
  addTitleCommand,
  trophiesChangeMonthCommand,
  trophiesChangeYearCommand,
);
