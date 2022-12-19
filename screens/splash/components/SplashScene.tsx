//import liraries
import React from 'react';
import {View, useWindowDimensions} from 'react-native';
import Text from '~components/Text';
import tw from '../../../lib/tailwind';
import * as Animatable from 'react-native-animatable';

export interface SplashSceneProps {
  /** Scene image */
  image: number;
  /** Scene title */
  title: string;
  /** Scene body */
  body: string;
}

/**
 * Renders a single splashscreen scene
 */
const SplashScene = ({image, body, title}: SplashSceneProps) => {
  const {width} = useWindowDimensions();

  return (
    <View style={tw.style({width}, 'p-4 justify-center items-center ')}>
      <Animatable.Image
        animation={'pulse'}
        easing="ease-out"
        iterationCount="infinite"
        duration={1500}
        useNativeDriver
        delay={1000}
        source={image}
        style={tw.style(
          {resizeMode: 'contain'},
          `w-[250px] h-[250px] md:w-[330px] md:h-[330px]`,
        )}
      />
      <Text type="subTitle" style={tw`text-center mt-4`}>
        {title}
      </Text>
      <Text style={tw`text-center text-gray`}>
        {body}
      </Text>
    </View>
  );
};

export default SplashScene;
