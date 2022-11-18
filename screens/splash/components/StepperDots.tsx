//import liraries
import React from 'react';
import {View} from 'react-native';
import tw from '../../../lib/tailwind';

// Stepper dots
export interface StepperDotsProps {
  /**
   * Index of the active dot
   */
  activeIndex?: 1 | 2 | 3;
}

/**
 * Stepper Dots Component
 */
const StepperDots = ({activeIndex = 1}: StepperDotsProps) => {
  return (
    <View style={tw`flex-row`}>
      <View
        style={tw.style(
          `w-[8px] h-[8px] rounded-full border-gray border`,
          activeIndex === 1 ? 'bg-secondary border-secondary' : 'bg-gray5',
        )}
      />
      <View
        style={tw.style(
          `w-[8px] h-[8px] rounded-full border-gray border mx-1`,
          activeIndex === 2 ? 'bg-secondary border-secondary' : 'bg-gray5',
        )}
      />
      <View
        style={tw.style(
          `w-[8px] h-[8px] rounded-full border-gray border`,
          activeIndex === 3 ? 'bg-secondary border-secondary' : 'bg-gray5',
        )}
      />
    </View>
  );
};

export default StepperDots;
