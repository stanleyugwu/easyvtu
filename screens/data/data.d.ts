import { InferType } from 'yup';
import DataSchema from './data.schema';

export type DataTopUpFormValues = InferType<typeof DataSchema>;
