import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import tw from './lib/tailwind';
import {useDeviceContext} from 'twrnc';
import useCheckAuth from './hooks/useCheckAuth';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthContext from './contexts/auth';

import type {StackParamList} from './navigation/screenParams';

import SplashScreen from './screens/splash';
import Landing from './screens/landing';
import SignIn from './screens/signIn';
import SignUp from './screens/signup';
import ForgotPassword from './screens/forgot_password';
import GuestHome from './screens/home/guestHome';
import BottomTabNavigatorRegistrar from './navigation/BottomTabRegistrar';

// shared screens
import MoreOption from './screens/more_option';

/**
 * Create Stack navigator
 */
const Stack = createNativeStackNavigator<StackParamList>();

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
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {!isLoggedIn ? (
              <Stack.Group>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Landing" component={Landing} />
                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPassword}
                />
                <Stack.Screen name="GuestHome" component={GuestHome} />
              </Stack.Group>
            ) : (
              <Stack.Screen
                name="BottomTabRegistrar"
                component={BottomTabNavigatorRegistrar}
              />
            )}
            <Stack.Screen name="MoreOption" component={MoreOption} />
          </Stack.Navigator>
        </SafeAreaProvider>
      </AuthContext.Provider>
    </NavigationContainer>
  );
};

export default App;
