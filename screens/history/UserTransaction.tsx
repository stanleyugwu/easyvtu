//import libraries
import React from 'react';
import {View, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import Text from '~components/Text';
import tw from '../../lib/tailwind';
import type {service, UserTxHistory} from './history';
import formatAmount from '../../utils/formatAmount';
import {format} from 'timeago.js';

// service assets
import AirtimeIcon from '~images/call_icon.svg';
import DataIcon from '~images/data_icon.svg';
import CableIcon from '~images/cable_icon.svg';
import ResultIcon from '~images/card_icon.svg';
import ElectricityIcon from '~images/electricity_icon.svg';

type PropKeys = 'amount' | 'created_at' | 'payment_method' | 'phone';
interface UserTxHistoryProps extends Pick<UserTxHistory, PropKeys> {
  /**
   * type of service this transaction represents e.g "airtime"
   */
  serviceType: service;
  onPress?: TouchableOpacityProps['onPress'];
  style?: TouchableOpacityProps['style'];
}

// UserTxHistory component showing individual transaction
const UserTransaction = ({
  amount,
  created_at,
  payment_method,
  phone,
  serviceType,
  onPress,
  style,
}: UserTxHistoryProps) => {
  // just maps between service type passed to component and
  // longer name of the service
  const longServiceName: Record<service, string> = {
    airtime: 'Airtime',
    data: 'Data bundle',
    result: 'Result checker',
    tv: 'Cable subscription',
    electricity: 'Electricity',
  };
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        tw`bg-white rounded-md shadow-sm flex-row items-center justify-between px-4 py-2 my-1`,
        style,
      ]}
      onPress={onPress}>
      <View style={tw`flex-row items-center justify-center`}>
        {serviceType === 'airtime' ? (
          <AirtimeIcon width="30" height="30" />
        ) : serviceType === 'data' ? (
          <DataIcon width="30" height="30" />
        ) : serviceType === 'result' ? (
          <ResultIcon width="30" height="30" />
        ) : serviceType === 'electricity' ? (
          <ElectricityIcon width="30" height="30" />
        ) : (
          <CableIcon width="30" height="30" />
        )}
        <View style={tw`ml-3`}>
          <Text color="gray" type="caption">
            {longServiceName[serviceType]}
          </Text>
          <Text color="black">{phone}</Text>
          <View style={tw`flex-row items-center`}>
            <Text type="small" color="gray">
              {payment_method}
            </Text>
            <Text> - </Text>
            <Text type="small" color="gray">
              {format(new Date(created_at))}
            </Text>
          </View>
        </View>
      </View>
      <Text color="black">
        {'\u20A6'}
        {formatAmount(amount)}
      </Text>
    </TouchableOpacity>
  );
};

export default UserTransaction;
