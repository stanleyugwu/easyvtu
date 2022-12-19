//import libraries
import React from 'react';
import {View, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import Text from '~components/Text';
import tw from '../../lib/tailwind';
import AngleRightIcon from '~images/angle_right.svg';

interface OptionCardProps extends TouchableOpacityProps {
  /**
   * imported SVG image asset to render to the left of the option.
   * This should be the return value of `require(...)` because it'll be rendered as component
   */
  image: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

  /**
   * title text for option
   */
  title: string;

  /**
   * subtitle for the card option
   */
  subTitle: string;
}

// OptionCardButton Component
const OptionCardButton = ({
  image: Image,
  subTitle,
  style,
  title,
  ...otherProps
}: OptionCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        tw`bg-white rounded-md shadow-md flex-row items-center justify-between p-4 my-2`,
        style,
      ]}
      {...otherProps}>
      <View style={tw`flex-row items-center justify-center`}>
        <Image width='35' height="35" />
        <View style={tw`ml-3`}>
          <Text color="black">{title}</Text>
          <Text type="caption" color="gray">
            {subTitle}
          </Text>
        </View>
      </View>
      <AngleRightIcon style={tw`mr-2`} />
    </TouchableOpacity>
  );
};

export default OptionCardButton;
