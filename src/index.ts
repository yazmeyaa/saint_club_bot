import "./paths";
import { bot } from "./modules";
import { User } from "@models/user";
import { brawlStarsService } from "@services/brawl-stars";
import { templatesBS } from "@templates/brawl-stars";

function isValidPlayerTag(playerTag: string) {
  return typeof playerTag === "string" && playerTag.startsWith("#");
}

async function checkIsAdmin(telegram_id: string | number): Promise<boolean> {
  const user = await User.findOne({ where: { telegram_id } });

  if (!user) return false;

  return user.dataValues.admin;
}

async function initDatabase() {
  await User.sync({
    alter: true,
  });

  await User.update({ admin: true }, { where: { telegram_id: 279603779 } });
}

const INVALID_TAG_MESSAGE =
  'Тэг пользователя введён неверно. Правильный формат: "#XXXXXXXX"';
const NO_REPLY_TARGET_MESSAGE =
  "Команду нужно использовать в ответ на сообщение";
const NOT_FOUND_USER_MESSAGE = "Пользователь не найден";
const NOT_LINKED_USER_MESSAGE = "К пользователю не привязан тэг";
const CANNOT_GET_PROFILE_DATA_MESSAGE = "Не удалось получить данные об игроке";
const COMMAND_EXECUTED_MESSAGE = "Команда успешно выполнена!";
const COMMAND_NOT_EXECUTE_MESSAGE = "Не удалось выполнить команду.";

async function startServer() {
  await initDatabase();
  bot.command(/^link/, async (ctx) => {
    const [playerTag] = ctx.args;

    const isAdminRequest = await checkIsAdmin(ctx.update.message.from.id);
    if (!isAdminRequest) return;

    if (!isValidPlayerTag(playerTag)) {
      return ctx.reply(INVALID_TAG_MESSAGE);
    }

    //forum_topic_created
    console.log(ctx.update.message);
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
      await User.upsert({
        telegram_id: targetId.toString(),
        player_tag: playerTag,
      });

      ctx.reply(COMMAND_EXECUTED_MESSAGE);
    } catch (err) {
      console.error(err);
      ctx.reply(COMMAND_NOT_EXECUTE_MESSAGE);
    }
  });

  bot.command(/^unlink/, async (ctx) => {
    const isAdminRequest = await checkIsAdmin(ctx.update.message.from.id);
    if (!isAdminRequest) return;

    const target_id = ctx.message.reply_to_message?.from?.id;
    if (!target_id) return ctx.reply(NO_REPLY_TARGET_MESSAGE);

    await User.update(
      {
        player_tag: null,
      },
      {
        where: {
          telegram_id: target_id,
        },
      }
    );

    ctx.reply("ok");
  });

  bot.command(/^who/, async (ctx) => {
    const target_id = ctx.update.message.reply_to_message?.from?.id;

    if (
      typeof ctx.update.message === "undefined" ||
      typeof ctx.update.message.reply_to_message === "undefined" ||
      typeof ctx.update.message.reply_to_message.from === "undefined" ||
      "forum_topic_created" in ctx.update.message.reply_to_message
    ) {
      return ctx.reply(NO_REPLY_TARGET_MESSAGE);
    }
    console.log({ reply: ctx.update.message.reply_to_message });

    const user = await User.findOne({ where: { telegram_id: target_id } });

    if (!user) return ctx.reply(NOT_FOUND_USER_MESSAGE);
    if (user.dataValues.player_tag === null)
      return ctx.reply(NOT_LINKED_USER_MESSAGE);

    try {
      const playerData = await brawlStarsService.players.getPlayerInfo(
        user.dataValues.player_tag
      );

      ctx.reply(templatesBS("profile", playerData));
    } catch (err) {
      console.log(err);
      return ctx.reply(CANNOT_GET_PROFILE_DATA_MESSAGE);
    }
  });

  bot.command(/^me/, async (ctx) => {
    const telegram_id = ctx.update.message.from.id;

    const user = await User.findOne({ where: { telegram_id } });
    if (!user) return;
    console.log(user);

    ctx.reply(JSON.stringify(user, undefined, 2));
  });

  bot.launch();
}

startServer();
