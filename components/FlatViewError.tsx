//import libraries
import React from 'react';
import {View, ViewStyle, TouchableOpacity} from 'react-native';
import Text from './Text';
import tw from '../lib/tailwind';
import CloudOffIcon from '~images/cloud_off.svg';

interface FlatViewErrorProps {
  /**
   * Whether component is visible. defaults to true
   */
  visible?: boolean;

  /**
   * Optional custom error text
   */
  text?: string;

  /**
   * Function to be called when the retry button is pressed
   */
  onRetry?: () => void;

  /**
   * container style
   */
  style?: ViewStyle;
}

// FlatViewError Component for rendering error in a flat view, not overlay
const FlatViewError = ({
  onRetry,
  text = 'An error occured. Try again',
  visible = false,
  style,
}: FlatViewErrorProps) => {
  if (!visible) return null;
  return (
    <View style={[tw`justify-center items-center`, style]}>
      <CloudOffIcon />
      <Text type="caption" color="gray" style={tw`text-center`}>
        {text}
      </Text>
      <TouchableOpacity activeOpacity={0.8} style={tw`mt-3`} onPress={onRetry}>
        <Text style={tw`bg-gray4 text-black p-2 px-4 rounded-lg text-sm`}>
          TRY AGAIN
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FlatViewError;
