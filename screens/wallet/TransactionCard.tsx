//import libraries
import React from 'react';
import {View, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import Text from '~components/Text';
import tw from '../../lib/tailwind';
import DepositIcon from '~images/deposit.svg';
import WithdrawIcon from '~images/withdraw.svg';
import {format} from 'timeago.js';
import formatAmount from '../../utils/formatAmount';

interface TransactionCardProps extends TouchableOpacityProps {
  /**
   * transaction type
   */
  transactionType: 'deposit' | 'withdrawal';

  /**
   * widthdrawal or deposit transaction method
   */
  method: string;

  /**
   * transaction date
   */
  date: string | number;

  /**
   * transaction amount
   */
  amount: number;
}

// TransactionCard Component
const TransactionCard = ({
  amount,
  date = Date.now(),
  method,
  transactionType = 'deposit',
  style,
  ...otherProps
}: TransactionCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        tw`bg-white rounded-md shadow-sm flex-row items-center justify-between px-4 py-2 my-1`,
        style,
      ]}
      {...otherProps}>
      <View style={tw`flex-row items-center justify-center`}>
        {transactionType === 'deposit' ? (
          <DepositIcon width="25" height="25" />
        ) : (
          <WithdrawIcon width="25" height="25" />
        )}
        <View style={tw`ml-3`}>
          <Text color="gray" type="caption">
            {method}
          </Text>
          <Text color="black">
            {transactionType === 'deposit' ? 'Deposit' : 'withdrawal'}
          </Text>
          <Text type="small" color="gray">
            {format(new Date(date))}
          </Text>
        </View>
      </View>
      <Text color="black">
        {'\u20A6'}
        {formatAmount(amount)}
      </Text>
    </TouchableOpacity>
  );
};

export default TransactionCard;
