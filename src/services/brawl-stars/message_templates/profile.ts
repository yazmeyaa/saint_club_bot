import { Player } from "@services/brawl-stars/api/types";

export const template_BS_profile = (
  profile: Player
): string => `*${profile.name}* (${profile.tag})
🎖Уровень: ${profile.expLevel} (${profile.expPoints.toLocaleString()} очков опыта)
👾Клуб: ${profile.club.name}

🏆Трофеи: ${profile.trophies} (максимум ${profile.highestTrophies})
🥇Победы 3v3: ${profile["3vs3Victories"]}
🥇Победы соло: ${profile.soloVictories}
🥇Победы дуо: ${profile.duoVictories}`;
