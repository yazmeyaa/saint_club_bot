import "../paths";
import { User } from "./models/User";
import { UserTrophies } from "./models/UserTrophy";
import { TrophiesRecord } from "./models/TrophyRecord";
import { DataSource } from "typeorm";

import { UserTitle } from "./models/UserTitle";
import { environments } from "@config/env";
import {InitPgDb1741349430499} from "@orm/migrations/1741349430499-init_pg_db";

const { NODE_ENV } = process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  database: environments.database.database,
  username: environments.database.username,
  password: environments.database.password,
  port: environments.database.port,
  host: environments.database.host,
  ssl: false,
  synchronize: false,
  logging: NODE_ENV === "development",
  subscribers: [],
  migrations: [InitPgDb1741349430499],
  entities: [User, UserTrophies, TrophiesRecord, UserTitle],
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
