import Cryptr from "cryptr";
import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import { activeCardService, creatCardService, paymentService, rechargecardService } from "../services/cardsService.js";

export async function creatCard(req: Request, res: Response) {
    const { apikey } = req.headers;
    const { userId, cardType } : {userId: number, cardType: TransactionTypes} = req.body;

    await creatCardService(cardType, userId, apikey.toString());
   
    res.sendStatus(201);
}

export async function activeCard(req: Request, res: Response) {
    const { cardNumber, cvc, password } : 
    {cardNumber: string, cvc: string, password: string} = req.body;
    
    const cardDetails = res.locals.cardDetails;

    await activeCardService(cardNumber, cvc, password, cardDetails);
    
    res.sendStatus(200);
}

export async function viewCard(req: Request, res: Response) {

}

export async function viewMoviment(req: Request, res: Response) {

}

export async function rechargeCard(req: Request, res: Response) {
    const { apikey } = req.headers;
    const { cardId, credit } : {cardId: number, credit: number} = req.body;

    await rechargecardService(apikey.toString(), cardId, credit);

    res.sendStatus(200);
}

export async function payment(req: Request, res: Response) {
    const { password, businessId, paymentAmount } : 
    {password: string, businessId: number, paymentAmount: number} = req.body;

    const cardDetails = res.locals.cardDetails;
    const cryptr = new Cryptr(cardDetails.number);

    if (cryptr.decrypt(cardDetails.password) != password ) throw {status: 401, message: "invalid data"};
 
    await paymentService(cardDetails.id, cardDetails.type, businessId, paymentAmount)

    res.sendStatus(200);
}