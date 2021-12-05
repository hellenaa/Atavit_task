import axios from "axios";
import config from "../config";
import { Types } from "../types/types";
import Utils from "../helpers/utils";


class FileService {
    private axios;
    private utils;
    constructor() {
        this.utils = Utils;
        this.axios = axios;
        this.getTeams = this.getTeams.bind(this);
        this.getGames = this.getGames.bind(this);
        this.fixGamesData = this.fixGamesData.bind(this);
        this.getStats = this.getStats.bind(this);
        this.getGamesStatsData = this.getGamesStatsData.bind(this);
        this.parseGamesData = this.parseGamesData.bind(this);
        this.parseBestPlayerData = this.parseBestPlayerData.bind(this);
    }


    public async getTeams(page: string, per_page: string): Promise<Types.GetTeamsRes> {
        const params: { page?: string; per_page?: string } = {};

        if (page && per_page) {
            params.page = page;
            params.per_page = per_page;
        }

        const options = {
            method: "GET",
            url: config.TEAMS_URL,
            params,
            headers: {
                "x-rapidapi-host": config.RAPID_API_HOST,
                "x-rapidapi-key":  config.RAPID_API_KEY,
            }
        };

        const { data } = await this.axios.request(options as any);

        return {
            data: data.data,
            total_count: data.meta.total_count,
        };
    }

    public async getGames(query: { page: string; per_page: string; season: string; teamId: string }): Promise<Types.GetGamesRes> {
        const { page, per_page, season, teamId } = query;

        const params: { page?: string; per_page?: string, seasons: string[]; team_ids?: string[] } = { seasons: [season] };

        if (teamId) {
            params.team_ids = [teamId];
        }
        if (page && per_page) {
            params.page = page;
            params.per_page = per_page;
        }

        const options = {
            method: "GET",
            url: config.GAMES_URL,
            params,
            headers: {
                "x-rapidapi-host": config.RAPID_API_HOST,
                "x-rapidapi-key":  config.RAPID_API_KEY,
            }
        };

        const { data } = await this.axios.request(options as any);

        return {
            data: data.data,
            total_count: data.meta.total_count,
        };
    }

    public fixGamesData(gamesData: Types.GetGamesRes): { fixedGamesData: Types.GetGamesRes, gameIds: number[] } {
        const gameIds: number[] = [];
        const fixedGamesData: Types.GetGamesRes = {
            data: [],
            total_count: gamesData.total_count,
        };

        gamesData.data.forEach((game) => {
            gameIds.push(game.id);

            const fixedGame = {
                id: game.id,
                season: game.season,
                date: this.utils.formatDate(game.date),
                home_team_score: game.home_team_score,
                visitor_team_score: game.visitor_team_score,
                home_team: { id: game.home_team.id, full_name: game.home_team.full_name },
                visitor_team: { id: game.visitor_team.id, full_name: game.visitor_team.full_name },
            };

            fixedGamesData.data.push(fixedGame);
        });

        return { fixedGamesData, gameIds };
    }

    public async getStats(season: string, gameId: number, page?: string, per_page?: string): Promise<Types.Stat[]> {

        const params: { page?: string; per_page?: string, seasons: string[]; game_ids?: number[] } = { seasons: [season], game_ids: [gameId] };

        if (page && per_page) {
            params.page = page;
            params.per_page = per_page;
        }

        const options = {
            method: "GET",
            url: config.STATS_URL,
            params,
            headers: {
                "x-rapidapi-host": config.RAPID_API_HOST,
                "x-rapidapi-key":  config.RAPID_API_KEY,
            }
        };

        const { data } = await this.axios.request(options as any);

        return data.data;
    }

    public async getGamesStatsData (season: string, gameIds: number[]): Promise<Types.Stat[]> {
        const statsData = [];
        const stats = [];

        for (const gameId of gameIds) {
            statsData.push(this.getStats(season, gameId));
        }

        const tempStats = await Promise.all(statsData);

        for (const tempStat of tempStats) {
            stats.push(...tempStat);
        }
        return stats;
    }


    public parseGamesData(gamesData: Types.GetGamesRes, statsByGames: Types.Stat[]): Types.GetGamesRes {
        let homePlayerData: { [key: string]: any } = {};
        let visitedPlayerData: { [key: string]: any } = {};

        for (const stat of statsByGames) {
            if (!stat.id ||
                (!stat.ast && stat.ast !== 0) ||
                (!stat.pts && stat.pts !== 0) ||
                !stat.team?.id ||
                !stat.player?.id ||
                !stat.player?.first_name ||
                !stat.player?.last_name
            ) continue;

            const fixedStat: Types.Stat = {
                id: stat.id,
                ast: stat.ast,
                pts: stat.pts,
                team: { id: stat.team.id },
                player: { id: stat.player.id, fullName: `${stat.player.first_name} ${stat.player.last_name}`},
            };

            if (stat.team.id === stat.game.home_team_id) {
                if (!homePlayerData[stat.game.id]) {
                    homePlayerData[stat.game.id] = [fixedStat];
                } else {
                    homePlayerData[stat.game.id].push(fixedStat);
                }

            } else if (stat.team.id === stat.game.visitor_team_id) {
                if (!visitedPlayerData[stat.game.id]) {
                    visitedPlayerData[stat.game.id] = [fixedStat];
                } else {
                    visitedPlayerData[stat.game.id].push(fixedStat);
                }
            }
        }


        if (Object.keys(homePlayerData).length > 0 && Object.keys(visitedPlayerData).length > 0) {

            homePlayerData = this.parseBestPlayerData(homePlayerData);
            visitedPlayerData = this.parseBestPlayerData(visitedPlayerData);

            for (const gameData of gamesData.data) {
                if (visitedPlayerData[gameData.id]) gameData.visited_best_player = visitedPlayerData[gameData.id];
                if (homePlayerData[gameData.id]) gameData.home__best_player = homePlayerData[gameData.id];
            }
        }

        return gamesData;
    }


    private parseBestPlayerData(playerData: { [key: string]: any }): { [key: string]: any } {
        for (const game in playerData) {
            let tempStat = playerData[game][0];

            for (const stat of playerData[game]) {

                if (stat.pts > tempStat.pts) {
                    tempStat = stat;

                } else if (stat.pts === tempStat.pts && stat.ast > tempStat.ast) {
                    tempStat = stat;
                    tempStat.assists = true;
                }
            }
            playerData[game] = tempStat;
        }
        return playerData;
    }


}

export default new FileService();
