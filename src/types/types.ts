// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Types {
    export interface Team {
        id: number;
        full_name: string;
    }

    export interface GetTeamsRes {
        data: Team[];
        total_count: number,
    }

    export interface Game {
        id: number;
        date: string;
        season: string;
        home_team_score: string;
        visitor_team_score: string;
        home_team: { id: number; full_name: string };
        visitor_team: { id: number; full_name: string };
        home__best_player?: object;
        visited_best_player?: object;
    }


    export interface GetGamesRes {
        data?: Game[];
        total_count: number,
    }

    export interface Stat {
        id: number;
        ast: number;
        pts: number;
        team: { id: number };
        game?: { id: number; home_team_id: number; visitor_team_id: number };
        player: { id: number; first_name?: string, last_name?: string, fullName?: string };
        assists?: boolean;
    }

}
