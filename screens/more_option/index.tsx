//import libraries
import React from 'react';
import {Alert} from 'react-native';

import SafeAreaScrollView from '../../components/SafeAreaScrollView';
import AppHeader from '../../components/AppHeader';
import OptionCard from './OptionCardButton';

import type {StackParamList, StackScreen} from '../../navigation/screenParams';

import ProfileVerifiedIcon from 'assets:images/profile_verified.svg';
import HistoryIcon from 'assets:images/history_colored.svg';
import WalletIcon from 'assets:images/wallet_colored.svg';
import KeyIcon from 'assets:images/key.svg';
import ChatIcon from 'assets:images/chat_bubble.svg';
import LogoutIcon from 'assets:images/logout.svg';
import useAuth from '../../hooks/useAuth';

// MoreOption Screen Component
const MoreOption = ({navigation: {navigate}}: StackScreen<'MoreOption'>) => {
  // navigator util shorthand
  const goto = (screenName: keyof StackParamList) => () => navigate(screenName);
  const auth = useAuth();

  // handles logging out
  const handleLogout = () => {
    Alert.alert(
      'Are you sure to sign out?',
      'All currently stored credentials and state will be lost',
      [
        {text: 'STAY BACK', style: 'cancel'},
        {text: 'SIGN OUT', style: 'destructive', onPress: _ => auth.signOut()},
      ],
    );
  };

  return (
    <SafeAreaScrollView>
      <AppHeader title="More Options" />
      <OptionCard
        image={ProfileVerifiedIcon}
        title="Profile"
        subTitle="View and change your profile info"
        onPress={goto('Profile')}
      />
      <OptionCard
        image={HistoryIcon}
        title="Transaction History"
        subTitle="View your transaction history"
        onPress={goto('TransactionHistory')}
      />
      <OptionCard
        image={WalletIcon}
        title="Wallet"
        subTitle="Deposit or withdraw from wallet"
        onPress={goto('Wallet')}
      />
      <OptionCard
        image={KeyIcon}
        title="Change Password"
        subTitle="Reset your current password"
        onPress={goto('ResetPassword')}
      />
      <OptionCard
        image={ChatIcon}
        title="Contact Support"
        subTitle="Reach out to our customer support"
        onPress={goto('Support')}
      />
      <OptionCard
        image={LogoutIcon}
        title="Log Out"
        subTitle="Clears your current credentials"
        onPress={handleLogout}
      />
    </SafeAreaScrollView>
  );
};

export default MoreOption;
