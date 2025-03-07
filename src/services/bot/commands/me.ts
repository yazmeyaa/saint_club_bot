import { userService } from "@services/user";
import { Composer } from "telegraf";
import {
  CANNOT_GET_PROFILE_DATA_MESSAGE,
  NOT_FOUND_USER_MESSAGE,
  NOT_LINKED_USER_MESSAGE,
} from "./consts";
import { getProfileData } from "../helpers";
import { CommandType } from ".";

export const meCommand: CommandType = Composer.command(/^me/, async (ctx) => {
  const telegram_id = ctx.update.message.from.id;

  const user = await userService.getOrCreateUser(telegram_id.toString());

  if (!user) return ctx.reply(NOT_FOUND_USER_MESSAGE);
  if (user.player_tag === null) return ctx.reply(NOT_LINKED_USER_MESSAGE);

  try {
    const profileData = await getProfileData(user);

    if (!profileData) return ctx.reply(CANNOT_GET_PROFILE_DATA_MESSAGE);
    const { icon, textMsg } = profileData;

    if (icon) {
      await ctx.react("👍");
      return ctx.replyWithPhoto(icon, {
        caption: textMsg,
        parse_mode: "Markdown",
      });
    } else {
      await ctx.react("👍");
      ctx.reply(textMsg, {
        parse_mode: "Markdown",
      });
    }
  } catch (err) {
    await ctx.react("💩");
    console.error(err);
    return ctx.reply(CANNOT_GET_PROFILE_DATA_MESSAGE);
  }
});
