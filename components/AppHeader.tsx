//import libraries
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {ViewProps, View, TouchableOpacity} from 'react-native';
import Text from './Text';
import tw from '../lib/tailwind';
import BackArrow from '../assets/images/back_arrow.svg';
import {useNavigation} from '@react-navigation/native';

interface AppHeaderProps {
  title?: string;
  subTitle?: string;
}

// AppHeader Component
const AppHeader = ({subTitle, title}: AppHeaderProps) => {
  const dimension = tw.prefixMatch('md')
    ? {width: 50, height: 50}
    : {width: 40, height: 40};
  const {goBack} = useNavigation();
  return (
    <View style={tw`p-1`}>
      <TouchableOpacity
        onPress={goBack}
        activeOpacity={0.8}
        style={tw.style(`bg-white rounded-full p-3.5 shadow-xl`, dimension)}>
        {/* @ts-ignore */}
        <BackArrow width="100%" height="100%" />
      </TouchableOpacity>
      {title ? (
        <Text type="title" color="black" style={tw`mt-6`}>
          {title}
        </Text>
      ) : null}
      {subTitle ? (
        <Text type="caption" color="gray">
          {subTitle}
        </Text>
      ) : null}
    </View>
  );
};

export default AppHeader;
