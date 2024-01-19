import { User } from "@orm/models/User";
import { UserDao } from "./UserDao";

export abstract class Dao {
  public static getDao<T extends Dao>(type: typeof User): T {
    switch (type) {
      case User:
        return new UserDao() as Dao as T;
      default:
        return null as unknown as T;
    }
  }
}
