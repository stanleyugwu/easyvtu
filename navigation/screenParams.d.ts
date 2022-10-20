import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
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
  BottomTabRegistrar: NavigatorScreenParams<TabParamList>;
};

// Screens for BottomTab (i.e after logging in)
export type TabParamList = {
  Home: undefined;
  Wallet: {
    // used when navigating to the screen to specify
    // action to be trigger when screen mounts
    action?: 'withdraw' | 'deposit';
  };
  Profile:undefined;
  History:undefined;
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
