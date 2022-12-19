//import libraries
import React, {useCallback} from 'react';
import {Alert} from 'react-native';

import SafeAreaScrollView from '~components/SafeAreaScrollView';
import AppHeader from '~components/AppHeader';
import OptionCard from './OptionCardButton';
import useAuth from '../../hooks/useAuth';

import type {
  StackAndTabScreen,
  StackAndTabParamList,
} from '../../navigation/screenParams';

import ProfileVerifiedIcon from '~images/profile_verified.svg';
import HistoryIcon from '~images/history_colored.svg';
import WalletIcon from '~images/wallet_colored.svg';
import KeyIcon from '~images/key.svg';
import ChatIcon from '~images/chat_bubble.svg';
import LogoutIcon from '~images/logout.svg';

// type StackAndTabScreen = (StackScreen> & TabScreen);

// MoreOption Screen Component
const MoreOption = ({
  navigation: {navigate},
}: StackAndTabScreen<'MoreOption'>) => {
  // navigator util shorthand
  const goto = (screenName: keyof StackAndTabParamList) => () =>
    // @ts-ignore
    navigate(screenName);
  const auth = useAuth();

  // handles logging out
  const handleLogout = useCallback(() => {
    Alert.alert(
      'Are you sure to sign out?',
      'All currently stored credentials and state will be lost',
      [
        {text: 'STAY BACK', style: 'cancel'},
        {text: 'SIGN OUT', style: 'destructive', onPress: _ => auth.signOut()},
      ],
    );
  }, []);

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
        onPress={goto('History')}
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
        onPress={goto('ChangePassword')}
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
