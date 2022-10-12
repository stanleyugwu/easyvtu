//import libraries
import React from 'react';
import {View, ViewStyle} from 'react-native';
import Text from './Text';
import tw from '../lib/tailwind';
import loader from '../assets/json/loader.json';
import AnimatedLottieView from 'lottie-react-native';

interface FlatViewLoaderProps {
  /**
   * Whether component is visible. defaults to true
   */
  visible?: boolean;

  /**
   * Optional custom loader text
   */
  text?: string;

  /**
   * container style
   */
  style?: ViewStyle;
}

// FlatViewLoader Component for rendering loader in a flat view, not overlay
const FlatViewLoader = ({
  text = 'Processing, please wait',
  visible = false,
  style,
}: FlatViewLoaderProps) => {
  if (!visible) return null;
  return (
    <View style={[tw`justify-center items-center`, style]}>
      <AnimatedLottieView
        autoPlay
        renderMode="AUTOMATIC"
        style={tw`self-center w-[80px] md:w-[100px]`}
        speed={3}
        source={loader}
      />
      <Text type="caption" color="gray" style={tw`text-center`}>
        {text}
      </Text>
    </View>
  );
};

export default FlatViewLoader;
