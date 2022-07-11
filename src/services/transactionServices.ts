import { findById as findEmployee} from "../repositories/employeeRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { insert as rechargeCard, findByCardId as findRecharge } from '../repositories/rechargeRepository.js';
import { findByCardId, insert } from '../repositories/paymentRepository.js';
import { findById } from '../repositories/businessRepository.js';

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