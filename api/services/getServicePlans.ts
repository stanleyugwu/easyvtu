import {AppServicePlansId} from '../../global';
import _axios from '../axios';

type ServicePlan = {
  variation_code: string;
  name: string;
  variation_amount: string;
  fixedPrice: string;
};

export type ServicePlansResData = {
  service_name: string;
  variations: ServicePlan[];
};

/**
 * This services fetches the variation codes or the plans of a particular service.
 * For example, given `mtn-data` as argument, it fetches all the data plans for mtn
 */
const getServicePlans = (serviceId: AppServicePlansId) => {
  return _axios.post<{serviceID: AppServicePlansId}, ServicePlansResData>(
    '/variation_codes',
    {serviceID: serviceId},
  );
};

export default getServicePlans;
