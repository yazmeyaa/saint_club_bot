import { UserDao } from "@orm/dao/UserDao";
import { User } from "@orm/models/User";
import { battleLogService } from "@services/battle-logs";
import { brawlStarsService } from "@services/brawl-stars/api";
import {
  BrawlStarsClub,
  ClubMemberList,
} from "@services/brawl-stars/api/types";
import { getTrophyChange } from "@services/brawl-stars/helpers";

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

    return members.items;
  }

  public async getTopUser(
    limit: number = 5,
    period: "day" | "week" | "month" = "day"
  ): UserTopResponse {
    const users = await this.userDao.getAllLinkedUsers(true);

    const usersWithStats = await Promise.all(
      users.map((item) => this.getUserTrophyChangeByPeriod(item, period))
    );

    return usersWithStats
      .sort((a, b) => b.trophyChanges - a.trophyChanges)
      .slice(0, limit);
  }

  private async getUserTrophyChangeByPeriod(
    user: User,
    period: "day" | "week" | "month" = "day"
  ) {
    const logs = await battleLogService.getUserBattleLogsFor(period, user);
    const trophyChanges = getTrophyChange(logs);

    return { user, trophyChanges };
  }
}

export const userService = new UserService();
