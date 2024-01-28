import {
  checkIsAdmin,
  isValidPlayerTag,
  transformClubMembers,
} from "@services/bot/helpers";
import { Composer, Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import {
  CANNOT_GET_PROFILE_DATA_MESSAGE,
  COMMAND_EXECUTED_MESSAGE,
  COMMAND_NOT_EXECUTE_MESSAGE,
  INVALID_TAG_MESSAGE,
  NOT_FOUND_USER_MESSAGE,
  NOT_LINKED_USER_MESSAGE,
  NO_REPLY_TARGET_MESSAGE,
} from "./consts";
import { User } from "@orm/models/User";
import { brawlStarsService } from "@services/brawl-stars/api";
import { UserDao } from "@orm/dao/UserDao";
import { userService } from "@services/user";
import { textTemplates } from "../templates";
import { LogsObject, TopDailyPayload } from "../templates/types";
import { renderFile } from "template-file";
import htmlToImage from "node-html-to-image";

const userDao = new UserDao();

export const brawlStarsComposer: Composer<Context<Update>> = new Composer();

brawlStarsComposer.command(/^link/, async (ctx) => {
  const [playerTag] = ctx.args;

  const isAdminRequest = await checkIsAdmin(ctx.update.message.from.id);
  if (!isAdminRequest) return;

  if (!isValidPlayerTag(playerTag)) {
    return ctx.reply(INVALID_TAG_MESSAGE);
  }

  //forum_topic_created
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
    console.error(err);
    ctx.reply(COMMAND_NOT_EXECUTE_MESSAGE);
  }
});

brawlStarsComposer.command(/^unlink/, async (ctx) => {
  const isAdminRequest = await checkIsAdmin(ctx.update.message.from.id);
  if (!isAdminRequest) return;

  const target_id = ctx.message.reply_to_message?.from?.id;
  if (!target_id) return ctx.reply(NO_REPLY_TARGET_MESSAGE);
  await userService.removePlayerTag(target_id);

  ctx.reply("ok");
});

brawlStarsComposer.command(/^profile/, async (ctx) => {
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

  const user = await userDao.getOrCreateUser(target_id);

  if (!user) return ctx.reply(NOT_FOUND_USER_MESSAGE);
  if (user.player_tag === null) return ctx.reply(NOT_LINKED_USER_MESSAGE);

  const playerData = await brawlStarsService.players.getPlayerInfo(
    user.player_tag
  );

  if (!playerData) return ctx.reply(NOT_FOUND_USER_MESSAGE);

  const logs: LogsObject = {
    trophyChange25: 0,
    trophyChangeDay: playerData.trophies - user.trophies.day,
    trophyChangeWeek: playerData.trophies - user.trophies.week,
    trophyChangeMonth: playerData.trophies - user.trophies.month,
  };
  try {
    const icon = await brawlStarsService.icons.getProfileIconUrl(playerData);
    const text = await textTemplates.getTemplate({
      type: "PROFILE",
      payload: {
        ...playerData,
        ...logs,
        mystery_points: user.mystery_points,
      },
    });

    if (icon) {
      return ctx.replyWithPhoto(icon, {
        caption: text,
        parse_mode: "Markdown",
      });
    } else {
      ctx.reply(text, {
        parse_mode: "Markdown",
      });
    }
  } catch (err) {
    console.error(err);
    return ctx.reply(CANNOT_GET_PROFILE_DATA_MESSAGE);
  }
});

brawlStarsComposer.command(/^me/, async (ctx) => {
  const telegram_id = ctx.update.message.from.id;

  const user = await userService.getOrCreateUser(telegram_id);

  if (!user) return ctx.reply(NOT_FOUND_USER_MESSAGE);
  if (user.player_tag === null) return ctx.reply(NOT_LINKED_USER_MESSAGE);

  try {
    const playerData = await brawlStarsService.players.getPlayerInfo(
      user.player_tag
    );
    if (!playerData) return ctx.reply(NOT_FOUND_USER_MESSAGE);

    const logs: LogsObject = {
      trophyChange25: 0,
      trophyChangeDay: playerData.trophies - user.trophies.day,
      trophyChangeWeek: playerData.trophies - user.trophies.week,
      trophyChangeMonth: playerData.trophies - user.trophies.month,
    };

    const text = await textTemplates.getTemplate({
      type: "PROFILE",
      payload: {
        ...playerData,
        ...logs,
        mystery_points: user.mystery_points,
      },
    });

    const icon = await brawlStarsService.icons.getProfileIconUrl(playerData);
    if (icon) {
      return ctx.replyWithPhoto(icon, {
        caption: text,
        parse_mode: "Markdown",
      });
    } else {
      ctx.reply(text, {
        parse_mode: "Markdown",
      });
    }
  } catch (err) {
    console.error(err);
    return ctx.reply(CANNOT_GET_PROFILE_DATA_MESSAGE);
  }
});

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
