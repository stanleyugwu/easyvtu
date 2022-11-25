import {object, string} from 'yup';
import AirtimeSchema from '../airtime/airtime.schema';
import ElectricitySchema from '../electricity/electricity.schema';
import {CableNetwork} from './CableSelector';

const CableSchema = object({
  serviceID: string()
    .oneOf(Object.values(CableNetwork), 'Choose valid cable network')
    .default(CableNetwork.Dstv)
    .required('Choose cable network'),
  planId: string()
    .lowercase('Select a cable plan')
    .required('Select a cable plan'),
  iucNumber: string()
    .matches(/^[0-9]{3,30}$/gi, 'Supply valid smart card / IUC number')
    .required('Supply smart card / IUC number'),
  amount: ElectricitySchema.fields.amount,
  // TODO: clarify phone number field is needed
  phoneNumber: AirtimeSchema.fields.phoneNumber,
});

export default CableSchema;
