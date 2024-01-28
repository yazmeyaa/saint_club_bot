import { userService } from "@services/user";
import { Composer, Context } from "telegraf";
import {
  CANNOT_GET_PROFILE_DATA_MESSAGE,
  NOT_FOUND_USER_MESSAGE,
  NOT_LINKED_USER_MESSAGE,
} from "./consts";
import { Update } from "telegraf/typings/core/types/typegram";
import { getProfileData } from "../helpers";

export const meCommandComposer: Composer<Context<Update>> = new Composer();

meCommandComposer.command(/^me/, async (ctx) => {
  const telegram_id = ctx.update.message.from.id;

  const user = await userService.getOrCreateUser(telegram_id);

  if (!user) return ctx.reply(NOT_FOUND_USER_MESSAGE);
  if (user.player_tag === null) return ctx.reply(NOT_LINKED_USER_MESSAGE);

  try {
    const profileData = await getProfileData(user);

    if (!profileData) return ctx.reply(CANNOT_GET_PROFILE_DATA_MESSAGE);
    const { icon, textMsg } = profileData;

    if (icon) {
      return ctx.replyWithPhoto(icon, {
        caption: textMsg,
        parse_mode: "Markdown",
      });
    } else {
      ctx.reply(textMsg, {
        parse_mode: "Markdown",
      });
    }
  } catch (err) {
    console.error(err);
    return ctx.reply(CANNOT_GET_PROFILE_DATA_MESSAGE);
  }
});
