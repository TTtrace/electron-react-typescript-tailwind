import React, { useReducer, useState } from 'react';
import './App.css';
import ConfigArea from './ConfigArea';
import TransactionArea, { transactionReducer } from './TransactionArea';
import ConfirmAccountArea from './ConfirmAccountArea';
import { Accounts } from '../electron/data_types';
import { createTestTransaction } from './testdata';

function App() {
  const accounts: Accounts = {
    Assets: [
      { account_name: '零钱', account_id: 'Assets:WeChat:LingQian' },
      { account_name: '零钱通', account_id: 'Assets:WeChat:LingQianTong' },
      {
        account_name: '工商银行储蓄卡(0183)',
        account_id: 'Assets:ICBC:Debit:0183',
      },
      {
        account_name: '招商银行储蓄卡(4635)',
        account_id: 'Assets:CMB:Debit:4635',
      },
    ],
    Expenses: [
      { account_name: '正餐消费', account_id: 'Expenses:EatDrink:Meals' },
      { account_name: '零食消费', account_id: 'Expenses:EatDrink:Snacks' },
      { account_name: '娱乐消费', account_id: 'Expenses:Entertainment' },
      { account_name: '日常花销', account_id: 'Expenses:DailyExpenditures' },
    ],
  };
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  const [txn, dispatchTxn] = useReducer(
    transactionReducer,
    createTestTransaction()
  );
  return (
    <div className="App">
      <div>
        <ConfigArea />
      </div>
      <div className="flex gap-3">
        <TransactionArea
          txn={txn}
          dispatchTxn={dispatchTxn}
          currentAccountIndex={currentAccountIndex}
          setCurrentAccountIndex={setCurrentAccountIndex}
        />
        <ConfirmAccountArea
          accounts={accounts}
          dispatchTxn={dispatchTxn}
          currentAccountIndex={currentAccountIndex}
        />
      </div>
    </div>
  );
}

export default App;
