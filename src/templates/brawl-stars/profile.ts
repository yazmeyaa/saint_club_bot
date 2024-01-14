import { Player } from "types/brawlstars";

export function template_BS_profile(profile: Player): string {
  const {
    name,
    tag,
    trophies,
    club,
    "3vs3Victories": wins3v3,
    highestTrophies,
    soloVictories,
  } = profile;
  return `🫠Имя: ${name}
#️⃣Тэг: ${tag}
🏆Трофеи: ${trophies}
🏆Максимум трофеев: ${highestTrophies}
👾Клуб: ${club.name}
🥇Победы 3v3: ${wins3v3}
🥇Победы соло: ${soloVictories}`;
}
