import React from 'react';
import {type TextProps as _TextProps, Text as _Text} from 'react-native';
import tw from '../lib/tailwind';
import config from '../tailwind.config';

/**
 * Custom Text component props
 */
export interface TextProps extends _TextProps {
  /** Type of the text */
  type?: 'title' | 'subTitle' | 'paragraph' | 'caption';
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
          `text-${type} md:text-b${type} text-${color}`,
          `leading-[${
            type === 'title' || type === 'subTitle'
              ? '35px'
              : type === 'paragraph'
              ? '26.53px'
              : '23.59px'
          }]`,
        ),
        style,
      ]}
      children={children}
      {...otherProps}
    />
  );
};

export default Text;
