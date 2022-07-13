import { faker } from '@faker-js/faker';
import Cryptr from "cryptr";
import { findById as findEmployee} from "../repositories/employeeRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { cardUserName, dateExpiration } from '../utils/cardsUtil.js';


const typeCard = ['groceries', 'restaurant', 'transport', 'education', 'health'];

export async function creatCardService(cardType: cardRepository.TransactionTypes, userId: number, apikey: string) {
    
    if (!typeCard.includes(cardType)) throw {status: 406, message: "type not available"};
    
    const userdata = await findEmployee(userId);
    const companyData = await findByApiKey(apikey.toString());

    if (!userdata || !companyData) throw {status: 400, message: "invalid data"};    
    if (userdata.companyId != companyData.id) throw {status: 404, message: "unassociated employee"};
    
    const cardsData = await cardRepository.findByTypeAndEmployeeId(cardType, userId);
    
    if (cardsData) throw {status: 409, message: "card existed"};

    const numberCard = faker.random.numeric(16);
    const cryptr = new Cryptr(numberCard);
    const cvc = faker.random.numeric(3);
    const card = {
        employeeId: userdata.id,
        number: numberCard,
        cardholderName: cardUserName(userdata.fullName),
        securityCode: cryptr.encrypt(cvc),
        expirationDate: dateExpiration(5),
        password: null, 
        isVirtual: false,   
        originalCardId: null,
        isBlocked: false,
        type: cardType,
    };

    await cardRepository.insert(card);
    
    return cvc;
}

export async function activeCardService(cardNumber: string, password: string, cardDetails: any) {

    if (cardDetails.password) throw {status: 401, message: "card is active"}

    const cryptr = new Cryptr(cardNumber);
    const newData = { password: cryptr.encrypt(password) }    
    await cardRepository.update(cardDetails.id, newData);
}

export async function blockCardService(cardDetails: cardRepository.Card, password: string, state: boolean) {

    const cryptr = new Cryptr(cardDetails.number);
    
    if (cryptr.decrypt(cardDetails.password) != password) throw {status: 401, message: "invalid data"};
    
    if(cardDetails.isBlocked == state) throw {status: 405, message: state? "card is blocked" : "card not blocked" };

    const newData = { isBlocked: state }    
    await cardRepository.update(cardDetails.id, newData);
}

export async function viewCardService(cardId: number, password: string){
    const cards = await cardRepository.findById(cardId);

    const cryptr = new Cryptr(cards.number);

    if (!cards) throw {status: 404, message: "data not found"};
    if (cryptr.decrypt(cards.password) != password) throw {status: 401, message: "invalid data"}; 

    return cards;
}