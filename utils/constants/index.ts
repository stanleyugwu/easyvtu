import {FLUTTERWAVE_MERCHANT_API_KEY} from '@env';
import {FlutterwaveInitOptions} from 'flutterwave-react-native/dist/FlutterwaveInit';
const constants = Object.freeze({
  SERVER_URL: 'https://easy-vtu.herokuapp.com',
  
  PHONE_NUMBER_REGEX: /^0(70|80|81|90|91)\d{8,8}$/,
  
  MINIMUM_AIRTIME_TOPUP_AMOUNT: 100,
  
  FAULTY_TX_MSG: `Payment was successful but top-up failed due to weak internet connection. Contact support to resolve the issue`,
  
  INCOMPLETE_STATIC_FLUTTERWAVE_PAYMENT_OPTIONS: {
    authorization: FLUTTERWAVE_MERCHANT_API_KEY,
    currency: 'NGN',
    payment_options: 'card,ussd,banktransfer,account,credit',
    customer: {
      // TODO: resolve email to use for guest user
      email: 'guest@gmail.com',
      name: 'Awesome Guest',
    },
    customizations: {
      description: `Payment for top-up service`,
      title: 'EasyVtu Payment',
      // TODO: resolve online logo url
    },
  } as FlutterwaveInitOptions,

  DEEP_LINKING_PREFIXES: [
    'easyvtu://',
    'https://easyvtu.com',
    'http://easyvtu.com',
    'http://*.easyvtu.com',
    'https://*.easyvtu.com',
  ],
});

export default constants;
