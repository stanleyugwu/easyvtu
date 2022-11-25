import {CableFormFields} from '../../screens/cable/cable';
import {CableNetwork} from '../../screens/cable/CableSelector';
import _axios from '../axios';

type CableSubReqBody = {
  phone: string;
  serviceID: CableNetwork;
  variation_code: string;
  billersCode: string;
  amount: string;
  // TODO: assert the neccesity of below field
  subscription_type: 'change';
};

type CableSubResData = {
  code: string;
  content: {
    // transactions field structure is stated but we don't need it
    // so we set it to more generic Object here to lessen code and strictness
    transactions: Object;
  };
  response_description: string;
  requestId: string;
  amount: string;
  transaction_date: Object; // field structure is not needed;
  purchased_code: string;
};

/**
 * API service for cable subscription
 */
const topUpCable = (valuesObj: CableFormFields) => {
  const {amount, iucNumber, phoneNumber, planId, serviceID} = valuesObj;
  return _axios.post<CableSubReqBody, CableSubResData>('/cable_sub', {
    amount: amount?.toString?.(),
    billersCode: iucNumber,
    phone: phoneNumber,
    serviceID: serviceID,
    subscription_type: 'change',
    variation_code: planId,
  });
};

export default topUpCable;
