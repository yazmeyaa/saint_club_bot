import { UserDao } from "@orm/dao/UserDao";
import { AppDataSource } from "@orm/data-source";

const userDao = new UserDao();

export async function initDatabase() {
  await AppDataSource.initialize();

  const admin = await userDao.getOrCreateUser(279603779);
  admin.admin = true;
  await admin.save();

  console.log({ adminBattleLogs: admin.battleLogs });
}
