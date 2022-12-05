import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

/**
 * Screens params list for stack navigator
 */
export type StackParamList = {
  Splash: undefined;
  Landing: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  GuestHome: undefined;
  MoreOption: undefined;
  ChangePassword: undefined;
  BottomTabRegistrar: NavigatorScreenParams<TabParamList>;
  Airtime: undefined;
  Data: undefined;
  Electricity: undefined;
  Cable: undefined;
  Support: undefined;
};

// Screens for BottomTab (i.e after logging in)
export type TabParamList = {
  Home: undefined;
  Wallet: {
    // used when navigating to the screen to specify
    // action to be trigger when screen mounts
    action?: 'withdraw' | 'deposit';
  };
  Profile: undefined;
  History: undefined;
};

/**
 * Stack screen param list shorthand
 */
export type StackScreen<Screen extends keyof StackParamList> =
  NativeStackScreenProps<StackParamList, Screen>;

/**
 * Bottom tab screen param list shorthand
 */
export type TabScreen<Screen extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, Screen>,
  NativeStackScreenProps<StackParamList>
>;

/**
 * Combination of Stack and Tab screens
 */
type StackAndTabParamList = StackParamList & TabParamList;
export type StackAndTabScreen<Screen extends keyof StackAndTabParamList> =
  NativeStackScreenProps<StackAndTabParamList, Screen>;
