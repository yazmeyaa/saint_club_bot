import {UserDao} from "@orm/dao/UserDao";
import {User} from "@orm/models/User";
import {brawlStarsService} from "@services/brawl-stars/api";
import {BrawlStarsClub, ClubMemberList,} from "@services/brawl-stars/api/types";

type GetClubMembersResponse = Promise<ClubMemberList | null>;
type UserClubInfoResponse = Promise<BrawlStarsClub | null>;
type UserTopResponse = Promise<Array<{
  user: User;
  trophyChanges: number;
}> | null>;
type UserWithStats = {
  user: User;
  trophyChanges: number;
  club: string | null;
};

export class UserService {
  private userDao = new UserDao();

  public async getUserClubInfo(telegram_id: string): UserClubInfoResponse {
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

  public async getAllLinkedUsers(): Promise<User[]> {
    return this.userDao.getAllLinkedUsers();
  }

  public async getUserClubMembers(telegram_id: string): GetClubMembersResponse {
    const club = await this.getUserClubInfo(telegram_id);
    if (!club) return null;

    const members = await brawlStarsService.clubs.getClanMembers(club.tag);

    if (!members) return null;

    return members.items;
  }

  public async getOrCreateUser(telegram_id: string): Promise<User> {
    return await this.userDao.getOrCreateUser(telegram_id);
  }

  public async updateUserTrophies(user: User): Promise<void> {
    if (!user.player_tag) return;

    const playerData = await brawlStarsService.players.getPlayerInfo(
      user.player_tag
    );
    if (!playerData) return;
    user.trophies.day =
      user.trophies.week =
      user.trophies.month =
        playerData.trophies;
    await user.trophies.save();
  }

  public async getTopUser(
    limit: number = 5,
    period: "day" | "week" | "month" = "day",
    club: string | null = null
  ): UserTopResponse {
    const users = await this.userDao.getAllLinkedUsers();

    const _usersWithStats = await Promise.all(
      users.map((item) => this.getUserTrophyChangeByPeriod(item, period))
    );

    const usersWithStats = _usersWithStats.filter(Boolean) as UserWithStats[];

    if (club) {
      return usersWithStats
        .filter((x) => x.club === club)
        .sort((a, b) => b.trophyChanges - a.trophyChanges)
        .slice(0, limit);
    }

    return usersWithStats
      .sort((a, b) => b.trophyChanges - a.trophyChanges)
      .slice(0, limit);
  }

  public async getUserTrophyChangeByPeriod(
    user: User,
    period: "day" | "week" | "month" = "day"
  ): Promise<UserWithStats | null> {
    const lastTrophy = user.trophies[period];
    const playerData = await brawlStarsService.players.getPlayerInfo(
      user.player_tag!
    );
    if (!playerData) return null;

    const trophyChanges = playerData.trophies - lastTrophy;

    return { user, trophyChanges, club: playerData.club?.tag ?? null };
  }

  public async removePlayerTag(telegram_id: string): Promise<void> {
    await this.userDao.removePlayerTag(telegram_id);
  }

  public async addMysteryPoint(user: User): Promise<void> {
    user.mystery_points++;
    await user.save();
  }

  public async updateMysteryPointsToUsers(): Promise<void> {
    const dao = new UserDao();

    interface Difference {
      user: User;
      difference: number;
    }

    const linkedUsers = await dao.getAllLinkedUsers();

    const diffArr: Array<Promise<Difference | null>> = linkedUsers.map(
      async (user) => {
        const profileData = await brawlStarsService.players.getPlayerInfo(
          user.player_tag!
        );
        if (!profileData) return null;
        return {
          user,
          difference: profileData.trophies - user.trophies.day,
        };
      }
    );

    const _diffArrResult = await Promise.all(diffArr);
    const diffArrResult = _diffArrResult.filter(Boolean) as Difference[];

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

    for (const user of linkedUsers) {
      const profileData = await brawlStarsService.players.getPlayerInfo(
        user.player_tag!
      );

      if (!profileData) continue;
      if (profileData.club.tag.toLowerCase() !== "#2RJ8P80JU".toLowerCase()) {
        continue;
      }
      user.trophies[period] = profileData.trophies;

      await user.trophies.save();
    }
  }

  public async getTopUsersByMysteryTrophies(limit = 5): Promise<User[]> {
    const users = await this.userDao.getAllLinkedUsers();

    const filteredPromise: Promise<User | null>[] = [];

    for (const user of users) {
      filteredPromise.push(
        new Promise(async (resolve) => {
          const profileData = await brawlStarsService.players.getPlayerInfo(
            user.player_tag!
          );
          if (!profileData || !profileData.club || !profileData.club.tag)
            resolve(null);
          if (
            profileData?.club.tag?.toLowerCase() !== "#2RJ8P80JU".toLowerCase()
          )
            resolve(null);
          resolve(user);
        })
      );
    }

    const _filtered = await Promise.all(filteredPromise);
    const filtered = _filtered.filter(Boolean) as User[];

    const result = filtered.sort((a, b) => b.mystery_points - a.mystery_points);

    return result.slice(0, limit);
  }
}

export const userService = new UserService();
