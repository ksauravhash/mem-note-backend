import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute";
import { create, getNoteById, getNotes, getTodaysNote, getUnusedNotes, iterateNote, updateNote } from "../controllers/note";


const noteRouter = Router();

noteRouter.use(protectedRoute);

noteRouter.post('/create', create);

noteRouter.get('/getUnusedNotes/:notebookID', getUnusedNotes);

noteRouter.get('/getTodaysNote/:notebookID', getTodaysNote);

noteRouter.patch('/iterateNote', iterateNote);

noteRouter.patch('/updateNote', updateNote);

noteRouter.get('/getNotes/:notebookId', getNotes);

noteRouter.get('/getNoteById/:notebookId/:noteId', getNoteById);

noteRouter.get('/getNotes/:notebookId/:page', getNotes);

export default noteRouter;
