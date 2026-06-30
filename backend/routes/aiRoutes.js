import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { improveBullet, improveSummary, improveProject, getATSScore} from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/improve-bullet", protect, improveBullet);
aiRouter.post("/improve-summary", protect, improveSummary);
aiRouter.post("/improve-project", protect, improveProject);
aiRouter.post("/ats-score", protect, getATSScore);

export default aiRouter;
