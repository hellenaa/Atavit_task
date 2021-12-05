import FileService from "../services/file.service";
import { Request, Response, NextFunction } from "express";
import { Types } from "../types/types";

class FileController {
  private fileService;

  constructor() {
    this.fileService = FileService;
    this.getGames = this.getGames.bind(this);
    this.getTeams = this.getTeams.bind(this);
    this.getStats = this.getStats.bind(this);
  }


  public async getTeams(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, per_page } = req.query as any;

      const teamsData = await this.fileService.getTeams(page, per_page);

      const teams: Types.GetTeamsRes = {
        data: [],
        total_count: 0,
      };

      if (teamsData?.data && teamsData.data.length > 0) {
        teamsData.data.forEach((team) => {
          teams.data.push({ id: team.id, full_name: team.full_name })
        });
        teams.total_count = teamsData.total_count;
      }

      res.send(teams)

    } catch (err) {
      next(err);
    }
  }


  public async getGames(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      let gamesData = await this.fileService.getGames(req.query as any);

      if (gamesData?.data && gamesData.data.length > 0) {
        const { gameIds, fixedGamesData } = this.fileService.fixGamesData(gamesData);

        const gamesStatsData = await this.fileService.getGamesStatsData(req.query.season as any, gameIds);

        if(gamesStatsData.length > 0) {

          gamesData = this.fileService.parseGamesData(fixedGamesData, gamesStatsData);
        }
        console.log(gameIds)
      }

      res.send(gamesData);

    } catch (err) {
      next(err);
    }
  }


  public async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = "1", per_page = "10", season, gameId } = req.query;

      const playersByGames = await this.fileService.getStats(season as any, Number(gameId), page as any, per_page as any);

      res.send(playersByGames);

    } catch (err) {
      next(err);
    }
  }

}


export default new FileController();
