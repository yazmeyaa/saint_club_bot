import { bot } from "./modules";

async function startServer() {
    bot.start((msg) => {
        msg.reply('hi')
    })
  bot.launch();
}

startServer();
