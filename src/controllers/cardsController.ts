import { Request, Response } from "express";
import { Card, TransactionTypes } from "../repositories/cardRepository.js";
import { activeCardService, blockCardService, creatCardService, viewCardService } from "../services/cardsService.js";

export async function creatCard(req: Request, res: Response) {
    const { apikey } = req.headers;
    const { employeeId, cardType } : {employeeId: number, cardType: TransactionTypes} = req.body;

    const cvc = await creatCardService(cardType, employeeId, apikey.toString());
   
    res.status(201).send({cvc});
}

export async function activeCard(req: Request, res: Response) {
    const { cardNumber, password } : 
    {cardNumber: string, password: string} = req.body;
    
    const cardDetails : Card = res.locals.cardDetails;
    
    await activeCardService(cardNumber, password, cardDetails);
    
    res.sendStatus(200);
}

export async function viewCard(req: Request, res: Response) {
    const cardId = req.params.id
    const { password } = req.headers;

    if (!password) throw {status: 422, message: "invalid data"};

    const cards = await viewCardService(parseInt(cardId), password.toString());

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