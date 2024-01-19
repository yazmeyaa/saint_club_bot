import {
  getTrophyChange,
  getWinsAndLosesRow,
} from "@services/brawl-stars/helpers";
import { BattleResult, Player } from "@services/brawl-stars/api/types";

export const template_BS_profile = (
  profile: Player,
  battleResults: BattleResult[]
): string => {
  const header = `*${profile.name}* (${profile.tag})`;

  const exp = profile.expPoints.toLocaleString();
  const level = `🎖Уровень: ${profile.expLevel} (${exp} очков опыта)`;

  const club = profile.club ? `👾Клуб: ${profile.club.name}` : "";
  const currentTrophies = `🏆Трофеи: ${profile.trophies} (максимум ${profile.highestTrophies})`;
  const trophiesDifference = getTrophyChange(battleResults);
  const trophiesDiff = `🏆Изменение трофеев (25 игр): ${
    trophiesDifference > 0 ? "+" + trophiesDifference : trophiesDifference
  }🏆`;

  const winsAndLosesRow = `\`${getWinsAndLosesRow(battleResults)}\``;

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
    wins3v3,
    soloWins,
    duoWins,
  ].join("\n");
};
