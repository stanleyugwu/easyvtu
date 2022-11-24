//import libraries
import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import tw from '../lib/tailwind';
import BackArrow from '~images/back_arrow.svg';

type BackButtonProps = TouchableOpacityProps;

// BackButton Component
const BackButton = (props: BackButtonProps) => {
  const dimension = tw.prefixMatch('md')
    ? {width: 48, height: 48}
    : {width: 42, height: 42};
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={tw.style(`bg-white rounded-full p-3.5 shadow-xl`, dimension)}
      {...props}>
      {/* @ts-ignore */}
      <BackArrow width="100%" height="100%" />
    </TouchableOpacity>
  );
};

export default BackButton;
