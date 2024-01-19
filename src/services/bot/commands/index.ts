import {
  checkIsAdmin,
  getTrophyChange,
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
import { templatesBS } from "@services/brawl-stars/message_templates";
import { UserDao } from "@orm/dao/UserDao";

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
    const user = await userDao.getOrCreateUser(targetId);
    user.player_tag = playerTag;
    await user.save();

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
  await userDao.removePlayerTag(target_id);

  ctx.reply("ok");
});

brawlStarsComposer.command(/^profile/, async (ctx) => {
  const target_id = ctx.update.message.reply_to_message?.from?.id;
  if (
    typeof ctx.update.message === "undefined" ||
    typeof ctx.update.message.reply_to_message === "undefined" ||
    typeof ctx.update.message.reply_to_message.from === "undefined" ||
    "forum_topic_created" in ctx.update.message.reply_to_message
  ) {
    return ctx.reply(NO_REPLY_TARGET_MESSAGE);
  }

  const user = await User.findOne({ where: { telegram_id: target_id } });

  if (!user) return ctx.reply(NOT_FOUND_USER_MESSAGE);
  if (user.player_tag === null) return ctx.reply(NOT_LINKED_USER_MESSAGE);

  try {
    const playerData = await brawlStarsService.players.getPlayerInfo(
      user.player_tag
    );

    const playerBattleLog = await brawlStarsService.players.getPlayerBattleLog(
      user.player_tag
    );


    const icon = await brawlStarsService.icons.getProfileIconUrl(playerData);

    if (icon) {
      return ctx.replyWithPhoto(icon, {
        caption: templatesBS("profile", playerData, playerBattleLog.items),
        parse_mode: "Markdown",
      });
    } else {
      ctx.reply(templatesBS("profile", playerData, playerBattleLog.items), {
        parse_mode: "Markdown",
      });
    }
  } catch (err) {
    console.log(err);
    return ctx.reply(CANNOT_GET_PROFILE_DATA_MESSAGE);
  }
});

brawlStarsComposer.command(/^me/, async (ctx) => {
  const telegram_id = ctx.update.message.from.id;

  const user = await User.findOne({ where: { telegram_id } });
  if (!user || !user.player_tag) return;

  try {
    const playerData = await brawlStarsService.players.getPlayerInfo(
      user.player_tag
    );

    const icon = await brawlStarsService.icons.getProfileIconUrl(playerData);

    const playerBattleLog = await brawlStarsService.players.getPlayerBattleLog(
      user.player_tag
    );

    const trophiesDifferent = getTrophyChange(playerBattleLog.items);
    console.log({ trophiesDifferent });

    if (icon) {
      return ctx.replyWithPhoto(icon, {
        caption: templatesBS("profile", playerData, playerBattleLog.items),
        parse_mode: "Markdown",
      });
    } else {
      ctx.reply(templatesBS("profile", playerData, playerBattleLog.items), {
        parse_mode: "Markdown",
      });
    }
  } catch (err) {
    console.log(err);
    return ctx.reply(CANNOT_GET_PROFILE_DATA_MESSAGE);
  }
  ctx.reply(JSON.stringify(user, undefined, 2));
});

brawlStarsComposer.command(/^club_list/, async (ctx) => {
  const telegram_id = ctx.update.message.from.id;
  const user = await User.findOne({ where: { telegram_id } });

  if (!user) return ctx.reply(NOT_FOUND_USER_MESSAGE);
  if (!user.player_tag) return ctx.reply(NOT_LINKED_USER_MESSAGE);
  const userData = await brawlStarsService.players.getPlayerInfo(
    user.player_tag
  );

  const clubData = await userDao.getUserClubInfo(telegram_id);
  const members = await userDao.getUserClubMembers(telegram_id);

  if (!members || !clubData) {
    return ctx.reply("Пользователь не состоит в клубе");
  }

  const clubMembersTxt = await transformClubMembers(members);

  const msg = `Клуб: ${clubData.name}
Всего кубков: ${clubData.trophies}

Участники:
${clubMembersTxt}`;

  return ctx.reply(msg, { parse_mode: "Markdown" });
});
