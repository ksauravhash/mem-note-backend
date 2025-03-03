import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute";
import { create, getTodaysNote, getUnusedNotes, iterateNote, updateNote } from "../controllers/note";


const noteRouter = Router();

noteRouter.use(protectedRoute);

noteRouter.post('/create', create);

noteRouter.get('/getUnusedNotes/:notebookID', getUnusedNotes);

noteRouter.get('/getTodaysNote/:notebookID', getTodaysNote);

noteRouter.patch('/iterateNote', iterateNote);

noteRouter.patch('/updateNote', updateNote);

export default noteRouter;
