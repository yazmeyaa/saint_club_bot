import { Sequelize } from "sequelize";
import { homedir } from "os";
import { join, resolve } from "path";

const storagePath = join(homedir(), "saint_club_helper_bot", "db.sqlite");

const db = new Sequelize({
  dialect: "sqlite",
  storage: resolve(storagePath),
});

export { db };
