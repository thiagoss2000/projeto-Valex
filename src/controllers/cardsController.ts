import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import { activeCardService, creatCardService } from "../services/cardsService.js";

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