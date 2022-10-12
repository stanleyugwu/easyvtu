//import libraries
import React, {useState} from 'react';
import {View, ScrollView, RefreshControl} from 'react-native';
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

  return (
    <SafeAreaView style={tw`p-4 bg-gray5 h-full`}>
      {/* Handles history refresh error */}
      <RefreshErrorSnackBar
        text={refreshError}
        onDismiss={() => setRefreshError('')}
        timeOut={3000}
      />
      <AppHeader title="Wallet" />
      <View style={tw`my-4`}>
        <WalletCard
          onAddMoneyBtnPress={handleAddMoney}
          onWithdrawMoneyBtnPress={handleWithdrawMoney}
        />
      </View>
      <Text type="subTitle" color="dark" style={tw`mb-2 mt-3`}>
        History
      </Text>

      <ScrollView
        style={tw`flex-1`}
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

        {query.data
          ? query.data.data
              // @ts-ignore
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map(transaction => {
                return (
                  <TransactionCard
                    amount={transaction.amount}
                    date={transaction.created_at}
                    method={transaction.payment_method}
                    onPress={() =>
                      navigate('WalletTransactionReceipt', {
                        id: transaction.trans_no,
                        amount: transaction.amount,
                        paymentMethod: transaction.payment_method,
                        type: transaction.type,
                        status: transaction.status,
                        date: transaction.created_at,
                      })
                    }
                    transactionType={
                      transaction.type === 'Deposit' ? 'deposit' : 'withdrawal'
                    }
                    key={transaction.id}
                  />
                );
              })
          : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Wallet;
