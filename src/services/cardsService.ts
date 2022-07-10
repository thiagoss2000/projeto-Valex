import { faker } from '@faker-js/faker';
import Cryptr from "cryptr";
import { findById } from "../repositories/employeeRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { findByTypeAndEmployeeId, insert, TransactionTypes } from "../repositories/cardRepository.js";
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

    const cryptr = new Cryptr(apikey.toString());

    const card = {
        employeeId: userdata.id,
        number: faker.random.numeric(16),
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