import { Router } from "express";
import { activeCard, creatCard } from "../controllers/cardsController.js";

const cardsRouter = Router();

cardsRouter.post("/new-card",creatCard);
cardsRouter.post("/active-card",activeCard);

export default cardsRouter;