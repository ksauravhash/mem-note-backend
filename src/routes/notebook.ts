import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute";
import {
  create,
  deleteNotebook,
  getNotbookWithStats,
  getNotebook,
  getRecentNotebooks,
} from "../controllers/notebook";

const notebookRouter = Router();

notebookRouter.use(protectedRoute);

notebookRouter.post("/create", create);

notebookRouter.get("/getRecentNotebooks", getRecentNotebooks);

notebookRouter.post("/getNotebook", getNotebook);

notebookRouter.post("/getNotbookWithStats", getNotbookWithStats);

notebookRouter.delete("/deleteNotebook/:notebookId", deleteNotebook);

export default notebookRouter;
