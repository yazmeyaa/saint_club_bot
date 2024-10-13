import { userService } from "@services/user";
import { Composer } from "telegraf";
import {
  CANNOT_GET_PROFILE_DATA_MESSAGE,
  NOT_FOUND_USER_MESSAGE,
  NOT_LINKED_USER_MESSAGE,
  NO_REPLY_TARGET_MESSAGE,
} from "./consts";
import { getProfileData } from "../helpers";
import { CommandType } from ".";
import { logger } from "@helpers/logs";

export const profileCommand: CommandType = Composer.command(
  /^profile/,
  async (ctx) => {
    const target_id = ctx.update.message.reply_to_message?.from?.id;
    if (
      typeof ctx.update.message === "undefined" ||
      typeof ctx.update.message.reply_to_message === "undefined" ||
      typeof ctx.update.message.reply_to_message.from === "undefined" ||
      "forum_topic_created" in ctx.update.message.reply_to_message ||
      !target_id
    ) {
      return ctx.reply(NO_REPLY_TARGET_MESSAGE);
    }

    const user = await userService.getOrCreateUser(target_id);

    if (!user) return ctx.reply(NOT_FOUND_USER_MESSAGE);
    if (user.player_tag === null) return ctx.reply(NOT_LINKED_USER_MESSAGE);

    try {
      const profileData = await getProfileData(user);

      if (!profileData) return ctx.reply(CANNOT_GET_PROFILE_DATA_MESSAGE);
      const { icon, textMsg } = profileData;

      if (icon) {
        ctx.react("👍");
        return ctx.replyWithPhoto(icon, {
          caption: textMsg,
          parse_mode: "Markdown",
        });
      } else {
        ctx.react("👍");
        ctx.reply(textMsg, {
          parse_mode: "Markdown",
        });
      }
    } catch (err) {
      logger.error(err);
      return ctx.reply(CANNOT_GET_PROFILE_DATA_MESSAGE);
    }
  }
);
