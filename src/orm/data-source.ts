import "../paths";
import { User } from "@orm/models/User";
import { existsSync, mkdirSync } from "fs";
import { Initdatabase1705350896162 } from "./migrations/1705350896162-initdatabase";
import { Createbattlelog1705664224603 } from "./migrations/1705664224603-createbattlelog";
import { homedir } from "os";
import { join } from "path";
import { DataSource } from "typeorm";
import { BattleLog } from "./models/BattleLog";

const dbDir = join(homedir(), "saint_club_helper_bot");
const dbFile = join(dbDir, "db.sqlite");

if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: dbFile,
  synchronize: false,
  logging: true,
  subscribers: [],
  migrations: [Initdatabase1705350896162, Createbattlelog1705664224603],
  entities: [User, BattleLog],
});

AppDataSource.initialize()
  .then(() => {
    console.log("[DataSource][init] Data Source has been initialized!");
  })
  .catch((err) => {
    console.error(
      "[DataSource][init] Error during Data Source initialization",
      err
    );
  });
