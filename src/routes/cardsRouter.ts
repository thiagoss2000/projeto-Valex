import { Router } from "express";
import { activeCard, blockCard, creatCard, unlockCard, viewCard } from "../controllers/cardsController.js";
import { payment, rechargeCard, viewMoviment } from "../controllers/transasctionsController.js";
import { cardDetails } from "../middlewares/cardDetailsMiddleware.js";
import { ValidateData } from "../middlewares/validateCardMiddleware.js";

const cardsRouter = Router();

cardsRouter.post("/new-card", creatCard);
cardsRouter.post("/active-card",cardDetails, activeCard);
cardsRouter.post("/recharge/:id", ValidateData, rechargeCard);
cardsRouter.post("/payment", cardDetails, ValidateData, payment);

cardsRouter.post("/block/:id", ValidateData, blockCard);
cardsRouter.post("/unlock/:id", ValidateData, unlockCard);

cardsRouter.get("/moviment/:id", viewMoviment); 
cardsRouter.get("/view/:id", viewCard); 

export default cardsRouter;