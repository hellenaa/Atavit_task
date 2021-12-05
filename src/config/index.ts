import dotenv from "dotenv";
dotenv.config();

export default {
  RAPID_API_KEY: process.env.RAPID_API_KEY,
  RAPID_API_HOST: process.env.RAPID_API_HOST,
  TEAMS_URL: process.env.TEAMS_URL,
  GAMES_URL: process.env.GAMES_URL,
  STATS_URL: process.env.STATS_URL,
};
