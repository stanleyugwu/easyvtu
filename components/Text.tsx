import React from 'react';
import {type TextProps as _TextProps, Text as _Text} from 'react-native';
import tw from '../lib/tailwind';
import config from '../tailwind.config';

/**
 * Custom Text component props
 */
export interface TextProps extends _TextProps {
  /** Type of the text */
  type?: keyof typeof config['theme']['extend']['fontSize'];
  /** Color of the text */
  color?: keyof typeof config['theme']['extend']['colors'];
}

/**
 * Custom Text component
 */
const Text = ({
  type = 'paragraph',
  color = 'black',
  children,
  style,
  ...otherProps
}: TextProps) => {
  return (
    <_Text
      style={[
        tw.style(
          'font-muli',
          `text-${type} text-${color}`,
          type === 'title' && 'leading-[35px]',
        ),
        style,
      ]}
      children={children}
      {...otherProps}
    />
  );
};

export default Text;
