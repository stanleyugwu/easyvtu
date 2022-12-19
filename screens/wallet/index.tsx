//import libraries
import React, {useRef, useState} from 'react';
import {View, ScrollView, RefreshControl} from 'react-native';
import Text from '~components/Text';
import tw from '../../lib/tailwind';
import AppHeader from '~components/AppHeader';
import WalletCard from '~components/Wallet';
import {TabScreen} from '../../navigation/screenParams';
import {SafeAreaView} from 'react-native-safe-area-context';
import TransactionCard from './TransactionCard';
import FlatViewError from '~components/FlatViewError';
import FlatViewLoader from '~components/FlatViewLoader';
import {useQuery} from 'react-query';
import _axios from '../../api/axios';
import {ReceiptInfo, WalletTransaction} from './wallet';
import RefreshErrorSnackBar from '~components/SnackBar';
import formatAmount from '../../utils/formatAmount';
import {ServerErrorObject, SuccessObject} from '../../api/api';
import TxReceiptOverlay from '~components/TxReceiptOverlay';
import {format} from 'timeago.js';

// renders individual item for receipt info overlay
interface InfoItemProps {
  /** text to the left */
  label: string;
  /** text to the right */
  value: string;
}
export const InfoItem = ({label, value}: InfoItemProps) => (
  <View style={tw`flex-row justify-between my-3`}>
    <Text type="caption" color="gray">
      {label}
    </Text>
    <Text type="small" color="black">
      {value}
    </Text>
  </View>
);

// Wallet Screen Component
const Wallet = ({
  route: {params: {action} = {}},
  navigation: {navigate},
}: TabScreen<'Wallet'>) => {
  const query = useQuery<
    SuccessObject<WalletTransaction[]>,
    ServerErrorObject,
    SuccessObject<WalletTransaction[]>
  >(
    'wallet_history',
    () => _axios.get<WalletTransaction[]>('/wallet_transactions'),
    {
      refetchOnWindowFocus: 'always',
      onError(err) {
        // show error via snackbar when user refreshed
        if (query.isRefetchError) {
          setRefreshError('Failed to refresh wallet history');
        }
      },
    },
  );

  // receipt modal
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const receiptInfo = useRef<ReceiptInfo>();

  // refresh control component and states
  const [refreshError, setRefreshError] = useState('');
  const RefreshControlComponent = React.useMemo(
    () => (
      <RefreshControl
        refreshing={query.isRefetching}
        onRefresh={() => {
          // refetch query on refresh and show errors via custom error snackbar
          // instead of unmounting rendered data
          query.refetch();
        }}
      />
    ),
    [query.isRefetching],
  );

  // wallet action callbacks
  const handleAddMoney = React.useCallback(() => {}, []);
  const handleWithdrawMoney = React.useCallback(() => {}, []);

  return (
    <SafeAreaView style={tw`p-4 bg-gray5 h-full`}>
      {/* Handles history refresh error */}
      <RefreshErrorSnackBar
        text={refreshError}
        onDismiss={() => setRefreshError('')}
        timeOut={3000}
      />
      <AppHeader title="Wallet" />
      <View style={tw`my-2`}>
        <WalletCard
          onAddMoneyBtnPress={handleAddMoney}
          onWithdrawMoneyBtnPress={handleWithdrawMoney}
        />
      </View>
      <Text type="subTitle" color="dark" style={tw`mb-2 mt-3`}>
        History
      </Text>

      <ScrollView
        // we only refresh when there's previously fetched data
        refreshControl={query.data && RefreshControlComponent}>
        {/* LOADER VIEW */}
        <FlatViewLoader
          // we don't want to unmount rendered data to show loader on refresh
          visible={query.isLoading}
          style={tw`mt-6`}
          text="Loading history"
        />

        {/* ERROR VIEW */}
        <FlatViewError
          // we don't want to unmount rendered data to show error on refresh
          // we'll show refresh errors via snackbar
          visible={query.isLoadingError}
          text={query.error?.message}
          onRetry={query.refetch}
          style={tw`mt-6`}
        />

        {query.data ? (
          query.data.data.length === 0 ? (
            <Text style={tw`text-center mt-6`} color="black">
              No Wallet History Yet
            </Text>
          ) : (
            query.data.data
              // @ts-ignore
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map(transaction => {
                return (
                  <TransactionCard
                    amount={transaction.amount}
                    date={transaction.created_at}
                    method={transaction.payment_method}
                    onPress={() => {
                      receiptInfo.current = {
                        'Transaction ID': transaction.trans_no,
                        Amount: `\u20A6${formatAmount(transaction.amount)}`,
                        'Payment Method': transaction.payment_method,
                        Type: transaction.type,
                        Status: transaction.status,
                        Date: format(new Date(transaction.created_at)),
                      };
                      setReceiptModalVisible(true);
                    }}
                    transactionType={
                      transaction.type === 'Deposit' ? 'deposit' : 'withdrawal'
                    }
                    key={transaction.id}
                  />
                );
              })
          )
        ) : null}
      </ScrollView>
      <TxReceiptOverlay
        receiptData={receiptInfo.current!}
        onClose={() => setReceiptModalVisible(false)}
        title={
          receiptInfo.current
            ? receiptInfo.current.Type === 'Deposit'
              ? 'Wallet Deposit'
              : 'Wallet Withdrawal'
            : ''
        }
        subTitle={`Below is a receipt with the details of the wallet ${
          receiptInfo.current
            ? receiptInfo.current.Type === 'Deposit'
              ? ' top-up'
              : ' withdrawal'
            : ''
        } transaction`}
        visible={receiptModalVisible}
      />
    </SafeAreaView>
  );
};

export default Wallet;
