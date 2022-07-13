import Cryptr from "cryptr";
import { Request, Response } from "express";
import { Card } from "../repositories/cardRepository.js";
import { paymentService, rechargecardService, viewTransactionsServices } from "../services/transactionServices.js"

export async function viewMoviment(req: Request, res: Response) {
    const cardId = req.params.id;

    const transactionsData = await viewTransactionsServices(parseInt(cardId));

    res.send(transactionsData);
}

export async function rechargeCard(req: Request, res: Response) {
    const { apikey } = req.headers;
    const { credit } : {credit: number} = req.body;

    const cardDetails = res.locals.cardDetails;

    if (cardDetails.isBlocked) throw {status: 401, message: "card is blocked"};
    if (!cardDetails.id || !credit) throw {status: 401, message: "invalid data"};
    if (credit <= 0) throw {status: 422, message: "invalid data"};

    await rechargecardService(apikey.toString(), cardDetails.id, credit);

    res.sendStatus(200);
}

export async function payment(req: Request, res: Response) {
    const { password, businessId, paymentAmount } : 
    {password: string, businessId: number, paymentAmount: number} = req.body;

    const cardDetails : Card = res.locals.cardDetails;
    const cryptr = new Cryptr(cardDetails.number);

    if (cardDetails.isBlocked) throw {status: 401, message: "card is blocked"};
    if (cryptr.decrypt(cardDetails.password) != password ) throw {status: 401, message: "invalid data"};
 
    await paymentService(cardDetails.id, cardDetails.type, businessId, paymentAmount)
    
    res.sendStatus(200);
}