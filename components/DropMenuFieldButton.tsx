//import libraries
import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import Text from './Text';
import tw from '../lib/tailwind';
import AngleDownIcon from '~images/angle_down.svg';

interface DropMenuFieldButtonProps extends TouchableOpacityProps {
  /**
   * Button text label
   */
  label: string;
}

/**
 * Simple form field component for showing a menu of options.
 * It renders a button with right-aligned drop-down icon
 */
const DropMenuFieldButton = ({
  label,
  onPress,
  style,
  ...otherProps
}: DropMenuFieldButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        tw`py-4 px-3 flex-row justify-between bg-gray5 border border-gray4 items-center rounded-[3px]`,
        style,
      ]}
      {...otherProps}>
      <Text type="caption" color="gray">
        {label}
      </Text>
      <AngleDownIcon />
    </TouchableOpacity>
  );
};

export default DropMenuFieldButton;
