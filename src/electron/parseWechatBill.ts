import fs from 'fs';
import { parse } from 'csv-parse/sync';
import {
  Transaction,
  Amount,
  Posting,
  WeChatBillEntry,
  TransactionRule,
  WeChatRules,
  WeChatConfig,
} from './data_types.js';

const CSV_FILE_PATH =
  'D:\\Downloads\\repos\\Learn\\reactjs\\bean-electron-react-vite\\data\\bills\\wechat\\微信支付账单(20231211-20240311).csv';

const CONFIG_FILE_PATH =
  'D:\\Downloads\\repos\\Learn\\reactjs\\bean-electron-react-vite\\data\\configs\\wechat_config.json';

let count = 0;
let _accountsAsIs: Record<string, string>;
let _rules: WeChatRules;

function checkStringCondition(
  txnContent: string,
  conditionContent: string | string[]
): boolean {
  if (Array.isArray(conditionContent)) {
    return conditionContent.some((item) => txnContent.includes(item));
  } else if (typeof conditionContent === 'string') {
    return txnContent === conditionContent;
  } else {
    throw new Error('Invalid condition type');
  }
}

function conditionsMet(
  conditions: { [key: string]: string | string[] },
  line: { [key: string]: string }
): boolean {
  for (const [conditionCategory, conditionContent] of Object.entries(
    conditions
  )) {
    if (conditionCategory === '金额(元)') {
      const conditionContentStr = conditionContent as string;
      const match = conditionContentStr.match(/([<>=]+)(\d+(\.\d+)?)/);
      if (match) {
        const operator = match[1];
        const comparisonAmount = parseFloat(match[2]);
        const rowAmount = parseFloat(line['金额(元)'].slice(1));

        switch (operator) {
          case '<':
            if (rowAmount >= comparisonAmount) return false;
            break;
          case '>':
            if (rowAmount <= comparisonAmount) return false;
            break;
          case '<=':
            if (rowAmount > comparisonAmount) return false;
            break;
          case '>=':
            if (rowAmount < comparisonAmount) return false;
            break;
          case '==':
            if (rowAmount !== comparisonAmount) return false;
            break;
          default:
            throw new Error('Invalid operator in 金额(元) condition');
        }
      } else {
        throw new Error('金额（元）的条件格式不正确');
      }
    } else {
      if (!checkStringCondition(line[conditionCategory], conditionContent)) {
        return false;
      }
    }
  }
  return true;
}

