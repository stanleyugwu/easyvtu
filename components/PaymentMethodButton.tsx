//import libraries
import React from 'react';
import {TouchableOpacity, TouchableOpacityProps, View} from 'react-native';
import Text from './Text';
import tw from '../lib/tailwind';
import AngleRightIcon from '~images/angle_right.svg';

// payment method icons
import FlutterWaveIcon from '~images/flutterwave.svg';
import BankIcon from '~images/bank.svg';
import BitcoinIcon from '~images/bitcoin.svg';
import WalletIcon from '~images/wallet_colored.svg';

export enum PAYMENT_METHODS {
  FLUTTERWAVE = 'Flutterwave',
  BITCOIN = 'Bitcoin Transfer',
  WALLET = 'Wallet',
  BANK_TRANSFER = 'Bank Transfer',
}

interface PaymentMethodButtonProps {
  /**
   * Determines the payment method being represented
   */
  method: PAYMENT_METHODS;

  /**
   * Optional custom button label
   */
  label?: string;

  /**
   * Function called when button is pressed
   */
  onPress: () => void;

  /**
   * Style
   */
  style?: TouchableOpacityProps['style'];
}

// Polymorphic payment button component for app-supported payment methods
const PaymentMethodButton = ({
  method,
  style,
  label,
  onPress,
}: PaymentMethodButtonProps) => {
  const PaymentMethodIcon =
    method === PAYMENT_METHODS.FLUTTERWAVE
      ? FlutterWaveIcon
      : method === PAYMENT_METHODS.BANK_TRANSFER
      ? BankIcon
      : method === PAYMENT_METHODS.BITCOIN
      ? BitcoinIcon
      : WalletIcon;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        tw`bg-gray5 flex-row my-2 rounded-lg p-3 justify-between items-center`,
        style,
      ]}
      onPress={onPress}>
      <View style={tw`flex-row items-center`}>
        <View
          style={tw`rounded-lg items-center p-2 bg-white flex-row justify-between`}>
          <PaymentMethodIcon
            width={tw.prefixMatch('sm') ? 40 : 35}
            height={tw.prefixMatch('sm') ? 40 : 35}
          />
        </View>
        <Text color="black" style={tw`ml-4`}>
          {label || method}
        </Text>
      </View>
      <AngleRightIcon style={tw`mr-4`} />
    </TouchableOpacity>
  );
};

export default PaymentMethodButton;
