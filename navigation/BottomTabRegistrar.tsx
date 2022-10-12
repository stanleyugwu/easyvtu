//import libraries
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React from 'react';
import tw from '../lib/tailwind';
import {TabParamList} from './screenParams';
import Text from '../components/Text';

import HomeIcon from '../assets/images/home.svg';
import ColoredHomeIcon from '../assets/images/home_colored.svg';

import HistoryIcon from '../assets/images/history.svg';
import ColoredHistoryIcon from '../assets/images/history_colored.svg';

import WalletIcon from '../assets/images/wallet.svg';
import ColoredWalletIcon from '../assets/images/wallet_colored.svg';

import ProfileIcon from '../assets/images/profile.svg';
import ColoredProfileIcon from '../assets/images/profile_colored.svg';

import Home from '../screens/home';
import Wallet from '../screens/wallet';

const History = () => {
  return <Text>HISTORY</Text>;
};

const Profile = () => {
  return <Text>Profile</Text>;
};

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
        tabBarStyle: tw`bg-white h-16`,
        tabBarActiveTintColor: tw.color('primary'),
        tabBarInactiveTintColor: tw.color('gray'),
        tabBarLabelStyle: tw`text-caption`,
      }}>
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon({focused}) {
            return focused ? <ColoredHomeIcon /> : <HomeIcon />;
          },
        }}
      />
      <BottomTab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon({focused}) {
            return focused ? <ColoredHistoryIcon /> : <HistoryIcon />;
          },
        }}
      />
      <BottomTab.Screen
        name="Wallet"
        component={Wallet}
        options={{
          tabBarIcon({focused}) {
            return focused ? <ColoredWalletIcon /> : <WalletIcon />;
          },
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon({focused}) {
            return focused ? <ColoredProfileIcon /> : <ProfileIcon />;
          },
        }}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigatorRegistrar;
