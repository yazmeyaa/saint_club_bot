import { Composer } from "telegraf";
import { CommandType } from ".";
import { userService } from "@services/user";
import { NOT_FOUND_USER_MESSAGE, NOT_LINKED_USER_MESSAGE } from "./consts";
import { textTemplates } from "../templates";
import {
  ChartSizeType,
  TrophiesRecordsService,
} from "@services/trophies-records";
import { TrophyChangePayload } from "../templates/types";

export const trophiesChangeMonthCommand: CommandType = Composer.command(
  /^trophies_change_month/,
  async (ctx) => {
    const telegram_id = ctx.update.message.from.id.toString();
    const [size = "desktop"] = ctx.args;

    if (!["desktop", "mobile"].includes(size)) {
      await ctx.react("💩");
      await ctx.reply(
        'Неверный формат изображения. Ожидается "desktop" или "mobile".'
      );
    }

    const user = await userService.getOrCreateUser(telegram_id);

    if (!user) return ctx.reply(NOT_FOUND_USER_MESSAGE);
    if (user.player_tag === null) return ctx.reply(NOT_LINKED_USER_MESSAGE);
    const trophiesRecords = TrophiesRecordsService.getInstance();

    const rawRecords = await trophiesRecords.getRecords(user.player_tag, 30);
    if (rawRecords.length === 0) {
      await ctx.react("🤷‍♂");
      await ctx.reply("Записей не найдено. Попробуй завтра.");
      return;
    }

    const records: TrophyChangePayload["records"] = rawRecords.map(
      (rec, idx, arr) => {
        const prev = arr[idx - 1];
        const diff = prev ? rec.trophies - prev.trophies : 0;
        return {
          index: idx + 1,
          date: rec.date.toLocaleDateString("ru"),
          trophies: rec.trophies,
          diff: diff > 0 ? `+${diff}` : diff.toString(),
        };
      }
    );

    const textTemplate = await textTemplates.getTemplate({
      type: "TROPHY_CHANGE_MONTH",
      payload: { records },
    });

    const chartBuff = trophiesRecords.generateChart(
      rawRecords,
      size as ChartSizeType
    );
    await ctx.react("👍");
    await ctx.replyWithPhoto({ source: chartBuff }, { caption: textTemplate });
  }
);
