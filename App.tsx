import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import tw from './lib/tailwind';
import {useDeviceContext} from 'twrnc';
import useCheckAuth from './hooks/useCheckAuth';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Text from './components/Text';
import AuthContext from './contexts/auth';

import type {StackParamList} from './navigation/screenParams';

import SplashScreen from './screens/splash';
import Landing from './screens/landing';
import SignIn from './screens/signIn';
import useAuth from './hooks/useAuth';
import useAppStore from './store';
import SignUp from './screens/signup';
import ForgotPassword from './screens/forgot_password';

const Home = () => {
  const auth = useAuth();
  const profile = useAppStore(state => state.profile);

  return (
    <Text onPress={() => auth.signOut()}>
      HOME SWEET HOME {profile?.lastname}
    </Text>
  );
};

/**
 * Create Stack navigator
 */
const Stack = createNativeStackNavigator<StackParamList>();

/**
 * Create BottomTab navigator
 */
const BottomTab = createBottomTabNavigator();

const App = () => {
  // enable device-context prefixes
  useDeviceContext(tw);
  const {checkingAuth, isLoggedIn, signIn, signOut} = useCheckAuth();

  // render nothing when still checking if user is logged in
  // in the process of checking auth, the splash screen will still be visible
  // because nothing is rendered to replace/overlay it
  if (checkingAuth) return null;

  return (
    <NavigationContainer>
      {/*
       * We pass signout and signin services via context so they can be called
       * from any screen without prop drilling them
       */}
      <AuthContext.Provider value={{signIn, signOut}}>
        <SafeAreaProvider>
          {!isLoggedIn ? (
            <Stack.Navigator>
              <Stack.Group screenOptions={{headerShown: false}}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Landing" component={Landing} />
                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPassword}
                />
              </Stack.Group>
            </Stack.Navigator>
          ) : (
            <BottomTab.Navigator>
              <BottomTab.Screen name="Home" component={Home} />
            </BottomTab.Navigator>
          )}
        </SafeAreaProvider>
      </AuthContext.Provider>
    </NavigationContainer>
  );
};

export default App;
