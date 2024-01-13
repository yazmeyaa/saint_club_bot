import { db } from "@modules/sequelize";
import { DataTypes } from "sequelize";

const User = db.define("User", {
  telegram_id: DataTypes.TEXT,
  player_tag: {
    type: DataTypes.TEXT,
    allowNull: true
  },
});

export { User };
