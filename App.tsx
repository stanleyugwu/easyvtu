import React from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import tw from './lib/tailwind';
import {useDeviceContext} from 'twrnc';

const App = () => {
  // enable device-context prefixes
  useDeviceContext(tw);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={tw.style('p-4')}>{/* CONTENT */}</SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
