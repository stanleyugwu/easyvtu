import type {Carrier} from '../../screens/airtime/airtime';
import _axios from '../axios';
import type {AppServicePlansId} from '../../global';

type DataTopUpRequestBody = {
  serviceID: AppServicePlansId;
  variation_code: string;
  amount: string;
  phone: string;
};

type DataTopUpResData = {
  code: string;
  content: {
    /**
     * In the original response type, trasactions structure is defined but we
     * just set it to Object here to avoid ambiguity
     */
    transactions: Object;
  };
  response_description: string;
  requestId: string;
  amount: string;
  transaction_date: {
    date: string;
    timezone_type: 3;
    timezone: string;
  };
  purchased_code: '';
};

/**
 * Service for topping up data.
 *
 * @param {Carrier} carrier - The selected carrier network for top-up. Used to construct the request `serviceID`
 * @param {string} variationCode - The selected data plan's unique id
 * @param {number} amount - Top-up amount
 * @param {string} phoneNumber - Receipient phone number
 */
const dataTopUp = (
  carrier: Carrier,
  variationCode: string,
  amount: number,
  phoneNumber: string,
) => {
  return _axios.post<DataTopUpRequestBody, DataTopUpResData>('/top_data', {
    /**
     * serviceID is constructed from carrier
     * TODO: resolve server error 'The variation_code amount field is required'
     */
    serviceID: (carrier + '-data') as AppServicePlansId,
    amount: amount?.toString(),
    phone: phoneNumber,
    variation_code: variationCode,
  });
};

export default dataTopUp;
