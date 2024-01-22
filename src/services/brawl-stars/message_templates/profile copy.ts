// import { Player } from "@services/brawl-stars/api/types";
// import { readFileSync } from "fs";
// import { join } from "path";
// import { render } from "template-file";
// // import profileTemplate from './profile.template'

// export interface LogsObject {
//   trophyChange25: number;
//   trophyChangeDay: number;
//   trophyChangeWeek: number;
//   trophyChangeMonth: number;
// }

// export function template_BS_profile(
//   profile: Player,
//   battleResults: LogsObject
// ): string {
//   const filePath = join(__dirname, "profile.template");
//   const file = readFileSync(filePath, { encoding: "utf-8" });

//   const data = {
//     name: profile.name,
//     player_tag: profile.tag,
//     level: profile.expLevel,
//     experience: profile.expPoints,
//     club_name: profile.club.name,
//     club_tag: profile.club.tag,
//     trophies: profile.trophies,
//     highestTrophies: profile.highestTrophies,
//     trophiesDifference25: battleResults.trophyChange25,
//     trophiesDifferencedDay: battleResults.trophyChangeDay,
//     trophiesDifferenceWeek: battleResults.trophyChangeWeek,
//     trophiesDifferenceMonth: battleResults.trophyChangeMonth,
//     wins3v3: profile["3vs3Victories"],
//     soloWins: profile.soloVictories,
//     duoWins: profile.duoVictories,
//   };

//   // console.log(require('./profile.template'))

//   return render(file, data);
// }
