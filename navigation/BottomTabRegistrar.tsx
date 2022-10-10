//import libraries
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import Text from '../components/Text';
import {TabParamList, TabScreen} from './screenParams';

const Home = ({route, navigation: {navigate}}: TabScreen<'Home'>) => {
  return <Text onPress={() => navigate('SignIn')}>HOME SWEET HOME</Text>;
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
    <BottomTab.Navigator>
      <BottomTab.Screen name="Home" component={Home} />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigatorRegistrar;
