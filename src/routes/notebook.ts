import { Router } from "express";
import multer from 'multer';
import { protectedRoute } from "../middlewares/protectedRoute";
import {
  create,
  deleteNotebook,
  getNotbookWithStats,
  getNotebook,
  getRecentNotebooks,
  uploadNotebookFile,
} from "../controllers/notebook";

const upload = multer({storage: multer.memoryStorage()})

const notebookRouter = Router();

notebookRouter.use(protectedRoute);

notebookRouter.get("/getRecentNotebooks", getRecentNotebooks);

notebookRouter.post("/create", create);

notebookRouter.post("/getNotebook", getNotebook);

notebookRouter.post("/getNotbookWithStats", getNotbookWithStats);

notebookRouter.post('/uploadNotebookFile', upload.single('notebook'), uploadNotebookFile)

notebookRouter.delete("/deleteNotebook/:notebookId", deleteNotebook);

export default notebookRouter;