function performAction(
  ruleBody: TransactionRule,
  line: WeChatBillEntry,
  txnPostings: Posting[]
) {
  const ruleDefinitive = Boolean(ruleBody['definitive']);
  const actions = ruleBody['action'];
  let number = '';
  let units: Amount;

  const numOfPosting = txnPostings.length;
  let increasingAccountFilled = false;
  let increasingAccountDefinitive = false;
  let increasingAccountIndex: number;
  let decreasingAccountFilled = false;
  let decreasingAccountDefinitive = false;
  let decreasingAccountIndex: number;

  // 检查是否已经填入过账户并提取账户信息
  if (numOfPosting === 1) {
    if (txnPostings[0].meta!['account_type'] === 'increasing') {
      increasingAccountFilled = true;
      increasingAccountIndex = 0;
      if (txnPostings[0].meta!['posting_definitive']) {
        increasingAccountDefinitive = true;
      }
    } else {
      decreasingAccountFilled = true;
      decreasingAccountIndex = 0;
      if (txnPostings[0].meta!['posting_definitive']) {
        decreasingAccountDefinitive = true;
      }
    }
  } else if (numOfPosting === 2) {
    increasingAccountFilled = true;
    decreasingAccountFilled = true;
    if (txnPostings[0].meta!['account_type'] === 'increasing') {
      increasingAccountIndex = 0;
      decreasingAccountIndex = 1;
    } else {
      increasingAccountIndex = 1;
      decreasingAccountIndex = 0;
    }
    if (txnPostings[increasingAccountIndex].meta!['posting_definitive']) {
      increasingAccountDefinitive = true;
    }
    if (txnPostings[decreasingAccountIndex].meta!['posting_definitive']) {
      decreasingAccountDefinitive = true;
    }
  }

  // 检查是否需要填入账户并完成填充
  if (!decreasingAccountDefinitive) {
    if ('decreasing_account' in actions) {
      let decreasingAccount;
      if (actions['decreasing_account'] === 'AsIs') {
        decreasingAccount = _accountsAsIs[line['支付方式']];
      } else {
        decreasingAccount = actions['decreasing_account'];
      }
      const decreasingPostingMeta = {
        account_type: 'decreasing',
        posting_definitive: ruleDefinitive,
      };
      number = '-' + line['金额(元)'].slice(1); // 去除 ￥ 符号
      units = new Amount(number, 'CNY');
      const decreasingPosting = new Posting(
        decreasingAccount,
        units,
        undefined,
        undefined,
        decreasingPostingMeta
      );
      if (decreasingAccountFilled) {
        //存在则替换之
        txnPostings[decreasingAccountIndex!] = decreasingPosting;
      } else {
        txnPostings.push(decreasingPosting);
      }
    }
  }

  if (!increasingAccountDefinitive) {
    if ('increasing_account' in actions) {
      let increasingAccount;
      if (actions['increasing_account'] === 'AsIs') {
        increasingAccount = _accountsAsIs[line['支付方式']];
      } else {
        increasingAccount = actions['increasing_account'];
      }
      const increasingPostingMeta = {
        account_type: 'increasing',
        posting_definitive: ruleDefinitive,
      };
      number = line['金额(元)'].slice(1); // 去除 ￥ 符号
      units = new Amount(number, 'CNY');
      const increasingPosting = new Posting(
        increasingAccount,
        units,
        undefined,
        undefined,
        increasingPostingMeta
      );
      if (increasingAccountFilled) {
        txnPostings[increasingAccountIndex!] = increasingPosting;
      } else {
        txnPostings.push(increasingPosting);
      }
    }
  }
}

function parseWechatBill(): Transaction[] {
  const headers =
    '交易时间,交易类型,交易对方,商品,收/支,金额(元),支付方式,当前状态,交易单号,商户单号,备注';
  const startIndex = 18;

  const config = JSON.parse(
    fs.readFileSync(CONFIG_FILE_PATH, 'utf-8')
  ) as WeChatConfig;
  _accountsAsIs = config.AsIs;
  _rules = config.rules;

  const billContent = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
  const lines = parse(billContent, {
    columns: headers.split(','),
    from_line: startIndex,
  }) as WeChatBillEntry[];

  const transactions: Transaction[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const date = new Date(line['交易时间']);
    const flag = '*';
    const payee = line['交易对方'];
    const narration = line['商品'];
    const tags = new Set<string>();
    const links = new Set<string>();

    let postings: Posting[] = [];

    // Apply rules from wechat_config.json
    for (const ruleKey in _rules) {
      const rule = _rules[ruleKey];
      const conditions = rule.conditions;
      const action = rule.action;

      let match = false;
      if (conditionsMet(conditions, line)) {
        match = true;
        console.log(`Rule ${ruleKey} matched`, '  for', '\n', line);
        performAction(rule, line, postings);
      }
    }

    if (postings.length !== 0) {
      count += 1;
    }

    const txn: Transaction = {
      meta: {
        transaction_time: line['交易时间'],
        transaction_category: line['交易类型'],
        payee: line['交易对方'],
        commodity: line['商品'],
        incomeORexpenditure: line['收/支'],
        amount: line['金额(元)'],
        payment_method: line['支付方式'],
        current_status: line['当前状态'],
        transaction_id: line['交易单号'],
        merchant_order_id: line['商户单号'],
        remarks: line['备注'],
      },
      date,
      flag,
      payee,
      narration,
      tags,
      links,
      postings,
    };

    transactions.push(txn);
  }

  return transactions;
}
const extracted = parseWechatBill();
console.log('total:  ', count);

export const wechatTransactions = parseWechatBill();
