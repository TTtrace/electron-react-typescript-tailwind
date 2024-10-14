import Big from 'big.js';

export type Account = { account_name: string; account_id: string };

export type Accounts = {
  Assets: Account[];
  Expenses: Account[];
};

export class Amount {
  private number: Big;
  private currency: string;

  constructor(number: number | string, currency: string) {
    this.number = new Big(number);
    this.currency = currency;
  }

  toString() {
    return `${this.number.toString()} ${this.currency}`;
  }
}

export class Posting {
  account: string;
  units?: Amount;
  // cost
  price?: Amount;
  flag?: string;
  meta?: Record<string, any>;

  constructor(
    account: string,
    units?: Amount,
    price?: Amount,
    flag?: string,
    meta?: Record<string, any>
  ) {
    this.account = account;
    this.units = units;
    this.price = price;
    this.flag = flag;
    this.meta = meta;
  }
}

export class Transaction {
  meta: Record<string, string>;
  date: Date;
  flag: string;
  payee: string;
  narration: string;
  tags: ReadonlySet<string>;
  links: ReadonlySet<string>;
  postings: Posting[];

  constructor(
    meta: Record<string, string>,
    date: Date,
    flag: string,
    payee = '',
    narration: string,
    tags: ReadonlySet<string>,
    links: ReadonlySet<string>,
    postings: Posting[]
  ) {
    this.meta = meta;
    this.date = date;
    this.flag = flag;
    this.payee = payee;
    this.narration = narration;
    this.tags = tags;
    this.links = links;
    this.postings = postings;
  }
}

/**
    {
      "交易时间": "2024-03-11 18:18:50",
      "交易类型": "商户消费",
      "交易对方": "铁旅科技",
      "商品": "机票",
      "收/支": "支出",
      "金额(元)": "¥840.00",
      "支付方式": "零钱通",
      "当前状态": "支付成功",
      "交易单号": "4200002218202403119333780346\t",
      "商户单号": "1V1V0101706785620240311181839558\t",
      "备注": "/",
    }
 */
export type WeChatBillEntry = {
  交易时间: string;
  交易类型: string;
  交易对方: string;
  商品: string;
  '收/支': string;
  '金额(元)': string;
  支付方式: string;
  当前状态: string;
  交易单号: string;
  商户单号: string;
  备注: string;
};

export type TransactionRule = {
  definitive: boolean;
  conditions: {
    [key: string]: string | string[];
  };
  action: {
    [key: string]: string;
  };
};

export type WeChatRules = {
  [ruleName: string]: TransactionRule;
};

export type WeChatConfig = {
  AsIs: Record<string, string>;
  rules: WeChatRules;
};
