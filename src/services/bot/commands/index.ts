import { Composer, Context, MiddlewareFn } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { meCommand } from "./me";
import { profileCommand } from "./profile";
import { linkCommand } from "./link";
import { unlinkCommand } from "./unlink";
import { clubListCommand } from "./club_list";
import { topDailyCommand } from "./top_daily";
import { eventsCommand } from "./events";
import { getTopMysteryPlayers } from "./get_top_mystery_points";
import { topWeeklyCommand } from "./top_weekly";

export const brawlStarsComposer: Composer<Context<Update>> = new Composer();
export type CommandType = MiddlewareFn<Context<Update>>;

brawlStarsComposer.use(
  profileCommand,
  meCommand,
  linkCommand,
  unlinkCommand,
  clubListCommand,
  topDailyCommand,
  eventsCommand,
  getTopMysteryPlayers,
  topWeeklyCommand
);
