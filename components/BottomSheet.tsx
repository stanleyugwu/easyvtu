//import libraries
import React, {useLayoutEffect, useRef, useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import Text from './Text';
import tw from '../lib/tailwind';
import * as Animatable from 'react-native-animatable';

export enum BOTTOMSHEETHEIGHT {
  QUATER = '25%',
  HALF = '50%',
  THREE_QUATER = '75%',
  FULL = '100%',
}

interface BottomSheetProps {
  /**
   * Determines whether bottom sheet is visible
   */
  visible?: boolean;

  /**
   * Called when the bottom sheet is dismissed
   */
  onDismiss(): void;

  /**
   * Title text for the bottom sheet
   */
  title: string;

  /**
   * The height of the bottom sheet
   */
  height?: BOTTOMSHEETHEIGHT;

  /**
   * Wrapped children
   */
  children: React.ReactNode;
}

// BottomSheet Wrapper Component
const BottomSheet = ({
  onDismiss,
  visible = false,
  height = BOTTOMSHEETHEIGHT.HALF,
  title,
  children,
}: BottomSheetProps) => {
  const [isHidden, setIsHidden] = useState(true);
  const animatedViewRef = useRef<Animatable.View>(null);
  const animatedViewWrapperRef = useRef<Animatable.View>(null);

  /**
   * Adds animation effect when mounting and unmounting bottom sheet
   */
  useLayoutEffect(() => {
    if (visible) {
      setIsHidden(false);
    } else {
      animatedViewWrapperRef.current?.fadeOut?.(800);
      animatedViewRef.current?.fadeOutDownBig?.(600).finally(() => {
        setIsHidden(true);
      });
    }
  }, [visible]);

  if (isHidden) return null;

  return (
    <Animatable.View
      // @ts-ignore
      ref={animatedViewWrapperRef}
      style={tw`h-full absolute w-full`}>
      <TouchableOpacity
        style={tw`absolute z-50 h-full inset-0 bg-dark bg-opacity-80`}
        activeOpacity={1}
        onPress={onDismiss}>
        <Animatable.View
          // @ts-ignore
          ref={animatedViewRef}
          // below is necessary to prevent touch event propagation
          onStartShouldSetResponder={() => true}
          animation="fadeInUpBig"
          duration={700}
          style={tw.style(`w-full mt-auto p-4 bg-white rounded-t-3xl`, {
            height,
          })}>
          <View style={tw`h-1.5 bg-secondary rounded-lg w-18 mx-auto`} />
          <Text
            type={tw.prefixMatch('sm') ? 'title' : 'subTitle'}
            style={tw`mb-4 sm:mb-6 mt-8 sm:mt-12`}>
            {title}
          </Text>
          <ScrollView>{children}</ScrollView>
        </Animatable.View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default BottomSheet;
