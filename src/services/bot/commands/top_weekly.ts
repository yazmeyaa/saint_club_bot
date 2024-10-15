import { brawlStarsService } from "@services/brawl-stars/api";
import { userService } from "@services/user";
import { Composer } from "telegraf";
import { TopDailyPayload } from "../templates/types";
import { textTemplates } from "../templates";
import { CommandType } from ".";

export const topWeeklyCommand: CommandType = Composer.command(
  /^top_week/,
  async (ctx) => {
    let club: string | null = null;

    if (!ctx.args.includes("all")) {
      const user = await userService.getOrCreateUser(ctx.message.from.id);
      if (user.player_tag === null) return;
      const player = await brawlStarsService.players.getPlayerInfo(
        user.player_tag
      );
      if (!player || !player.club) return;
      club = player.club.tag;
    }

    const users = await userService.getTopUser(10, "week", club);

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
      type: "TOP_WEEKLY",
      payload: {
        players: data,
      },
    });
    await ctx.react("👍");
    return ctx.reply(msg);
  }
);
