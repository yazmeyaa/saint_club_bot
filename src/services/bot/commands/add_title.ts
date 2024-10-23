import { Composer } from "telegraf";
import { CommandType } from ".";
import { checkIsAdmin } from "../helpers";
import { UserTitleService } from "@services/user-title";

export const addTitleCommand: CommandType = Composer.command(
  /^add_title/,
  async (ctx) => {
    const isAdminRequest = await checkIsAdmin(ctx.update.message.from.id);
    if (!isAdminRequest) {
      await ctx.react("🖕");
      return;
    }

    const [title, needBallsArg] = ctx.args;
    if (typeof title !== "string" || title.length <= 0) {
      await ctx.react("💩");
      await ctx.reply("Не введено название титула.");
      return;
    }

    const needBalls = parseInt(needBallsArg);
    if (Number.isNaN(needBalls) || needBalls <= 0) {
      await ctx.react("💩");
      await ctx.reply("Неверный формат необходимого количества 🔮");
    }
    const titleService = UserTitleService.getInstance();
    const createdTitile = await titleService.createTitle(needBalls, title);

    await ctx.react("👍");
    await ctx.reply(`Добавлен новый титул: "${createdTitile.title}"!`);
  }
);
