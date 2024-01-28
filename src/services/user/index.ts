import { logger } from "@helpers/logs";
import { UserDao } from "@orm/dao/UserDao";
import { User } from "@orm/models/User";
import { brawlStarsService } from "@services/brawl-stars/api";
import {
  BrawlStarsClub,
  ClubMemberList,
} from "@services/brawl-stars/api/types";

type GetClubMembersResponse = Promise<ClubMemberList | null>;
type UserClubInfoResponse = Promise<BrawlStarsClub | null>;
type UserTopResponse = Promise<
  Array<{
    user: User;
    trophyChanges: number;
  }>
>;
export class UserService {
  private userDao = new UserDao();

  public async getUserClubInfo(telegram_id: number): UserClubInfoResponse {
    const user = await this.userDao.getOrCreateUser(telegram_id);
    if (!user || !user.player_tag) return null;

    const userInfo = await brawlStarsService.players.getPlayerInfo(
      user.player_tag
    );
    if (!userInfo || !userInfo.club.tag) return null;

    const clubInfo = await brawlStarsService.clubs.getClanInfo(
      userInfo.club.tag
    );
    if (!clubInfo) return null;
    return clubInfo;
  }

  public async getUserClubMembers(telegram_id: number): GetClubMembersResponse {
    const club = await this.getUserClubInfo(telegram_id);
    if (!club) return null;

    const members = await brawlStarsService.clubs.getClanMembers(club.tag);

    if (!members) return null;

    return members.items;
  }

  public async getOrCreateUser(
    telegram_id: number,
    includeBattleLog: boolean = false
  ): Promise<User> {
    const user = await this.userDao.getOrCreateUser(
      telegram_id,
      includeBattleLog
    );
    return user;
  }

  public async updateUserTrophies(user: User): Promise<void> {
    if (!user.player_tag) return;

    const playerData = await brawlStarsService.players.getPlayerInfo(
      user.player_tag
    );
    user.trophies.day =
      user.trophies.week =
      user.trophies.month =
        playerData.trophies;
    await user.trophies.save();
  }

  public async getTopUser(
    limit: number = 5,
    period: "day" | "week" | "month" = "day"
  ): UserTopResponse {
    const users = await this.userDao.getAllLinkedUsers(false);
    console.log(users[0]);

    const usersWithStats = await Promise.all(
      users.map((item) => this.getUserTrophyChangeByPeriod(item, period))
    );

    console.log({ usersWithStats });

    return usersWithStats
      .sort((a, b) => b.trophyChanges - a.trophyChanges)
      .slice(0, limit);
  }

  public async getUserTrophyChangeByPeriod(
    user: User,
    period: "day" | "week" | "month" = "day"
  ) {
    const lastTrophy = user.trophies[period];
    const playerData = await brawlStarsService.players.getPlayerInfo(
      user.player_tag!
    );

    const trophyChanges = playerData.trophies - lastTrophy;

    return { user, trophyChanges };
  }

  public async removePlayerTag(telegram_id: number): Promise<void> {
    await this.userDao.removePlayerTag(telegram_id);
  }

  public async updateMysteryPointsToUsers(): Promise<void> {
    const dao = new UserDao();

    interface Difference {
      user: User;
      difference: number;
    }

    const linkedUsers = await dao.getAllLinkedUsers();

    const diffArr: Array<Promise<Difference>> = linkedUsers.map(
      async (user) => {
        const profileData = await brawlStarsService.players.getPlayerInfo(
          user.player_tag!
        );
        return {
          user,
          difference: profileData.trophies - user.trophies.day,
        };
      }
    );

    const diffArrResult = await Promise.all(diffArr);

    const maxTrophyDifference = Math.max(
      ...diffArrResult.map((item) => item.difference)
    );

    const leaders = diffArrResult.filter(
      (item) => item.difference === maxTrophyDifference
    );

    for (const leader of leaders) {
      leader.user.mystery_points += 1;
      await leader.user.save();
    }
  }

  public async updateAllUsersTrophies(
    period: "day" | "week" | "month"
  ): Promise<void> {
    const dao = new UserDao();

    const linkedUsers = await dao.getAllLinkedUsers();
    linkedUsers.forEach(async (user) => {
      const profileData = await brawlStarsService.players.getPlayerInfo(
        user.player_tag!
      );

      user.trophies[period] = profileData.trophies;

      await user.trophies.save();
    });
  }
}

export const userService = new UserService();
