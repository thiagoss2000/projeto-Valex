import Cryptr from "cryptr";
import { Request, Response } from "express";
import { Card, TransactionTypes } from "../repositories/cardRepository.js";
import { activeCardService, blockCardService, creatCardService, viewCardService } from "../services/cardsService.js";
import { paymentService, rechargecardService, viewTransactionsServices } from "../services/transactionServices.js"

export async function creatCard(req: Request, res: Response) {
    const { apikey } = req.headers;
    const { employeeId, cardType } : {employeeId: number, cardType: TransactionTypes} = req.body;

    await creatCardService(cardType, employeeId, apikey.toString());
   
    res.sendStatus(201);
}

export async function activeCard(req: Request, res: Response) {
    const { cardNumber, cvc, password } : 
    {cardNumber: string, cvc: string, password: string} = req.body;
    
    const cardDetails : Card = res.locals.cardDetails;

    await activeCardService(cardNumber, cvc, password, cardDetails);
    
    res.sendStatus(200);
}

export async function viewCard(req: Request, res: Response) {
    const { employeeId, password } : { employeeId: number, password: string} = req.body;

    const cards = viewCardService(employeeId, password);
}

export async function viewMoviment(req: Request, res: Response) {
    const cardDetails = res.locals.cardDetails;

    const transactionsData = await viewTransactionsServices(cardDetails.id);

    res.send(transactionsData);
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

    const cardDetails : Card = res.locals.cardDetails;
    const cryptr = new Cryptr(cardDetails.number);

    if (cryptr.decrypt(cardDetails.password) != password ) throw {status: 401, message: "invalid data"};
 
    await paymentService(cardDetails.id, cardDetails.type, businessId, paymentAmount)

    res.sendStatus(200);
}

export async function blockCard(req: Request, res: Response) {
    const { password } : {password: string} = req.body;
    const cardDetails : Card = res.locals.cardDetails;
  
    await blockCardService(cardDetails, password, true);

    res.sendStatus(200);
}

export async function unlockCard(req: Request, res: Response) {
    const { password } : {password: string} = req.body;
    const cardDetails : Card = res.locals.cardDetails;

    await blockCardService(cardDetails, password, false);

    res.sendStatus(200);
}