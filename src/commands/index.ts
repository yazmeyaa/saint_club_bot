import {
  checkIsAdmin,
  isValidPlayerTag,
  transformClubMembers,
} from "@helpers/bot";
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
import { User } from "@models/user";
import { brawlStarsService } from "@services/brawl-stars";
import { templatesBS } from "@templates/brawl-stars";

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
    const user = await User.findOne({ where: { telegram_id: targetId } });

    if (user)
      await User.update(
        { telegram_id: user.telegram_id },
        { player_tag: playerTag }
      );
    else await User.insert({ telegram_id: targetId, player_tag: playerTag });

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

  await User.update(
    {
      telegram_id: target_id,
    },
    {
      player_tag: null,
    }
  );

  ctx.reply("ok");
});

brawlStarsComposer.command(/^who/, async (ctx) => {
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

    ctx.reply(templatesBS("profile", playerData));
  } catch (err) {
    console.log(err);
    return ctx.reply(CANNOT_GET_PROFILE_DATA_MESSAGE);
  }
});

brawlStarsComposer.command(/^me/, async (ctx) => {
  const telegram_id = ctx.update.message.from.id;

  const user = await User.findOne({ where: { telegram_id } });
  if (!user) return;

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
  if (!userData.club) return ctx.reply("Пользователь не состоит в клубе");
  const clubData = await brawlStarsService.clubs.getClanInfo(userData.club.tag);

  const members = await brawlStarsService.clubs.getClanMembers(
    userData.club.tag
  );

  const clubMembersTxt = await transformClubMembers(members);

  const msg = `Клуб: ${clubData.name}
Всего кубков: ${clubData.trophies}

Участники:
${clubMembersTxt}`;

  return ctx.reply(msg, { parse_mode: "Markdown" });
});
