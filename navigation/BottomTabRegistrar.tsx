//import libraries
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import tw from '../lib/tailwind';
import {TabParamList} from './screenParams';
import Text from '~components/Text';

import HomeIcon from '../assets/images/home.svg';
import ColoredHomeIcon from '../assets/images/home_colored.svg';

import HistoryIcon from '../assets/images/history.svg';
import ColoredHistoryIcon from '../assets/images/history_colored.svg';

import WalletIcon from '../assets/images/wallet.svg';
import ColoredWalletIcon from '../assets/images/wallet_colored.svg';

import ProfileIcon from '../assets/images/profile.svg';
import ColoredProfileIcon from '../assets/images/profile_colored.svg';

// tab screens
import Home from '../screens/home';
import Wallet from '../screens/wallet';
import Profile from '../screens/profile';
import History from '../screens/history';


/**
 * Create BottomTab navigator
 */
const BottomTab = createBottomTabNavigator<TabParamList>();

// BottomTabNavigator Screen Component
// declares the bottom tab navigator screens
// for signed in user
const BottomTabNavigatorRegistrar = () => {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: tw`bg-white h-14 md:h-16`,
        tabBarActiveTintColor: tw.color('primary'),
        tabBarInactiveTintColor: tw.color('gray'),
        tabBarLabelStyle: tw`text-caption text-center`,
        tabBarIconStyle:tw`self-center`
      }}>
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon({focused}) {
            return focused ? (
              <ColoredHomeIcon
                width={tw.prefixMatch('md') ? '35' : '30'}
                height={tw.prefixMatch('md') ? '35' : '30'}
              />
            ) : (
              <HomeIcon
                width={tw.prefixMatch('md') ? '35' : '30'}
                height={tw.prefixMatch('md') ? '35' : '30'}
              />
            );
          },
        }}
      />
      <BottomTab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon({focused}) {
            return focused ? (
              <ColoredHistoryIcon
                width={tw.prefixMatch('md') ? '35' : '30'}
                height={tw.prefixMatch('md') ? '35' : '30'}
              />
            ) : (
              <HistoryIcon
                width={tw.prefixMatch('md') ? '35' : '30'}
                height={tw.prefixMatch('md') ? '35' : '30'}
              />
            );
          },
        }}
      />
      <BottomTab.Screen
        name="Wallet"
        component={Wallet}
        options={{
          tabBarIcon({focused}) {
            return focused ? (
              <ColoredWalletIcon
                width={tw.prefixMatch('md') ? '35' : '30'}
                height={tw.prefixMatch('md') ? '35' : '30'}
              />
            ) : (
              <WalletIcon
                width={tw.prefixMatch('md') ? '35' : '30'}
                height={tw.prefixMatch('md') ? '35' : '30'}
              />
            );
          },
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon({focused}) {
            return focused ? (
              <ColoredProfileIcon
                width={tw.prefixMatch('md') ? '35' : '30'}
                height={tw.prefixMatch('md') ? '35' : '30'}
              />
            ) : (
              <ProfileIcon
                width={tw.prefixMatch('md') ? '35' : '30'}
                height={tw.prefixMatch('md') ? '35' : '30'}
              />
            );
          },
          unmountOnBlur: true,
        }}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigatorRegistrar;
