import {
  getTrophyChange,
  getWinsAndLosesRow,
} from "@services/brawl-stars/helpers";
import { Player } from "@services/brawl-stars/api/types";
import { BattleLog } from "@orm/models/BattleLog";

export interface LogsObject {
  battleLogs: BattleLog[];
  logs1day: BattleLog[];
  logs1week: BattleLog[];
  logs1month: BattleLog[];
}

export const template_BS_profile = (
  profile: Player,
  battleResults: LogsObject
): string => {
  const header = `*${profile.name}* (${profile.tag})`;

  const exp = profile.expPoints.toLocaleString();
  const level = `🎖Уровень: ${profile.expLevel} (${exp} очков опыта)`;

  const club = profile.club ? `👾Клуб: ${profile.club.name}` : "";
  const currentTrophies = `🏆Трофеи: ${profile.trophies} (максимум ${profile.highestTrophies})`;
  const trophiesDifference = getTrophyChange(battleResults.battleLogs);
  const trophiesDiff = `🏆Изменение трофеев (25 игр): ${
    trophiesDifference > 0 ? "+" + trophiesDifference : trophiesDifference
  }🏆`;

  const winsAndLosesRow = `\`${getWinsAndLosesRow(battleResults.battleLogs)}\``;

  const trophiesDiff_day = `🏆Изменение трофеев (1 день): ${
    trophiesDifference > 0 ? "+" + trophiesDifference : trophiesDifference
  }🏆`;
  const trophiesDiff_week = `🏆Изменение трофеев (1 неделя): ${
    trophiesDifference > 0 ? "+" + trophiesDifference : trophiesDifference
  }🏆`;
  const trophiesDiff_month = `🏆Изменение трофеев (1 месяц): ${
    trophiesDifference > 0 ? "+" + trophiesDifference : trophiesDifference
  }🏆`;

  const wins3v3 = `🥇Победы 3v3: ${profile["3vs3Victories"]}`;
  const soloWins = `🥇Победы соло: ${profile.soloVictories}`;
  const duoWins = `🥇Победы дуо: ${profile.duoVictories}`;

  return [
    header,
    level,
    club,
    "",
    currentTrophies,
    trophiesDiff,
    winsAndLosesRow,
    "",
    trophiesDiff_day,
    trophiesDiff_week,
    trophiesDiff_month,
    "",
    wins3v3,
    soloWins,
    duoWins,
  ].join("\n");
};
