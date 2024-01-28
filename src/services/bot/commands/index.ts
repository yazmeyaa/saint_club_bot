import { transformClubMembers } from "@services/bot/helpers";
import { Composer, Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { NOT_FOUND_USER_MESSAGE, NOT_LINKED_USER_MESSAGE } from "./consts";
import { User } from "@orm/models/User";
import { brawlStarsService } from "@services/brawl-stars/api";
import { userService } from "@services/user";
import { textTemplates } from "../templates";
import { TopDailyPayload } from "../templates/types";
import { renderFile } from "template-file";
import htmlToImage from "node-html-to-image";
import { meCommandComposer } from "./me";
import { profileCommandComposer } from "./profile";
import { linkCommandComposer } from "./link";
import { unlinkCommandComposer } from "./unlink";

export const brawlStarsComposer: Composer<Context<Update>> = new Composer();

brawlStarsComposer.use(linkCommandComposer);
brawlStarsComposer.use(unlinkCommandComposer);
brawlStarsComposer.use(profileCommandComposer);
brawlStarsComposer.use(meCommandComposer);

brawlStarsComposer.command(/^club_list/, async (ctx) => {
  const telegram_id = ctx.update.message.from.id;
  const user = await User.findOne({ where: { telegram_id } });

  if (!user) return ctx.reply(NOT_FOUND_USER_MESSAGE);
  if (!user.player_tag) return ctx.reply(NOT_LINKED_USER_MESSAGE);

  const [clubData, members] = await Promise.all([
    userService.getUserClubInfo(telegram_id),
    userService.getUserClubMembers(telegram_id),
  ]);

  if (!members || !clubData) {
    return ctx.reply("Пользователь не состоит в клубе");
  }

  const clubMembersPayload = await transformClubMembers(members);

  const msg = await textTemplates.getTemplate({
    type: "CLUB_LIST",
    payload: {
      club: clubData,
      members: clubMembersPayload,
    },
  });

  return ctx.reply(msg, { parse_mode: "Markdown" });
});

brawlStarsComposer.command(/^top_daily/, async (ctx) => {
  const users = await userService.getTopUser(5, "day");

  if (!users) return ctx.reply("Не удалось получить список пользователей");

  const _data = await Promise.all(
    users.map(async (item, index) => {
      const profileData = await brawlStarsService.players.getPlayerInfo(
        item.user.player_tag!
      );

      if (!profileData) return null;
      return {
        index: index + 1,
        name: profileData.name,
        trophyChange: item.trophyChanges,
      };
    })
  );

  const data = _data.filter(Boolean) as TopDailyPayload["players"];

  const msg = await textTemplates.getTemplate({
    type: "TOP_DAILY",
    payload: {
      players: data,
    },
  });

  return ctx.reply(msg);
});

brawlStarsComposer.command(/^events/, async (ctx) => {
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
});
