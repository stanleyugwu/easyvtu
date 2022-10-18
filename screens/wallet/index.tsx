//import libraries
import React, {useMemo, useRef, useState} from 'react';
import {View, ScrollView, RefreshControl, TouchableOpacity} from 'react-native';
import Text from '../../components/Text';
import tw from '../../lib/tailwind';
import AppHeader from '../../components/AppHeader';
import WalletCard from '../../components/Wallet';
import {TabScreen} from '../../navigation/screenParams';
import {SafeAreaView} from 'react-native-safe-area-context';
import TransactionCard from './TransactionCard';
import FlatViewError from '../../components/FlatViewError';
import FlatViewLoader from '../../components/FlatViewLoader';
import {useQuery} from 'react-query';
import _axios from '../../api/axios';
import {WalletTransaction} from './wallet';
import RefreshErrorSnackBar from '../../components/SnackBar';
import * as Animatable from 'react-native-animatable';
import CloseIcon from 'assets:images/close.svg';
import formatAmount from '../../utils/formatAmount';
import SafeAreaScrollView from '../../components/SafeAreaScrollView';

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

type ReceiptInfo = {
  id: string;
  amount: number;
  paymentMethod: string;
  type: string;
  status: string;
  date: string;
};
// Wallet Screen Component
const Wallet = ({
  route: {params: {action} = {}},
  navigation: {navigate},
}: TabScreen<'Wallet'>) => {
  const query = useQuery(
    'wallet_history',
    () => _axios.get<WalletTransaction[]>('/wallet_transactions'),
    {
      refetchOnWindowFocus: 'always',
      onError(err) {
        // show error via snackbar when user refreshed
        if (refreshingHistory) {
          setRefreshError('Failed to refresh wallet history');
        }
      },
    },
  );

  // receipt modal
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const receiptInfo = useRef<ReceiptInfo>();

  // refresh control component and states
  const [refreshingHistory, setRefreshingHistory] = useState(false);
  const [refreshError, setRefreshError] = useState('');
  const RefreshControlComponent = React.useMemo(
    () => (
      <RefreshControl
        refreshing={refreshingHistory}
        onRefresh={() => {
          setRefreshingHistory(true);

          // refetch query on refresh and show errors via custom error snackbar
          // instead of unmounting rendered data
          query.refetch().finally(() => setRefreshingHistory(false));
        }}
      />
    ),
    [refreshingHistory],
  );

  // wallet action callbacks
  const handleAddMoney = React.useCallback(() => {}, []);
  const handleWithdrawMoney = React.useCallback(() => {}, []);

  // overlay tx receipt modal
  const ReceiptModal = useMemo(
    () => () => {
      const info = receiptInfo.current!;
      const viewRef = useRef<Animatable.View>(null);
      return (
        <Animatable.View
          animation={'slideInUp'}
          duration={500}
          // @ts-ignore
          ref={viewRef}
          style={tw`p-4 absolute inset-0 bg-gray5`}>
          <TouchableOpacity
            onPress={() => {
              viewRef.current
                ?.fadeOutDownBig?.(500)
                .then(v => v.finished && setReceiptModalVisible(false));
            }}
            activeOpacity={0.8}
            style={tw.style(`bg-white rounded-full p-2.5 shadow-xl w-11 h-11`)}>
            <CloseIcon width="100%" height="100%" />
          </TouchableOpacity>
          <Text type="title" color="black" style={tw`mt-4`}>
            {info.type === 'Deposit' ? 'Wallet Deposit' : 'Wallet Withdrawal'}
          </Text>
          <Text type="caption" color="gray">
            Below is a receipt with the details of the wallet
            {info.type === 'Deposit' ? ' top-up' : ' withdrawal'} transaction
          </Text>

          <View style={tw`rounded-md bg-white shadow-md p-4 mt-8`}>
            <InfoItem label="Status:" value={info.status} />
            <InfoItem
              label={`Amount ${
                info.type === 'Deposit' ? 'Deposited:' : 'Withdrawn:'
              }`}
              value={`\u20A6${formatAmount(info.amount)}`}
            />
            <InfoItem label="Payment Method:" value={info.paymentMethod} />
            <InfoItem label="Transaction ID:" value={info.id} />
            <InfoItem label="Date:" value={new Date(info.date).toUTCString()} />
          </View>
        </Animatable.View>
      );
    },
    [receiptInfo.current],
  );

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
          visible={query.isLoading && !query.data}
          style={tw`mt-6`}
          text="Loading history"
        />

        {/* ERROR VIEW */}
        <FlatViewError
          // we don't want to unmount rendered data to show error on refresh
          // we'll show refresh errors via snackbar
          visible={query.isError && !query.data}
          text={(query.error as {message: string})?.message}
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
                        id: transaction.trans_no,
                        amount: transaction.amount,
                        paymentMethod: transaction.payment_method,
                        type: transaction.type,
                        status: transaction.status,
                        date: transaction.created_at,
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
      {receiptModalVisible ? <ReceiptModal /> : null}
    </SafeAreaView>
  );
};

export default Wallet;
