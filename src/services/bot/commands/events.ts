import { Composer } from "telegraf";
import { CommandType } from ".";
import { brawlStarsService } from "@services/brawl-stars/api";
import { renderFile } from "template-file";
import htmlToImage from "node-html-to-image";

export const eventsCommand: CommandType = Composer.command(
  /^events/,
  async (ctx) => {
    try {
      const events = await brawlStarsService.events.getEventsBrawlify();
      if (!events) return ctx.reply("Не удалось получить список событий!");

      const mapsPayload = events.active.map((event) => {
        return {
          bgColor: event.map.gameMode.bgColor,
          color: event.map.gameMode.color,
          eventName: event.map.gameMode.name,
          mapName: event.map.name,
          mapImgSrc: event.map.imageUrl,
        };
      });

      const html = await renderFile("./public/htmlTemplates/events.html", {
        maps: mapsPayload,
      });
      const image = await htmlToImage({
        html,
        quality: 100,
        type: "png",
        puppeteerArgs: {
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
      });

      if (image instanceof Buffer)
        ctx.sendPhoto({
          source: image,
        });
    } catch (error) {
      console.log(error);
    }
  }
);
