//import libraries
import React from 'react';
import {TextInput, TextInputProps, View} from 'react-native';
import Text, {TextProps} from './Text';
import tw from '../lib/tailwind';

interface InputFieldProps extends TextInputProps {
  /**
   * Text label to show above the input field
   */
  label: string;

  /**
   * Color of input field label text
   */
  labelColor?: TextProps['color'];

  /**
   * input field placeholder
   */
  placeholder: string;

  /**
   * Element to render right to the input field
   */
  rightElement?: JSX.Element;

  /**
   * Element to render left to the input field
   */
  leftElement?: JSX.Element;

  /**
   * Value of the input field
   */
  value?: string;
}

// InputField Component for rendering input field
const InputField = ({
  label,
  placeholder,
  value,
  labelColor = 'black',
  leftElement,
  rightElement,
  ...otherProps
}: InputFieldProps) => {
  const _TextInput = (
    <TextInput
      placeholder={placeholder}
      style={tw.style(
        `bg-gray5 flex-1 rounded-[3px] p-3 text-paragraph text-black`,
        leftElement
          ? 'border-l border-gray4'
          : rightElement
          ? 'border-r border-gray4'
          : null,
      )}
      placeholderTextColor={tw.color('gray')}
      value={value}
      selectionColor={tw.color('primary')}
      {...otherProps}
    />
  );

  return (
    <View style={tw`my-2`}>
      <Text color={labelColor} type="paragraph" style={tw`mb-2`}>
        {label}
      </Text>
      <View
        style={tw`flex-row w-full bg-gray5 border border-gray4 items-center rounded-[3px]`}>
        {leftElement}
        {_TextInput}
        {rightElement}
      </View>
    </View>
  );
};

export default InputField;
