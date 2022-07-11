import { Router } from "express";
import { activeCard, creatCard, payment, rechargeCard, viewCard, viewMoviment } from "../controllers/cardsController.js";
import { cardDetails } from "../middlewares/cardDetailsMiddleware.js";

const cardsRouter = Router();

cardsRouter.post("/new-card", creatCard);
cardsRouter.post("/active-card",cardDetails, activeCard);
cardsRouter.post("/recharge", rechargeCard);
cardsRouter.post("/payment", cardDetails, payment);

cardsRouter.get("/moviment/:id", viewMoviment); 
cardsRouter.get("/view/:id", viewCard); 

export default cardsRouter;