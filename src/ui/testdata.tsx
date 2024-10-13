import { Amount, Posting, Transaction } from './data_types';

export function createTestTransaction(): Transaction {
  const increasingPosting: Posting = {
    account: 'Assets:Checking',
    units: new Amount(100, 'USD'),
  };

  const decreasingPosting: Posting = {
    account: 'Expenses:Food',
    units: new Amount(-100, 'USD'),
  };

  return {
    meta: {
      commodity: '美团订单-24030711100300001303988784032205',
      transaction_category: '商户消费',
    },
    date: new Date(2022, 1, 1),
    flag: '*',
    payee: 'Payee',
    narration: 'Narration',
    tags: new Set(),
    links: new Set(),
    postings: [increasingPosting, decreasingPosting],
  };
}
