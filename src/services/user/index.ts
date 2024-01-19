import { UserDao } from "@orm/dao/UserDao";
import { brawlStarsService } from "@services/brawl-stars/api";
import { BrawlStarsClub, ClubMemberList } from "@services/brawl-stars/api/types";

type GetClubMembersResponse = Promise<ClubMemberList | null>;
type UserClubInfoResponse = Promise<BrawlStarsClub | null>;

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
}

export const userService = new UserService();
