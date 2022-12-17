import {LinkingOptions} from '@react-navigation/native';
import constants from '../utils/constants';

// TODO: replace paths with live website paths
// TODO: Associate deep links for android and ios when site is live
const DEEP_LINK_OPTIONS: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: constants.DEEP_LINKING_PREFIXES,
  config: {
    screens: {
      SignIn: 'login',
      SignUp: 'signup',
      Airtime: 'airtime',
      Data: 'data',
      Electricity: 'electricity',
      Cable: 'cable',
      ScratchCard: 'waec',
      ForgotPassword: 'forgot-password',
      Landing: '*',
    },
  },
};

export default DEEP_LINK_OPTIONS;
