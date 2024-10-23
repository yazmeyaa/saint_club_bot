import { Composer } from "telegraf";
import { CommandType } from ".";
import { checkIsAdmin } from "../helpers";
import { UserTitleService } from "@services/user-title";
import { AppDataSource } from "@orm/data-source";
import { UserTitle } from "@orm/models/UserTitle";

export const addTitleCommand: CommandType = Composer.command(
  /^add_title/,
  async (ctx) => {
    const isAdminRequest = await checkIsAdmin(ctx.update.message.from.id);
    if (!isAdminRequest) {
      await ctx.react("🖕");
      return;
    }

    AppDataSource.getRepository(UserTitle).find().then(console.log);

    const [title, needBallsArg] = ctx.args;
    if (typeof title !== "string" || title.length <= 0) {
      await ctx.react("💩");
      await ctx.reply("Не введено название титула.");
      return;
    }

    const needBalls = parseInt(needBallsArg);
    if (Number.isNaN(needBalls) || needBalls < 0) {
      await ctx.react("💩");
      await ctx.reply("Неверный формат необходимого количества 🔮");
      return;
    }

    const titleService = UserTitleService.getInstance();
    try {
      const createdTitile = await titleService.createTitle(needBalls, title);

      await ctx.react("👍");
      await ctx.reply(`Добавлен новый титул: "${createdTitile.title}"!`);
    } catch (error) {
      if (error instanceof Error) {
        await ctx.react("💩");
        await ctx.reply(`Ошибка во время создания титула: ${error.message}`);
      } else {
        await ctx.react("💩");
        await ctx.reply(`Произошла непредвиденная ошибка.`);
      }
    }
  }
);
