import { faker } from '@faker-js/faker';
import Cryptr from "cryptr";
import { findById as findEmployee} from "../repositories/employeeRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { cardUserName, dateExpiration } from '../utils/cardsUtil.js';
import { insert as rechargeCard, findByCardId as findRecharge } from '../repositories/rechargeRepository.js';
import { findByCardId, insert } from '../repositories/paymentRepository.js';
import { findById } from '../repositories/businessRepository.js';

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

    await cardRepository.insert(card);
}


export async function activeCardService(cardNumber: string, cvc: string, password: string, cardDetails: any) {
    const cryptr = new Cryptr(cardNumber);
    console.log(cryptr.decrypt(cardDetails.securityCode))
    const newData = { password: cryptr.encrypt(password) }    
    await cardRepository.update(cardDetails.id, newData);
}


export async function rechargecardService(apikey: string, cardId: number, credit: number) {

    const companyData = await findByApiKey(apikey.toString());
    const cardDetails = await cardRepository.findById(cardId);
    const userdata = await findEmployee(cardDetails.employeeId);

    if (!companyData || !cardDetails || !userdata) throw {status: 400, message: "invalid data"};
    if (companyData.id != userdata.companyId) throw {status: 404, message: "unassociated employee"}

    const rechargeData = {
        cardId: cardId,
        amount: credit
    }
    await rechargeCard(rechargeData);
}


export async function paymentService(cardId: number, typeCard: string, businessId: number, paymentAmount: number) {
    
    const businessesData = await findById(businessId);

    if (businessesData.type != typeCard) throw {status: 401, message: "inappropriate card"};
    if (paymentAmount <= 0 || paymentAmount > await transactionsDetails(cardId)) throw {status: 402, message: "insufficient funds"};

    const paymentData = { 
        cardId, 
        businessId, 
        amount: paymentAmount
    }
    await insert(paymentData)
}


export async function viewTransactionsServices(cardId: number) {

    return {
        balance: await transactionsDetails(cardId),
        transactions: await findPaymentsDetails(cardId),
        recharges: await findRechargesDetails(cardId)
    }
}


async function transactionsDetails(cardId: number) {

    const paymentDetails = await findByCardId(cardId);
    const rechargeDetails = await findRecharge(cardId);

    let amount = 0;
    rechargeDetails.forEach(e => amount += e.amount);
    paymentDetails.forEach(e => amount -= e.amount);

    return amount;
}

async function findRechargesDetails(cardId: number) {
    const rechargeDetails = await findRecharge(cardId);

    return rechargeDetails.map(e => {
        return (
            {
                "id": e.id, 
                "cardId": e.cardId, 
                "timestamp": e.timestamp, 
                "amount": e.amount
            }
        )
    })
}

async function findPaymentsDetails(cardId: number) {
    const paymentDetails = await findByCardId(cardId);

    return paymentDetails.map(e => {
        return (
            {
                "id": e.id, 
                "cardId": e.cardId, 
                "businessId": e.businessId, 
                "businessName": e.businessName, 
                "timestamp": e.timestamp, 
                "amount": e.amount
            }
        )
    })
}