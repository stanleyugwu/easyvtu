//import libraries
import React from 'react';
import {Image, ScrollView, ScrollViewProps} from 'react-native';
import tw from '../lib/tailwind';
import {SafeAreaView} from 'react-native-safe-area-context';
import tileImg from '../assets/images/tile.png';
import {TextProps} from './Text';

interface SafeAreaScrollViewProps extends ScrollViewProps {
  /**
   * Background color of the view conforming to app design
   */
  backgroundColor?: TextProps['color'];
  /**
   * Whether to add tile background image
   */
  showTile?: boolean;
}

/**
 * Customised `SafeAreaView` component which wraps children in `ScrollView`
 * and can also add app image background tile
 */
const SafeAreaScrollView = ({
  backgroundColor = 'gray5',
  showTile = true,
  children,
  ...otherProps
}: SafeAreaScrollViewProps) => {
  return (
    <SafeAreaView
      style={[
        tw.style(`flex-1`, {backgroundColor: tw.color(backgroundColor)}),
      ]}>
      {showTile ? (
        <Image
          source={tileImg}
          style={{position: 'absolute', right: 0}}
          resizeMethod="resize"
        />
      ) : null}
      <ScrollView contentContainerStyle={tw`p-4`} {...otherProps}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SafeAreaScrollView;
