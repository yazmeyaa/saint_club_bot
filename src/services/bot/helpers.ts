import { User } from "@orm/models/User";
import { BattleResult } from "@services/brawl-stars/api/types";
import { ClubMemberList } from "@services/brawl-stars/api/types/club";
import { In } from "typeorm";

export async function checkIsAdmin(telegram_id: number): Promise<boolean> {
  const user = await User.findOne({ where: { telegram_id: telegram_id } });

  if (!user) return false;

  return user.admin;
}

export function isValidPlayerTag(playerTag: string) {
  return typeof playerTag === "string" && playerTag.startsWith("#");
}

export async function transformClubMembers(
  members: ClubMemberList
): Promise<string> {
  const membersStrings: string[] = [];

  const membersTags = members.map((item) => item.tag);

  const findMembers = await User.find({
    where: {
      player_tag: In(membersTags),
    },
  });

  for (const member of members) {
    const user = findMembers.find((item) => item.player_tag === member.tag);
    if (user) membersStrings.push(createMention(member.name, user.telegram_id));
    else membersStrings.push(member.name);
  }

  return membersStrings.join("\n");
}

export function createMention(name: string, user_id: number) {
  return `\[${name}\](tg://user?id=${user_id})`;
}

export function getTrophyChange(battleLogs: BattleResult[]): number {
  let result = 0;

  for (const battle of battleLogs) {
    if (battle.battle.type !== "ranked" || !battle.battle.trophyChange)
      continue;
    result += battle.battle.trophyChange;
  }

  return result;
}

export function getWinsAndLosesRow(battleLogs: BattleResult[]): string {
  const result: string[] = [];
  for (const battle of battleLogs) {
    console.log(battle.battle.trophyChange);
    if (
      battle.battle.type !== "ranked" ||
      typeof battle.battle.trophyChange === "undefined"
    ) {
      result.push("0");
      continue;
    }
    const { trophyChange } = battle.battle;
    result.push(trophyChange >= 0 ? "+" + trophyChange : String(trophyChange));
  }

  return result.join(" | ");
}
