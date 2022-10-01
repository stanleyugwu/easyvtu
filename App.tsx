import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import tw from './lib/tailwind';
import {useDeviceContext} from 'twrnc';
import SplashScreen from './screens/splash';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

/**
 * Create Stack navigator
 */
const Stack = createNativeStackNavigator();

const App = () => {
  // enable device-context prefixes
  useDeviceContext(tw);

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Stack.Navigator>
          <Stack.Group screenOptions={{headerShown:false}}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default App;
