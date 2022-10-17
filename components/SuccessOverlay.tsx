//import libraries
import React, {useEffect, useRef, useState} from 'react';
import Text from './Text';
import tw from '../lib/tailwind';
import * as Animatable from 'react-native-animatable';
import AnimatedLottieView from 'lottie-react-native';
import success from '../assets/json/success.json';

interface SuccessOverlayProps {
  /**
   * how long the overlay will be visible, in milliseconds
   */
  timeout?: number;

  /**
   * Function to be called when the overlay is dismissed after `timeout`
   */
  onDismiss: () => void;

  /**
   * Whether the overlay is visible
   */
  visible?: boolean;

  /**
   * success message to show below success animation
   */
  successText?: string;
}

// SuccessOverlay Component
const SuccessOverlay = ({
  onDismiss,
  successText = 'Operation Successful',
  timeout = 2000,
  visible = false,
}: SuccessOverlayProps) => {
  const [hidden, setHidden] = useState(!visible);

  const viewRef = useRef<Animatable.View>();
  const hideTimeout = useRef<number>();

  useEffect(() => {
    if (visible) {
      setHidden(false);
      hideTimeout.current && clearTimeout(hideTimeout.current);
      hideTimeout.current = setTimeout(onDismiss, timeout);
    } else {
      hideTimeout.current && clearTimeout(hideTimeout.current);
      viewRef.current
        ?.fadeOut?.(500)
        .then(v => v.finished && setHidden(true)) || setHidden(true);
    }
  }, [visible]);

  // clears timeout on unmount
  useEffect(
    () => () => {
      hideTimeout.current && clearTimeout(hideTimeout.current);
    },
    [],
  );

  if (hidden) return null;
  return (
    <Animatable.View
      style={tw`absolute z-50 p-4 inset-0 justify-center items-center bg-dark bg-opacity-80`}
      animation="bounceIn"
      duration={1500}
      // @ts-ignore
      ref={viewRef}>
      {/* @ts-ignore */}
      <AnimatedLottieView
        autoPlay
        renderMode="AUTOMATIC"
        style={tw`self-center w-[200px] md:w-[250px]`}
        source={success}
        loop={false}
      />
      <Text
        type={successText.length > 35 ? 'paragraph' : 'subTitle'}
        color="gray5"
        style={tw`text-center`}>
        {successText}
      </Text>
    </Animatable.View>
  );
};

export default SuccessOverlay;
