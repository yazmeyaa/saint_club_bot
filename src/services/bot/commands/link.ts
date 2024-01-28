import { Composer, Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { checkIsAdmin, isValidPlayerTag } from "../helpers";
import {
  COMMAND_EXECUTED_MESSAGE,
  COMMAND_NOT_EXECUTE_MESSAGE,
  INVALID_TAG_MESSAGE,
  NO_REPLY_TARGET_MESSAGE,
} from "./consts";
import { userService } from "@services/user";
import { logger } from "@helpers/logs";

export const linkCommandComposer: Composer<Context<Update>> = new Composer();

linkCommandComposer.command(/^link/, async (ctx) => {
  const [playerTag] = ctx.args;

  const isAdminRequest = await checkIsAdmin(ctx.update.message.from.id);
  if (!isAdminRequest) return;

  if (!isValidPlayerTag(playerTag)) {
    return ctx.reply(INVALID_TAG_MESSAGE);
  }

  if (
    typeof ctx.update.message === "undefined" ||
    typeof ctx.update.message.reply_to_message === "undefined" ||
    typeof ctx.update.message.reply_to_message.from === "undefined" ||
    "forum_topic_created" in ctx.update.message.reply_to_message
  ) {
    return ctx.reply(NO_REPLY_TARGET_MESSAGE);
  }

  const targetId = ctx.update.message.reply_to_message.from.id;

  try {
    const user = await userService.getOrCreateUser(targetId);
    user.player_tag = playerTag;
    await user.save();
    await userService.updateUserTrophies(user);

    ctx.reply(COMMAND_EXECUTED_MESSAGE);
  } catch (err) {
    logger.error(err);
    ctx.reply(COMMAND_NOT_EXECUTE_MESSAGE);
  }
});
