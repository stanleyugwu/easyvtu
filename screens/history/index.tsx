//import libraries
import React from 'react';
import AppHeader from '~components/AppHeader';
import Text from '~components/Text';
import {FlatList, View, RefreshControl} from 'react-native';
import tw from '../../lib/tailwind';
import {useQuery} from 'react-query';
import _axios from '../../api/axios';
import FlatViewLoader from '~components/FlatViewLoader';
import FlatViewError from '~components/FlatViewError';
import {ServerErrorObject, SuccessObject} from '../../api/api';
import UserTransaction from './UserTransaction';
import formatAmount from '../../utils/formatAmount';
import type {service, UserTxHistory, UserTxReceiptInfo} from './history';
import {SafeAreaView} from 'react-native-safe-area-context';
import SnackBar from '~components/SnackBar';
import ChartCircle from '~images/chart_circle.svg';
import TxReceiptOverlay from '~components/TxReceiptOverlay';
import {format} from 'timeago.js';

/**
 * Empty transaction component
 */
const EmptyHistory = (
  <View style={tw`mt-8 justify-center items-center`}>
    <Text>No User Transaction History Yet</Text>
  </View>
);

/**
 * dummy text placeholder component
 */
const TextPlaceHolder = (
  <View style={tw`flex-1 justify-center ml-2`}>
    <View style={tw`h-4 w-full bg-gray5`} />
    <View style={tw`h-4 w-6/12 bg-gray5 my-2`} />
    <View style={tw`h-4 w-10/12 bg-gray5`} />
    <View style={tw`h-4 w-4/12 bg-gray5 mt-2`} />
  </View>
);

/**
 * This function does an atomic search on a given string to detect the type of app service
 * e.g "airtime" or "data" being described in the string
 */
const detectServiceTypeFromString = (serviceName: string): service => {
  const service = serviceName.toLowerCase();
  return service.includes('airtime')
    ? 'airtime'
    : service.includes('data')
    ? 'data'
    : service.includes('tv') || service.includes('cable')
    ? 'tv'
    : service.includes('electricity') || service.includes('power')
    ? 'electricity'
    : 'result';
};

/**
 * Calculates percentage of individual app services subscription like airtime
 * from the users's transaction history
 */
const calculatePercentage = (
  data: UserTxHistory[],
  serviceType: service,
): string => {
  const serviceItemsCount = data.filter(
    history => detectServiceTypeFromString(history.service) === serviceType,
  ).length;
  return `${(serviceItemsCount / data.length) * 100}%`;
};

// History screen component showing user's transaction history
const History = () => {
  const query = useQuery<
    SuccessObject<UserTxHistory[]>,
    ServerErrorObject,
    SuccessObject<UserTxHistory[]>
  >(
    'user_tx_history',
    () => _axios.get<UserTxHistory[]>('/transaction_history'),
    {
      onError(err) {
        if (query.isRefetchError) {
          setRefreshError('Error refreshing transactions history');
        }
      },
      refetchOnWindowFocus: 'always',
    },
  );

  // receipt modal
  const [receiptModalVisible, setReceiptModalVisible] = React.useState(false);
  let receiptInfo = React.useRef<UserTxReceiptInfo | undefined>();
  // refresh control component and states
  const [refreshError, setRefreshError] = React.useState<undefined | string>();
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

  return (
    <>
      <SafeAreaView style={tw`p-4 bg-gray5 h-full`}>
        <AppHeader title={'Purchase History'} />
        <View style={tw`flex-row bg-white items-center rounded-lg p-4 mt-4`}>
          <View>
            <ChartCircle width={tw.prefixMatch("sm") ? '140' : '120'} height={tw.prefixMatch("sm") ? '140' : '120'} />
            {query.data?.data ? (
              <View
                style={tw.style(
                  {display: query.data?.data ? 'flex' : 'none'},
                  'text-center items-center absolute self-center h-full justify-center',
                )}>
                <Text type="caption" color="gray">
                  Total Spent
                </Text>
                <Text>
                  {'\u20A6'}
                  {formatAmount(
                    query
                      .data!.data.map(history => history.amount)
                      .reduce((p, v) => p + v),
                  )}
                </Text>
              </View>
            ) : (
              <FlatViewLoader
                visible={query.isLoading}
                text="Loading"
                style={tw`text-center items-center absolute self-center h-full justify-center`}
              />
            )}
          </View>

          {query.data?.data ? (
            <View style={tw`justify-center flex-1 pl-6`}>
              <Text color="gray" style={tw`my-0.5`} type={tw.prefixMatch("sm") ? "paragraph" : "caption"}>
                Airtime: {calculatePercentage(query.data.data, 'airtime')}
              </Text>
              <Text color="gray" style={tw`my-0.5`} type={tw.prefixMatch("sm") ? "paragraph" : "caption"}>
                Data Bundle: {calculatePercentage(query.data.data, 'data')}
              </Text>
              <Text color="gray" style={tw`my-0.5`} type={tw.prefixMatch("sm") ? "paragraph" : "caption"}>
                Cable Tv: {calculatePercentage(query.data.data, 'tv')}
              </Text>
              <Text color="gray" style={tw`my-0.5`} type={tw.prefixMatch("sm") ? "paragraph" : "caption"}>
                Electricity:{' '}
                {calculatePercentage(query.data.data, 'electricity')}
              </Text>
              <Text color="gray" style={tw`my-0.5`} type={tw.prefixMatch("sm") ? "paragraph" : "caption"}>
                Result Checking:{' '}
                {calculatePercentage(query.data.data, 'result')}
              </Text>
            </View>
          ) : (
            TextPlaceHolder
          )}
        </View>
        {query.isLoading ? (
          <FlatViewLoader
            text="Loading Transaction History"
            visible={query.isLoading}
            style={tw`mt-10`}
          />
        ) : query.isLoadingError ? (
          <FlatViewError
            text={query.error.message}
            onRetry={query.refetch}
            visible={query.isLoadingError}
            style={tw`mt-8`}
          />
        ) : (
          <FlatList
            style={tw`mt-4`}
            refreshControl={query.data?.data && RefreshControlComponent}
            data={query.data?.data.sort(
              // @ts-ignore
              (a, b) => new Date(b.created_at) - new Date(a.created_at),
            )}
            scrollEnabled
            renderItem={({item}) => (
              <UserTransaction
                amount={item.amount}
                created_at={item.created_at}
                payment_method={item.payment_method}
                phone={item.phone}
                serviceType={detectServiceTypeFromString(item.service)}
                key={item.id}
                onPress={() => {
                  receiptInfo.current = {
                    Service: item.service,
                    Amount: `\u20A6${formatAmount(item.amount)}`,
                    'Payment Method': item.payment_method,
                    Receipient: item.phone,
                    'Transaction ID': item.trans_no,
                    Status: item.status,
                    Date: format(new Date(item.created_at)),
                  };
                  setReceiptModalVisible(true);
                }}
              />
            )}
            ListEmptyComponent={EmptyHistory}
          />
        )}
      </SafeAreaView>
      <SnackBar
        text={refreshError}
        onDismiss={() => setRefreshError(undefined)}
      />
      <TxReceiptOverlay
        visible={receiptModalVisible}
        onClose={() => setReceiptModalVisible(false)}
        receiptData={receiptInfo.current!}
        title={receiptInfo.current ? receiptInfo.current.Service : ''}
        subTitle={`Below is a receipt with the details of the ${
          receiptInfo.current ? receiptInfo.current.Service : ''
        } transaction`}
      />
    </>
  );
};

export default History;
