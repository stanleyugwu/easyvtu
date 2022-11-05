import {number, object, string} from 'yup';
import constants from '../../utils/constants';
import {Carrier} from './airtime.d';

const AirtimeSchema = object({
  phoneNumber: string()
    .matches(constants.PHONE_NUMBER_REGEX, {
      message: 'Supply valid phone number',
      excludeEmptyString: false,
    })
    .required('Supply receipient phone number'),
  carrier: string()
    .oneOf(Object.values(Carrier))
    .default(Carrier.Mtn)
    .required('Supply carrier network'),
  amount: number()
    .typeError('Supply valid amount')
    .positive('Amount must be positive number')
    .integer('Supply valid amount')
    .test(
      'up_to_minimum',
      `Minimum airtime top-up amount is ${constants.MINIMUM_AIRTIME_TOPUP_AMOUNT}`,
      value => {
        return value === undefined
          ? false
          : value >= constants.MINIMUM_AIRTIME_TOPUP_AMOUNT;
      },
    )
    .required('Supply top-up amount'),
});

export default AirtimeSchema;
