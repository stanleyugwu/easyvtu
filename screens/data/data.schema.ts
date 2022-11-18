import {number, object, string} from 'yup';
import AirtimeSchema from '../airtime/airtime.schema';

const DataSchema = object({
  phoneNumber: AirtimeSchema.fields.phoneNumber,
  carrier: AirtimeSchema.fields.carrier,
  /**
   * planId will be the variation code and amount of any selected data plan,
   * which will be used when making request to server
   */
  planId: string()
    .lowercase('Select a data plan')
    .required('Select a data plan'),
  amount: number()
    .typeError('Amount invalid. Select a valid data plan')
    .positive('Amount must be positive')
    .required('Amount not specified. Select a data plan'),
});

export default DataSchema;
