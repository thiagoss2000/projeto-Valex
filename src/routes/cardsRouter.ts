import { Router } from "express";
import { activeCard, creatCard } from "../controllers/cardsController.js";
import { cardDetails } from "../middlewares/cardDetailsMiddleware.js";

const cardsRouter = Router();

cardsRouter.post("/new-card", creatCard);
cardsRouter.post("/active-card",cardDetails, activeCard);

export default cardsRouter;