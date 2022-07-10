import { Router } from "express";
import { activeCard, creatCard, payment, rechargeCard } from "../controllers/cardsController.js";
import { cardDetails } from "../middlewares/cardDetailsMiddleware.js";

const cardsRouter = Router();

cardsRouter.post("/new-card", creatCard);
cardsRouter.post("/active-card",cardDetails, activeCard);
cardsRouter.post("/recharge", rechargeCard);
cardsRouter.post("/payment", cardDetails, payment);

export default cardsRouter;