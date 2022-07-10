import { Request, Response } from "express";
import { faker } from '@faker-js/faker';
import { connection } from "../database/database.js";
import { findById } from "../repositories/employeeRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { findByTypeAndEmployeeId, TransactionTypes } from "../repositories/cardRepository.js";

const typeCard = ['groceries', 'restaurant', 'transport', 'education', 'health'];

export async function creatCard(req: Request, res: Response) {
    const { apikey } = req.headers;
    const { userId, cardType } : {userId: number, cardType: TransactionTypes} = req.body;

    if(!typeCard.includes(cardType)) return res.status(406).send("type not available");

    const userdata = await findById(userId);
    const companyData = await findByApiKey(apikey.toString());

    if (userdata.companyId != companyData.id) return res.status(404).send("unassociated employee");

    const cardsData = await findByTypeAndEmployeeId(cardType, userId);
    
    if (cardsData) res.status(409).send("card existed");

    const usernameArr = userdata.fullName.split(' ');
    const linkName = /^de|do|da|dos|das|De|Do|Da|Dos|Das$/;
    let usernameCard = [];
    usernameArr.forEach((e, i) => {
        if(i == 0 || i == usernameArr.length -1) {
            usernameCard.push(e);
        } else if (!linkName.test(e)){
            usernameCard.push(e[0]);
        }
    })


    const mouth = new Date().getMonth().toString().padStart(2, '0');
    const year = (new Date().getFullYear() + 5).toString().slice(2, 4);

    console.log(mouth+'/'+year);
    const card = {
        employeeId: userdata.id,
        number: faker.random.numeric(16),
        cardholderName: usernameCard.join(' '),
        securityCode: faker.random.numeric(3),
        expirationDate: mouth+'/'+year,
        password: faker.random.numeric(3), // FIXME mudar entrada de senha
        isVirtual: false,   // FIXME mudar entrada de boolean
        originalCardId: null,
        isBlocked: false,
        type: cardType,
    }

    console.log(card)
    res.send({companyData, userdata})
}