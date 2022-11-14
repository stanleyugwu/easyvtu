//import libraries
import React from 'react';
import tw from '../lib/tailwind';
import AnimatedLottieView, {AnimatedLottieViewProps} from 'lottie-react-native';
import loader from '../assets/json/loader.json';
import * as Animatable from 'react-native-animatable';

interface LoaderProps extends Omit<AnimatedLottieViewProps, 'source'> {
  /**
   * Whether loader is visible
   */
  visible?: boolean;
}

// Overlay loader animation component
const Loader = ({visible = true, ...otherProps}: LoaderProps) => {
  if (!visible) return null;

  return (
    <Animatable.View
      animation={'zoomIn'}
      useNativeDriver
      duration={300}
      style={tw.style(`absolute z-50 inset-0 justify-center items-center`, {
        backgroundColor: tw.color('dark') + 'dd',
      })}>
      <AnimatedLottieView
        autoPlay
        renderMode="AUTOMATIC"
        style={tw`self-center w-[130px] md:w-[180px]`}
        speed={3}
        {...otherProps}
        source={loader}
      />
    </Animatable.View>
  );
};

export default Loader;
