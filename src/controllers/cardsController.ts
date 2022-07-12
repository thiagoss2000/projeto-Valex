import { Request, Response } from "express";
import { Card, TransactionTypes } from "../repositories/cardRepository.js";
import { activeCardService, blockCardService, creatCardService, viewCardService } from "../services/cardsService.js";

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
    const employeeId = req.params.id
    const { password } = req.headers;

    if (!password) throw {status: 422, message: "invalid data"};

    const cards = await viewCardService(parseInt(employeeId), password.toString());

    res.send(cards);
}

export async function blockCard(req: Request, res: Response) {
    const { password } : {password: string} = req.body;
    console.log(password)
    const cardDetails : Card = res.locals.cardDetails;
    
    await blockCardService(cardDetails, password, true);

    res.sendStatus(200);
}

export async function unlockCard(req: Request, res: Response) {
    const { password } : {password: string} = req.body;
    console.log(password)
    const cardDetails : Card = res.locals.cardDetails;
    
    await blockCardService(cardDetails, password, false);

    res.sendStatus(200);
}