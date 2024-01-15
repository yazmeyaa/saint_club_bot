import "./paths";
import { User } from "@models/user";
import { existsSync, mkdirSync } from "fs";
import { Initdatabase1705350896162 } from "./migrations/1705350896162-initdatabase";
import { homedir } from "os";
import { join } from "path";
import { DataSource } from "typeorm";

const dbDir = join(homedir(), "saint_club_helper_bot");
const dbFile = join(dbDir, "db.sqlite");

if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: dbFile,
  synchronize: true,
  logging: true,
  subscribers: [],
  migrations: [Initdatabase1705350896162],
  entities: [User],
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
