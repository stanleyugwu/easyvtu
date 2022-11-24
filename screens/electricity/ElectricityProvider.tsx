//import libraries
import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import Text from '~components/Text';
import tw from '../../lib/tailwind';
import IMAGEIDS from './providerImageIds';

interface ElectricityProviderProps {
  /** Name of the provider */
  label: keyof typeof IMAGEIDS;
  /** Called when proider is selected */
  onPress: () => void;
}

// ElectricityProvider Component
const ElectricityProvider = ({label, onPress}: ElectricityProviderProps) => {
  const imgId = IMAGEIDS[label];

  return (
    <TouchableOpacity
      style={tw`flex-row items-center mb-3 bg-gray5 rounded-md p-4`}
      activeOpacity={0.8}
      onPress={onPress}>
      <View style={tw`w-14 h-8`}>
        <Image
          source={{
            uri: `https://drive.google.com/uc?id=${imgId || IMAGEIDS.bh}`,
          }}
          style={tw`w-full h-full`}
          resizeMode="contain"
        />
      </View>
      <Text style={tw`uppercase ml-2`}>{label} Electricity</Text>
    </TouchableOpacity>
  );
};

export default ElectricityProvider;
