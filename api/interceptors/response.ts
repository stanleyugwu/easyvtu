import axios, {AxiosError, AxiosResponse} from 'axios';
import extractSingleError from '../util/extractSingleError';
import {
  ErrorResponse,
  RawServerErrorMessage,
  ServerErrorObject,
  SuccessObject,
} from '../api';
import useAppStore from '../../store';

/**
 * Any status codes that falls outside the range of 2xx cause this function to trigger
 * Do something with response error
 */
export const errorResponse = (
  error: AxiosError<
    {errors?: RawServerErrorMessage; message: string},
    ServerErrorObject
  >,
): ErrorResponse => {
  //request wasn't made because of Internet Connection
  if (error.code === 'ERR_NETWORK') {
    return Promise.reject({
      message: `Internet connection error, check your internet and try again`,
    });
  }

  //request timed out
  if (error.code === 'ECONNABORTED') {
    return Promise.reject({
      message: error.message || `Request took too long, try again`,
    });
  }

  //Request Cancelled
  if (axios.isCancel(error)) {
    return Promise.reject({
      message: error.message || 'Request cancelled',
    });
  }

  // below block is added to give type to error object because
  // `axios.Cancel` rewrites its type
  error = error as AxiosError<
    {
      errors?: RawServerErrorMessage | undefined;
      message: string;
    },
    ServerErrorObject
  >;

  const errorObj = error.response?.data?.errors;

  // interceptor logic to auto sign-out user when server error
  // response has 'Unauthenticated' string in its message
  // FIXME: request for more standard reponse structure for un-authenticated user
  if (
    error.response?.data?.message
      ?.toLowerCase?.()
      .includes?.('unauthenticated.')
  ) {
    useAppStore.getState().signOut();
  }

  return Promise.reject({
    message: errorObj
      ? extractSingleError(errorObj)
      : // @ts-ignore
        error.response?.data?.message || 'Request Failed, try again',
  });
};

/**
 * Any status code that lie within the range of 2xx cause this function to trigger
 * Do something with response data
 */
export const successResponse = (
  res: AxiosResponse<SuccessObject, RawServerErrorMessage>,
): SuccessObject => {
  // destructure response data
  const {data, ...othersMinusData} = res.data;
  // return relevant response data from server
  return {
    status: true,
    message: res.data?.message || 'Request Successful',
    // due to difference btw server response structure for login and other routes
    // when the route is `login`, we want to put all the fields (`access_token`, `expiresIn`)
    // which are not inside the response `data` field into the `data` field of our custom
    // response to normalise response structure.
    data:
      res?.config?.url === '/login'
        ? {...othersMinusData, ...res.data.data}
        : res.data?.data,
  };
};
