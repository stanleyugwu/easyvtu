import {InferType} from 'yup';
import ElectricitySchema from '../../screens/electricity/electricity.schema';
import useAppStore from '../../store';
import _axios from '../axios';

type ElectricityTopUpReqBody = Record<
  'meter' | 'state' | 'amount' | 'phone' | 'email' | 'name',
  string
>;

/**
 * API Service for topping up electricity
 */
const topUpElectricity = (values: InferType<typeof ElectricitySchema>) => {
  const {amount, emailAddress, meterNumber, phoneNumber, provider} = values;
  // TODO: ensure required request body properties e.g email
  return _axios.post<ElectricityTopUpReqBody, Object>('/electricity_bill', {
    amount: `${amount}`,
    email: emailAddress,
    meter: meterNumber,
    phone: phoneNumber,
    state: provider,
    name: useAppStore.getState()?.profile?.username || 'Guest@EasyVtu',
  });
};

export default topUpElectricity;
