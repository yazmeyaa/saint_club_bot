import "../paths";
import { User } from "./models/User";
import { UserTrophies } from "./models/UserTrophy";
import { TrophiesRecord } from "./models/TrophyRecord";
import { existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { DataSource } from "typeorm";

import { Initdatabase1705350896162 } from "./migrations/1705350896162-initdatabase";
import { Createbattlelog1705664224603 } from "./migrations/1705664224603-createbattlelog";
import { Updateschemabattlelog1705687798028 } from "./migrations/1705687798028-updateschemabattlelog";
import { UpdateBattleLogSchema1705696256821 } from "./migrations/1705696256821-update_battle_log_schema";
import { CreateUserTrophies1705921307447 } from "./migrations/1705921307447-createUserTrophies";
import { AddMysteryPointsToUser1706009323551 } from "./migrations/1706009323551-addMysteryPointsToUser";
import { AddTrophyRecordsTable1729601561533 } from "./migrations/1729601561533-add_trophy_records_table";
import { AddRelationUserTrophiesToUser1729602577792 } from "./migrations/1729602577792-add_relation_userTrophies_to_user";
import { ChangeTrophiesRecordsModel1729603408928 } from "./migrations/1729603408928-change_trophies_records_model";
import { ChangeUserTrophyToUserRelationType1729603737050 } from "./migrations/1729603737050-change_userTrophy_to_user_relation_type";
import { AlterUserTrophiesUserColumn1729605321993 } from "./migrations/1729605321993-alter_userTrophies_user_column";
import { UserTitle } from "./models/UserTitle";
import { AddUserTitles1729687316214 } from "./migrations/1729687316214-add_user_titles";

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
    AddMysteryPointsToUser1706009323551,
    AddTrophyRecordsTable1729601561533,
    AddRelationUserTrophiesToUser1729602577792,
    ChangeTrophiesRecordsModel1729603408928,
    ChangeUserTrophyToUserRelationType1729603737050,
    AlterUserTrophiesUserColumn1729605321993,
    AddUserTitles1729687316214,
  ],
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
