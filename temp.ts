



// for (const game in statsByGames) {
//     let visitedTemp: any;
//     let homeTemp: any;
//
//     for (const stat of statsByGames[game]) {
//         const fixedStat: Types.FixStat = {
//             id: stat.id,
//             ast: stat.ast,
//             pts: stat.pts,
//             team: { id: stat.team.id },
//             player: { id: stat.player.id, fullName: `${stat.player.first_name} ${stat.player.last_name}`},
//         };
//
//         if (stat.team.id === stat.game.home_team_id) {
//
//             if (!homeTemp) {
//                 homeTemp = fixedStat;
//
//             } else {
//                 if (stat.pts > homeTemp.pts) {
//                     fixedStat.assists = false;
//                     homeTemp = fixedStat;
//
//                 } else if (stat.pts === homeTemp.pts && stat.ast > homeTemp.ast) {
//                     fixedStat.assists = true;
//                     homeTemp = fixedStat;
//                 }
//             }
//
//         } else if (stat.team.id === stat.game.visitor_team_id) {
//             if (!visitedTemp) {
//                 visitedTemp = fixedStat;
//
//             } else {
//
//                 if (stat.pts > visitedTemp.pts) {
//                     visitedTemp = fixedStat;
//                     visitedTemp.assists = false;
//
//                 } else if (stat.pts === visitedTemp.pts && stat.ast > visitedTemp.ast) {
//                     visitedTemp = fixedStat;
//                     visitedTemp.assists = true;
//                 }
//             }
//         }
//     }
//
//     statsByGames[game] = [];
//     if (homeTemp) statsByGames[game].push(homeTemp);
//     if (visitedTemp) statsByGames[game].push(visitedTemp);
// }
//
//
// for (const gameData of gamesData) {
//     const players = statsByGames[gameData.id];
//
//     if (players.length > 0) {
//         for (const player of players) {
//
//             if (gameData.home_team.id === player.team.id) {
//                 gameData.home_player = player;
//
//             } else  if (gameData.visitor_team.id === player.team.id) {
//                 gameData.visited_player = player;
//             }
//
//         }
//     }
// }
//
// return gamesData;
