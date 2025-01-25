import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute";
import { create } from "../controllers/notebook";

const notebookRouter = Router();


notebookRouter.use(protectedRoute);

notebookRouter.post('/create', create);