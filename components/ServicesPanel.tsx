//import libraries
import React, {useState} from 'react';
import {View, ViewProps, TouchableOpacity} from 'react-native';
import Text from './Text';
import tw from '../lib/tailwind';

import CallIcon from '../assets/images/call_icon.svg';
import DataIcon from '../assets/images/data_icon.svg';
import ElectricityIcon from '../assets/images/electricity_icon.svg';
import ScratchCardIcon from '../assets/images/card_icon.svg';
import CableIcon from '../assets/images/cable_icon.svg';
import {useNavigation} from '@react-navigation/native';
import {StackParamList} from '../navigation/screenParams';

interface ServiceCardProps {
  Image: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  label: string;
  serviceScreen: keyof StackParamList;
}

/**
 * Represents individual service
 */
const ServiceCard = ({Image, label, serviceScreen}: ServiceCardProps) => {
  const {navigate} = useNavigation();
  const handlePress = () => {
    // @ts-ignore
    navigate(serviceScreen);
  };
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={handlePress}
      style={tw`justify-center items-center border-r border-b border-gray4 w-1/3 p-4 sm:p-6`}>
      <Image width={'35'} height={'35'} />
      <Text type="caption" color="gray" style={tw`mt-3 text-center`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ServicesPanel component that renders app services
// e.g airtime, data, on ui cards
const ServicesPanel = ({style, ...otherProps}: ViewProps) => {
  return (
    <View
      style={[tw`rounded-lg shadow-md bg-white mt-10`, style]}
      {...otherProps}>
      <View style={tw`flex-row`}>
        <ServiceCard Image={CallIcon} label="Airtime" serviceScreen="Airtime" />
        <ServiceCard Image={DataIcon} label="Data" serviceScreen="Data" />
        <ServiceCard
          Image={ElectricityIcon}
          label="Electricity"
          serviceScreen="Electricity"
        />
      </View>
      <View style={tw`flex-row`}>
        <ServiceCard
          Image={ScratchCardIcon}
          label="Scratch Card"
          serviceScreen="ScratchCard"
        />
        <ServiceCard Image={CableIcon} label="Cable" serviceScreen="Cable" />
      </View>
    </View>
  );
};

export default ServicesPanel;
