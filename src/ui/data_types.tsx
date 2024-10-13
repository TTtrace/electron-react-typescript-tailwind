export type Account = { account_name: string; account_id: string };

export type Accounts = {
  Assets: Account[];
  Expenses: Account[];
};

export class Amount {
  private number: number;
  private currency: string;
  constructor(number: number, currency: string) {
    this.number = number;
    this.currency = currency;
  }
  toString() {
    return `${this.number} ${this.currency}`;
  }
}

export type Posting = {
  account: string;
  units?: Amount;
  // cost
  price?: Amount;
  flag?: string;
  meta?: Record<string, any>;
};

export interface Transaction {
  meta: Record<string, string>;
  date: Date;
  flag: string;
  payee?: string;
  narration: string;
  tags: ReadonlySet<string>;
  links: ReadonlySet<string>;
  postings: Posting[];
}
