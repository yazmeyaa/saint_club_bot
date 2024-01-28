import { Composer } from "telegraf";
import { checkIsAdmin } from "../helpers";
import { NO_REPLY_TARGET_MESSAGE } from "./consts";
import { userService } from "@services/user";
import { CommandType } from ".";

export const unlinkCommand: CommandType = Composer.command(
  /^unlink/,
  async (ctx) => {
    const isAdminRequest = await checkIsAdmin(ctx.update.message.from.id);
    if (!isAdminRequest) return;

    const target_id = ctx.message.reply_to_message?.from?.id;
    if (!target_id) return ctx.reply(NO_REPLY_TARGET_MESSAGE);
    await userService.removePlayerTag(target_id);

    ctx.reply("ok");
  }
);
