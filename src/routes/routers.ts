import express from "express";
const router = express.Router();
import FileController from "../controllers/file.controller";
import ValidationHandler from "../middlewares/validationHandler";

router.get("/team", ValidationHandler.getTeamsSchema, FileController.getTeams);

router.get("/game", ValidationHandler.getGamesSchema, FileController.getGames);

router.get("/stat", FileController.getStats);

export default router;
