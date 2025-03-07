import { Composer } from "telegraf";
import { CommandType } from ".";
import { checkIsAdmin } from "../helpers";
import { NO_REPLY_TARGET_MESSAGE } from "./consts";
import { userService } from "@services/user";

export const addBallCommand: CommandType = Composer.command(
  /^add_ball/,
  async (ctx) => {
    const isAdminRequest = await checkIsAdmin(ctx.update.message.from.id.toString());
    if (!isAdminRequest) {
      await ctx.react("🖕");
      return;
    }

    const target_id = ctx.message.reply_to_message?.from?.id.toString();
    if (!target_id) return ctx.reply(NO_REPLY_TARGET_MESSAGE);

    const user = await userService.getOrCreateUser(target_id);

    await userService.addMysteryPoint(user);

    await ctx.react("👍");
    await ctx.reply("Отлично! Добавлено +1 🔮");
  }
);
