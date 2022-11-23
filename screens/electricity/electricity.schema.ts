import {number, object, string} from 'yup';
import AirtimeSchema from '../airtime/airtime.schema';

const ElectricitySchema = object({
  provider: string().required('Select electricity provider'),
  meterNumber: string()
    .min(5, 'Suply valid meter number')
    .max(20, 'Suply valid meter number')
    .required('Supply meter number'),
  amount: number()
    .typeError('Supply valid amount')
    .positive('Amount must be positive number')
    .integer('Supply valid amount')
    .required('Supply top-up amount'),
  phoneNumber: AirtimeSchema.fields.phoneNumber,
  emailAddress: string()
    .email('Supply valid e-mail address')
    .required('Supply email address'),
});

export default ElectricitySchema;
