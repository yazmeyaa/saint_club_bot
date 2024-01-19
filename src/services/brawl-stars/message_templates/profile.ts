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
  const trophiesDifference_day = getTrophyChange(battleResults.logs1day);
  const trophiesDifference_week = getTrophyChange(battleResults.logs1week);
  const trophiesDifference_month = getTrophyChange(battleResults.logs1month);
  const trophiesDiff = `🏆Изменение трофеев (25 игр): ${
    trophiesDifference > 0 ? "+" + trophiesDifference : trophiesDifference
  }🏆`;

  const winsAndLosesRow = `\`${getWinsAndLosesRow(battleResults.battleLogs)}\``;

  const trophiesDiff_day = `🏆Изменение трофеев (1 день): ${
    trophiesDifference_day > 0 ? "+" + trophiesDifference_day : trophiesDifference_day
  }🏆`;
  const trophiesDiff_week = `🏆Изменение трофеев (1 неделя): ${
    trophiesDifference_week > 0 ? "+" + trophiesDifference_week : trophiesDifference_week
  }🏆`;
  const trophiesDiff_month = `🏆Изменение трофеев (1 месяц): ${
    trophiesDifference_month > 0 ? "+" + trophiesDifference_month : trophiesDifference_month
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
