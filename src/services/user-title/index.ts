import { UserTitleDao } from "@orm/dao/UserTitleDao";
import { User } from "@orm/models/User";
import { UserTitle } from "@orm/models/UserTitle";

export class UserTitleService {
  private static instance: UserTitleService;
  private dao = new UserTitleDao();
  public static getInstance(): UserTitleService {
    if (!this.instance) {
      this.instance = new UserTitleService();
    }
    return this.instance;
  }

  public async createTitle(
    needPoints: UserTitle["pointsNeed"],
    title: UserTitle["title"]
  ): Promise<UserTitle> {
    return this.dao.createTitle(needPoints, title);
  }

  public async getUserTitle(user: User): Promise<UserTitle | null> {
    return this.dao.getUserTitle(user);
  }
}
