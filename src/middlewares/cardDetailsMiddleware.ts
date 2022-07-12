import Cryptr from "cryptr";
import { NextFunction, Request, Response } from "express";
import { findByCardDetails } from "../repositories/cardRepository.js";

export async function cardDetails(req: Request, res: Response, next: NextFunction) {
    const { cardNumber, cardholderName, expirationDate, cvc, password } : 
    {cardNumber: string, cardholderName: string, expirationDate: string, cvc: string, password: string} = req.body;

    const cryptr = new Cryptr(cardNumber);

    const cardDetails = await findByCardDetails(cardNumber, cardholderName, expirationDate);

    if (!password) throw {status: 406, message: "password required"};
    if (!cardDetails || cvc != cryptr.decrypt(cardDetails.securityCode)) throw {status: 401, message: "invalid information"};
    if (cardDetails.expirationDate < expirationDate) throw {status: 401, message: "expired card"};

    res.locals = {
        cardDetails
    };
    next();
}