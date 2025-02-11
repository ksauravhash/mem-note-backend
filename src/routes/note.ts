import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute";
import { create, getTodaysNote, getUnusedNotes, iterateNote } from "../controllers/note";


const noteRouter = Router();

noteRouter.use(protectedRoute);

noteRouter.post('/create', create);

noteRouter.get('/getUnusedNotes/:notebookID', getUnusedNotes);

noteRouter.get('/getTodaysNote/:notebookID', getTodaysNote);

noteRouter.patch('/iterateNote', iterateNote);

export default noteRouter;
