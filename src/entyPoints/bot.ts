import { logger } from "@helpers/logs";
import { bot } from "@services/bot";
import { brawlStarsComposer } from "@services/bot/commands";

export async function initBot() {
  bot.use(brawlStarsComposer);
  bot.catch(async (error, ctx) => {
    await ctx.react("💩");
    await ctx.reply(
      `Произошла ошибка во время выполнения команды.\n${
        (error as Error).message
      }`
    );
    console.log(error);
    logger.error((error as Error).message);
  });
  bot.launch();
}
