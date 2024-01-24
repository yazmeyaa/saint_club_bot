import { User } from "@orm/models/User";
import { Player } from "@services/brawl-stars/api/types";

export interface LogsObject {
  trophyChange25: number;
  trophyChangeDay: number;
  trophyChangeWeek: number;
  trophyChangeMonth: number;
}

export const template_BS_profile = (
  profile: Player,
  battleResults: LogsObject,
  user: User
): string => {
  const header = `*${profile.name}* (${profile.tag})`;

  const exp = profile.expPoints.toLocaleString();
  const level = `🎖Уровень: ${profile.expLevel} (${exp} очков опыта)`;

  const club = profile.club ? `👾Клуб: ${profile.club.name}` : "";
  const currentTrophies = `🏆Трофеи: ${profile.trophies} (максимум ${profile.highestTrophies})`;
  const trophiesDifference = battleResults.trophyChange25;
  const trophiesDifference_day = battleResults.trophyChangeDay;
  const trophiesDifference_week = battleResults.trophyChangeWeek;
  const trophiesDifference_month = battleResults.trophyChangeMonth;
  const trophiesDiff = `🏆Изменение трофеев (25 игр): ${
    trophiesDifference > 0 ? "+" + trophiesDifference : trophiesDifference
  }🏆`;

  // const winsAndLosesRow = `\`${getWinsAndLosesRow(battleResults.trophyChange25)}\``;

  const trophiesDiff_day = `🏆Изменение трофеев (1 день): ${
    trophiesDifference_day > 0
      ? "+" + trophiesDifference_day
      : trophiesDifference_day
  }🏆`;
  const trophiesDiff_week = `🏆Изменение трофеев (1 неделя): ${
    trophiesDifference_week > 0
      ? "+" + trophiesDifference_week
      : trophiesDifference_week
  }🏆`;
  const trophiesDiff_month = `🏆Изменение трофеев (1 месяц): ${
    trophiesDifference_month > 0
      ? "+" + trophiesDifference_month
      : trophiesDifference_month
  }🏆`;

  const wins3v3 = `🥇Победы 3v3: ${profile["3vs3Victories"]}`;
  const soloWins = `🥇Победы соло: ${profile.soloVictories}`;
  const duoWins = `🥇Победы дуо: ${profile.duoVictories}`;

  const { mystery_points } = user;
  const mysteryPoints = `🔮 ${mystery_points}`;

  return [
    header,
    level,
    club,
    mysteryPoints,
    "",
    currentTrophies,
    trophiesDiff,
    // winsAndLosesRow,
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
