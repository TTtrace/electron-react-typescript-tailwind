import { Accounts, Account } from './data_types';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { TransactionAction } from './TransactionArea';
import { Dispatch } from 'react';

interface AccountsChipsProps {
  accounts: Account[];
  title: string;
  dispatchTxn: Dispatch<TransactionAction>;
  currentAccountIndex: number;
}

const AccountsChips = ({
  accounts,
  title,
  dispatchTxn,
  currentAccountIndex,
}: AccountsChipsProps) => {
  return (
    <div>
      <h3 className="text-left pl-3">{title}</h3>
      <div className="flex justify-start">
        {accounts.map((account, index) => (
          <Chip
            key={index}
            label={account.account_name}
            variant="outlined"
            style={{ margin: '4px' }}
            onClick={() =>
              dispatchTxn({
                type: 'posting_account',
                updated: account.account_id,
                index: currentAccountIndex,
              })
            }
          />
        ))}
      </div>
    </div>
  );
};

export default function ConfirmAccountArea({
  accounts,
  dispatchTxn,
  currentAccountIndex,
}: {
  accounts: Accounts;
  dispatchTxn: Dispatch<TransactionAction>;
  currentAccountIndex: number;
}) {
  return (
    <div className="ConfirmAccountArea">
      <AccountsChips
        accounts={accounts.Assets}
        title="Assets"
        dispatchTxn={dispatchTxn}
        currentAccountIndex={currentAccountIndex}
      />
      <Divider style={{ margin: '8px 0' }} />
      <AccountsChips
        accounts={accounts.Expenses}
        title="Expenses"
        dispatchTxn={dispatchTxn}
        currentAccountIndex={currentAccountIndex}
      />
    </div>
  );
}
