import {NativeStackScreenProps} from '@react-navigation/native-stack';

/**
 * Screens params list for stack navigator
 */
export type StackParamList = {
  Splash: undefined;
  Landing: undefined;
};

/**
 * Screen param list shorthand
 */
export type StackScreen<Screen extends keyof StackParamList> =
  NativeStackScreenProps<StackParamList, Screen>;
