import {Carrier} from '../../screens/airtime/airtime';
import _axios from '../axios';

type AirtimeTopUpServerRequestBody = {
  phone: string;
  amount: number;
  service_id: Carrier;
};

type AirtimeTopUpServerResponse = {
  trans_id: number;
  user_id: string;
  amount: string;
  network: string;
  phone: string;
  status: string;
  updated_at: string;
  created_at: string;
};

/**
 * TODO: Make service more secured to avoid:
 * 1. duplicate calls by mistake
 * 2. situation where request will be intercepted on-air, and replayed
 * 3. situation where users call the top-up endpoint with there token, outside the app and ge top-ups
 */

/**
 * API service for topping up airtime.
 * This service should be highly secured because it'll top-up as requested
 * without payment verification or confirmation. So if called twice, will top-up twice
 */
const airtimeTopUp = (
  phoneNumber: string,
  amount: number,
  carrier: Carrier,
) => {
  return _axios.post<AirtimeTopUpServerRequestBody, AirtimeTopUpServerResponse>(
    '/top_airtime',
    {amount, phone: phoneNumber, service_id: carrier},
  );
};

export default airtimeTopUp;
