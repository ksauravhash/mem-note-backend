import { Router } from "express";
import { sendMessage } from "../controllers/contact";

const contactRouter = Router();

contactRouter.post('/sendMessage', sendMessage);

export default contactRouter;