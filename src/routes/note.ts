import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute";
import { create } from "../controllers/note";


const noteRouter = Router();

noteRouter.use(protectedRoute);

noteRouter.post('/create', create);

export default noteRouter;
