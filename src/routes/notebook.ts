import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute";
import {
  create,
  getNotebook,
  getRecentNotebooks,
} from "../controllers/notebook";

const notebookRouter = Router();

notebookRouter.use(protectedRoute);

notebookRouter.post("/create", create);

notebookRouter.get("/getRecentNotebooks", getRecentNotebooks);

notebookRouter.post("/getNotebook", getNotebook);

export default notebookRouter;
