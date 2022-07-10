import { Router } from "express";
import { creatCard } from "../controllers/cardsController.js";

const cardsRouter = Router();

cardsRouter.post("/new-card",creatCard);

export default cardsRouter;