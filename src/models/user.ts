import { db } from "@modules/sequelize";
import { DataTypes } from "sequelize";

const User = db.define("User", {
  telegram_id: {
    type: DataTypes.TEXT,
    unique: true,
    primaryKey: true
  },
  player_tag: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

export { User };
