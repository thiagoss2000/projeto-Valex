import { NextFunction, Request, Response } from "express";
import { findById } from "../repositories/cardRepository.js";
import { dateExpiration } from "../utils/cardsUtil.js";

export async function ValidateData(req: Request, res: Response, next: NextFunction) {
    let cardId = req.params.id;

    if(!cardId) cardId = res.locals.cardDetails.id

    const cardDetails = await findById(parseInt(cardId));

    const expirationDate = dateExpiration(0)

    if (!cardDetails) throw {status: 404, message: "invalid data"};
    if (cardDetails.expirationDate < expirationDate) throw {status: 401, message: "expired card"};

    res.locals = {
        cardDetails
    };
    next();
}