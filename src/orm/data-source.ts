import "../paths";
import { User } from "@orm/models/User";
import { existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { DataSource } from "typeorm";
import { UserTrophies } from "./models/UserTrophy";

import { Initdatabase1705350896162 } from "./migrations/1705350896162-initdatabase";
import { Createbattlelog1705664224603 } from "./migrations/1705664224603-createbattlelog";
import { Updateschemabattlelog1705687798028 } from "./migrations/1705687798028-updateschemabattlelog";
import { UpdateBattleLogSchema1705696256821 } from "./migrations/1705696256821-update_battle_log_schema";
import { CreateUserTrophies1705921307447 } from "./migrations/1705921307447-createUserTrophies";
import { AddMysteryPointsToUser1706009323551 } from "./migrations/1706009323551-addMysteryPointsToUser";

const { NODE_ENV } = process.env;

const dbDir = join(homedir(), "saint_club_helper_bot");
const dbFile = join(dbDir, "db.sqlite");

if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: dbFile,
  synchronize: false,
  logging: NODE_ENV === "development",
  subscribers: [],
  migrations: [
    Initdatabase1705350896162,
    Createbattlelog1705664224603,
    Updateschemabattlelog1705687798028,
    UpdateBattleLogSchema1705696256821,
    CreateUserTrophies1705921307447,
    AddMysteryPointsToUser1706009323551
  ],
  entities: [User, UserTrophies],
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
