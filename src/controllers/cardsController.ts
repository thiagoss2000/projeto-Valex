import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import { creatCardService } from "../services/cardsService.js";

export async function creatCard(req: Request, res: Response) {
    const { apikey } = req.headers;
    const { userId, cardType } : {userId: number, cardType: TransactionTypes} = req.body;

    await creatCardService(cardType, userId, apikey.toString());
   
    res.sendStatus(201);
}

export async function activeCard(req: Request, res: Response) {
    
}