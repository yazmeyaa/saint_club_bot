import { brawlStarsService } from "@services/brawl-stars/api";
import { userService } from "@services/user";
import { Composer } from "telegraf";
import { TopDailyPayload } from "../templates/types";
import { textTemplates } from "../templates";
import { CommandType } from ".";

export const topDailyCommand: CommandType = Composer.command(
  /^top_daily/,
  async (ctx) => {
    const users = await userService.getTopUser(5, "day");

    if (!users) return ctx.reply("Не удалось получить список пользователей");

    const _data = await Promise.all(
      users.map(async (item, index) => {
        const profileData = await brawlStarsService.players.getPlayerInfo(
          item.user.player_tag!
        );

        if (!profileData) return null;
        return {
          index: index + 1,
          name: profileData.name,
          trophyChange: item.trophyChanges,
        };
      })
    );

    const data = _data.filter(Boolean) as TopDailyPayload["players"];

    const msg = await textTemplates.getTemplate({
      type: "TOP_DAILY",
      payload: {
        players: data,
      },
    });
    ctx.react("👍");
    return ctx.reply(msg);
  }
);
