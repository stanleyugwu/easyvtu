//import libraries
import React from 'react';
import Text from './Text';
import tw from '../lib/tailwind';
import useAppStore from '../store';
import formatAmount from '../utils/formatAmount';

// Simple static component for showing wallet balance
const WalletBalance = () => {
  const balance = useAppStore(state => state?.profile?.wallet_balance);
  if (balance)
    return (
      <Text
        type="caption"
        style={tw`border-dashed self-start px-2 border-[1.2px] border-primary`}
        children={`Bal: \u20A6${formatAmount(balance)}`}
      />
    );
  return null;
};

export default React.memo(WalletBalance, () => false);
