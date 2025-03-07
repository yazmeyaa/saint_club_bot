import { userService } from "@services/user";
import { Composer } from "telegraf";
import { NOT_FOUND_USER_MESSAGE, NOT_LINKED_USER_MESSAGE } from "./consts";
import { transformClubMembers } from "../helpers";
import { textTemplates } from "../templates";
import { CommandType } from ".";

export const clubListCommand: CommandType = Composer.command(
  /^club_list/,
  async (ctx) => {
    const telegram_id = ctx.update.message.from.id.toString();
    const user = await userService.getOrCreateUser(telegram_id);

    if (!user) return ctx.reply(NOT_FOUND_USER_MESSAGE);
    if (!user.player_tag) return ctx.reply(NOT_LINKED_USER_MESSAGE);

    const [clubData, members] = await Promise.all([
      userService.getUserClubInfo(telegram_id),
      userService.getUserClubMembers(telegram_id),
    ]);

    if (!members || !clubData) {
      return ctx.reply("Пользователь не состоит в клубе");
    }

    const clubMembersPayload = await transformClubMembers(members);

    const msg = await textTemplates.getTemplate({
      type: "CLUB_LIST",
      payload: {
        club: clubData,
        members: clubMembersPayload,
      },
    });
    await ctx.react("👍");
    return ctx.reply(msg, { parse_mode: "Markdown" });
  }
);
