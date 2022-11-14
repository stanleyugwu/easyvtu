//import libraries
import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import Text, { TextProps } from './Text';
import tw from '../lib/tailwind';
import LinearGradient from 'react-native-linear-gradient';

export interface ButtonProps extends TouchableOpacityProps {
  /** Button label text */
  label: string;
  /**
   * The type of gradient to apply to the button.
   * Either primary(dark-blue to blue), or secondary (orange to light orange)
   */
  gradientType?: 'primary' | 'secondary';
  /**
   * Custom array of colors to use for button gradient
   */
  gradient?: (string | number)[];
  /**
   * Button label text color
   */
  labelColor?: TextProps['color'];
}

// Button Component
const Button = ({
  gradientType = 'primary',
  label,
  children,
  style,
  gradient,
  labelColor = "white",
  ...otherProps
}: ButtonProps) => {
  const primaryGradient = [
    tw.color('primary'),
    tw.color('blue'),
    tw.color('blue'),
  ] as string[];
  const secondaryGradient = [tw.color('secondary'), '#FBD40A'] as string[];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[tw`rounded-md`, style]}
      {...otherProps}>
      <LinearGradient
        style={tw`p-3.5 rounded-md`}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={
          gradient
            ? gradient
            : gradientType === 'primary'
            ? primaryGradient
            : secondaryGradient
        }>
        <Text color={labelColor} style={tw`text-center`}>
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Button;
