import { Composer } from "telegraf";
import { CommandType } from ".";
import { userService } from "@services/user";
import { NOT_FOUND_USER_MESSAGE, NOT_LINKED_USER_MESSAGE } from "./consts";
import { textTemplates } from "../templates";
import { TrophiesRecordsService } from "@services/trophies-records";
import { TrophyChangeWeekPayload } from "../templates/types";

export const trophiesChangeWeekCommand: CommandType = Composer.command(
  /^trophies_change_week/,
  async (ctx) => {
    const telegram_id = ctx.update.message.from.id;

    const user = await userService.getOrCreateUser(telegram_id);

    if (!user) return ctx.reply(NOT_FOUND_USER_MESSAGE);
    if (user.player_tag === null) return ctx.reply(NOT_LINKED_USER_MESSAGE);
    const trophiesRecords = TrophiesRecordsService.getInstance();

    const rawRecords = await trophiesRecords.getRecords(user.player_tag, 7);
    const records: TrophyChangeWeekPayload["records"] = rawRecords.map(
      (rec, idx) => {
        return {
          index: idx + 1,
          date: rec.date.toLocaleDateString("ru"),
          trophies: rec.trophies,
        };
      }
    );

    const textTemplate = await textTemplates.getTemplate({
      type: "TROPHY_CHANGE_WEEK",
      payload: { records },
    });

    await ctx.react("👍");
    await ctx.reply(textTemplate);
  }
);
