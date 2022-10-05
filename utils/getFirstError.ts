import {FieldErrorsImpl, FieldValues} from 'react-hook-form';

/**
 * Extracts and returns the first error it gets from a `react-hook-form` error object.
 * Useful because we don't want be displaying all errors at once in forms 
 */
const getFirstError = <ErrorType extends FieldValues = FieldValues>(
  errors: FieldErrorsImpl<ErrorType> = {},
): undefined | string => {
  return Object.values(errors)[0]?.message;
};

export default getFirstError;
