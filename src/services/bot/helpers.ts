import { User } from "@orm/models/User";
import { ClubMemberList } from "@services/brawl-stars/api/types/club";
import { In } from "typeorm";
import { ClubListPayload, LogsObject } from "./templates/types";
import { Player } from "@services/brawl-stars/api/types";
import { brawlStarsService } from "@services/brawl-stars/api";
import { textTemplates } from "./templates";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import { escapeMarkdown } from "@helpers/markdown";
import { UserTitleService } from "@services/user-title";

export async function checkIsAdmin(telegram_id: string): Promise<boolean> {
  const user = await User.findOne({ where: { telegram_id: telegram_id } });

  if (!user) return false;

  return user.admin;
}

export function isValidPlayerTag(playerTag: string) {
  return typeof playerTag === "string" && playerTag.startsWith("#");
}

export async function transformClubMembers(
  members: ClubMemberList
): Promise<ClubListPayload["members"]> {
  const result: ClubListPayload["members"] = [];
  const membersTags = members.map((item) => item.tag);

  const findMembers = await User.find({
    where: {
      player_tag: In(membersTags),
    },
  });

  for (const member of members) {
    const user = findMembers.find((item) => item.player_tag === member.tag);
    if (user)
      result.push({
        name: createMention(member.name, user.telegram_id),
        tag: member.tag,
      });
    else result.push({ ...member });
  }

  return result;
}

export type ProfileDataType = {
  logs: LogsObject;
  playerData: Player;
  textMsg: string;
  icon: string | null;
};

export async function getProfileData(
  user: User
): Promise<ProfileDataType | null> {
  const playerData = await brawlStarsService.players.getPlayerInfo(
    user.player_tag!
  );
  if (!playerData) return null;
  const logs: LogsObject = {
    trophyChange25: 0,
    trophyChangeDay: playerData.trophies - user.trophies.day,
    trophyChangeWeek: playerData.trophies - user.trophies.week,
    trophyChangeMonth: playerData.trophies - user.trophies.month,
  };

  const title = await UserTitleService.getInstance().getUserTitle(user);

  const textMsg = await textTemplates.getTemplate({
    type: "PROFILE",
    payload: {
      ...playerData,
      ...logs,
      mystery_points: user.mystery_points,
      title: title?.title ? `Титул: 「${title.title}」` : "",
    },
  });

  const icon = await brawlStarsService.icons.getProfileIconUrl(playerData);

  return { playerData, logs, textMsg: escapeMarkdown(textMsg), icon };
}

export function createMention(name: string, user_id: string) {
  return `\[${name}\](tg://user?id=${user_id})`;
}

export function checkIsMessageReply(
  message: Update.New & Update.NonChannel & Message.TextMessage
): boolean {
  return (
    typeof message === "undefined" ||
    typeof message.reply_to_message === "undefined" ||
    typeof message.reply_to_message.from === "undefined" ||
    "forum_topic_created" in message.reply_to_message
  );
}
