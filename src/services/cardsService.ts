import { faker } from '@faker-js/faker';
import Cryptr from "cryptr";
import { findById } from "../repositories/employeeRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { findByCardDetails, findByTypeAndEmployeeId, insert, TransactionTypes, update } from "../repositories/cardRepository.js";
import { cardUserName, dateExpiration } from '../utils/cardsUtil.js';

const typeCard = ['groceries', 'restaurant', 'transport', 'education', 'health'];

export async function creatCardService(cardType: TransactionTypes, userId: number, apikey: string) {
    
    if (!typeCard.includes(cardType)) throw {status: 406, message: "type not available"};
    
    const userdata = await findById(userId);
    const companyData = await findByApiKey(apikey.toString());

    if (!userdata || !companyData) throw {status: 400, message: "invalid data"};    
    if (userdata.companyId != companyData.id) throw {status: 404, message: "unassociated employee"};
    
    const cardsData = await findByTypeAndEmployeeId(cardType, userId);
    
    if (cardsData) throw {status: 409, message: "card existed"};

    const numberCard = faker.random.numeric(16);
    const cryptr = new Cryptr(numberCard);

    const card = {
        employeeId: userdata.id,
        number: numberCard,
        cardholderName: cardUserName(userdata.fullName),
        securityCode: cryptr.encrypt(faker.random.numeric(3)),
        expirationDate: dateExpiration(5),
        password: null, 
        isVirtual: false,   
        originalCardId: null,
        isBlocked: false,
        type: cardType,
    };

    await insert(card);
}

export async function activeCardService(cardNumber: string, cvc: string, password: string, cardDetails: any) {
    const cryptr = new Cryptr(cardNumber);
    console.log(cryptr.decrypt(cardDetails.securityCode))
    const newData = { password: cryptr.encrypt(password) }    
    await update(cardDetails.id, newData);
}