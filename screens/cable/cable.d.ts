import {InferType} from 'yup';
import CableSchema from './cable.schema';
import {CableNetwork} from './CableSelector';

export interface CableFormFields extends InferType<typeof CableSchema> {
  serviceID: CableNetwork;
}
