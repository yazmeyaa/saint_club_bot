import "./paths";
import { bot } from "./modules";
import { User } from "@models/user";

function isValidPlayerTag(playerTag: string) {
  return typeof playerTag === "string" && playerTag.startsWith("#");
}

async function initDatabase() {
  await User.sync({
    alter: true,
  });
}

const INVALID_TAG_MESSAGE =
  'Тэг пользователя введён неверно. Правильный формат: "#XXXXXXXX"';
const NO_REPLY_TARGET_MESSAGE =
  "Команду нужно использовать в ответ на сообщение";

async function startServer() {
  await initDatabase();
  bot.command(/^link/, async (ctx) => {
    const [playerTag] = ctx.args;

    if (!isValidPlayerTag(playerTag)) {
      return ctx.reply(INVALID_TAG_MESSAGE);
    }

    //forum_topic_created
    console.log(ctx);
    if (
      typeof ctx.message.reply_to_message === "undefined" ||
      typeof ctx.message.reply_to_message.from === "undefined"
    ) {
      return ctx.reply(NO_REPLY_TARGET_MESSAGE);
    }

    const targetId = ctx.message.reply_to_message.from.id;

    try {
      User.upsert({
        telegram_id: targetId,
        player_tag: playerTag,
      });

      ctx.reply("Команда успешно выполнена!");
    } catch (err) {
      console.error(err);
      ctx.reply("Не удалось выполнить команду. :(");
    }
  });

  bot.command(/^unlink/, async (ctx) => {
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
  
  bot.launch();
}

startServer();
