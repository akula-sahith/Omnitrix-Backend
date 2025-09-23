import express from "express";
import { registerTeam } from "../controllers/teamController.js";

const router = express.Router();

router.post("/register", registerTeam);

export default router;
