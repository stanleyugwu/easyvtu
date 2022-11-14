//import libraries
import React, {useState} from 'react';
import {View} from 'react-native';
import Text from './Text';
import tw from '../lib/tailwind';
import AnimatedLottieView from 'lottie-react-native';
import walletAnimation from '../assets/json/wallet.json';
import useAppStore from '../store';
import Button from './Button';
import formatAmount from '../utils/formatAmount';

interface WalletProps {
  /**
   * Function to be called when `Add money` button is pressed
   */
  onAddMoneyBtnPress: () => void;

  /**
   * Function to be called when `Withdraw` button is prssed
   */
  onWithdrawMoneyBtnPress: () => void;
}
// Self-contained Wallet Component
const Wallet = ({onAddMoneyBtnPress, onWithdrawMoneyBtnPress}: WalletProps) => {
  const [balanceShown, setBalanceShown] = useState(false);
  const walletBal = useAppStore(state => state.profile?.wallet_balance!);

  return (
    <>
      <View style={tw`bg-white flex-row justify-between shadow-md rounded-lg`}>
        <View style={tw`justify-between p-4`}>
          <View>
            <Text type="paragraph" color="black">
              Account Balance
            </Text>
            <Text type="paragraph" color="black" style={tw.style('text-2xl')}>
              {balanceShown
                ? `\u20A6${formatAmount(walletBal)}`
                : '*********'}
            </Text>
          </View>
          <Text
            type="caption"
            color="secondary"
            onPress={() => setBalanceShown(!balanceShown)}>
            {balanceShown ? 'HIDE' : 'SHOW'} BALANCE
          </Text>
        </View>
        <View style={tw`h-28 w-32`}>
          <AnimatedLottieView
            autoPlay
            style={[tw`self-center`]}
            resizeMode="cover"
            speed={1}
            source={walletAnimation}
          />
        </View>
      </View>
      <View style={tw`flex-row justify-between mt-2`}>
        <Button
          label="Add money"
          style={tw`flex-0.45`}
          onPress={onAddMoneyBtnPress}
        />
        <Button
          label="Withdraw"
          gradientType="secondary"
          style={tw`flex-0.45`}
          onPress={onWithdrawMoneyBtnPress}
        />
      </View>
    </>
  );
};

export default Wallet;
