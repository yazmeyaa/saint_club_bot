import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

const consoleFormatting = combine(
  colorize(),
  timestamp(),
  printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

const consoleTransport = new transports.Console({
  format: consoleFormatting,
});

export const logger = createLogger({
  level: "info",
  transports: [consoleTransport],
});
