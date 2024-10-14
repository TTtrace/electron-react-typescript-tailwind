import React, { Dispatch, useState } from 'react';

import TextField from '@mui/material/TextField';
import { Amount, Posting, Transaction } from '../electron/data_types';
import { Button } from '@mui/material';

// 定义 Action 类型
export type TransactionAction = {
  type: string;
  updated: string;
  index?: number;
};
export const transactionReducer: React.Reducer<Transaction, TransactionAction> =
  function (txn: Transaction, action: TransactionAction): Transaction {
    switch (action.type) {
      case 'posting_account':
        return {
          ...txn,
          postings: txn.postings.map((posting, i) =>
            i === action.index
              ? { ...posting, account: action.updated }
              : posting
          ),
        };
      default:
        return txn;
    }
  };

function PostingArea({
  posting,
  isCurrent,
  onButtonClick,
}: {
  posting: Posting;
  isCurrent: boolean;
  onButtonClick: () => void;
}) {
  return (
    <div className="posting-area flex gap-2.5">
      <Button
        variant={isCurrent ? 'contained' : 'outlined'}
        className="w-64"
        onClick={onButtonClick}
      >
        {posting.account}
      </Button>
      <TextField value={posting.units?.toString()} variant="outlined" />
    </div>
  );
}

export default function TransactionArea({
  txn,
  dispatchTxn,
  currentAccountIndex,
  setCurrentAccountIndex,
}: {
  txn: Transaction;
  dispatchTxn: Dispatch<TransactionAction>;
  currentAccountIndex: number;
  setCurrentAccountIndex: Dispatch<number>;
}) {
  return (
    <div className="transaction-area w-2/5">
      <div className="DatePayeeNarration flex gap-2.5 pl-2">
        <TextField
          value={txn.date.toISOString().slice(0, 10)}
          variant="outlined"
        />
        <TextField value={txn.flag} variant="outlined" />
        <TextField value={txn.payee || ' '} variant="outlined" />
        <TextField value={txn.narration} variant="outlined" />
      </div>
      <div className="meta-area flex flex-col gap-3 pl-6 mt-2">
        {Object.entries(txn.meta).map(([key, value]) => (
          <TextField
            key={key}
            label={key}
            value={value}
            variant="standard"
            className="ml-1.25 text-left"
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />
        ))}
      </div>
      <div className="postings-area flex flex-col pl-2">
        {txn.postings.map((posting, index) => (
          <PostingArea
            key={index}
            posting={posting}
            isCurrent={index === currentAccountIndex}
            onButtonClick={() => setCurrentAccountIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
