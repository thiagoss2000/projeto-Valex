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
    const { cardId, credit } : {cardId: number, credit: number} = req.body;

    if (!cardId || !credit) throw {status: 401, message: "invalid data"};
    if (credit <= 0) throw {status: 422, message: "invalid data"};

    await rechargecardService(apikey.toString(), cardId, credit);

    res.sendStatus(200);
}

export async function payment(req: Request, res: Response) {
    const { password, businessId, paymentAmount } : 
    {password: string, businessId: number, paymentAmount: number} = req.body;

    const cardDetails : Card = res.locals.cardDetails;
    const cryptr = new Cryptr(cardDetails.number);

    if (cryptr.decrypt(cardDetails.password) != password ) throw {status: 401, message: "invalid data"};
 
    await paymentService(cardDetails.id, cardDetails.type, businessId, paymentAmount)
    
    res.sendStatus(200);
}