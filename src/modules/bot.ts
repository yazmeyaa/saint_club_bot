import { environments } from "@config/env";
import { Telegraf } from "telegraf";

const token = environments.telegram_bot_token;
if (!token) throw new Error("Cannot get telegram bot token!");

const bot: Telegraf = new Telegraf(token);

export { bot };
