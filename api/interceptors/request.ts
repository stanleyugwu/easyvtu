import {AxiosError, AxiosRequestConfig} from 'axios';
import getAccessToken from '../util/getAccessToken';
import {ErrorResponse} from '../api';

/**
 * Called before request is sent
 */
const beforeRequest = (config: AxiosRequestConfig<any>) => {
  const accessToken = getAccessToken();
  if (accessToken && config.headers) {
    config.headers['Authorization'] = accessToken; // token from storage wil have `Bearer ` prefix
  }
  return config;
};

/**
 * Called when an error occured before request is sent, maybe bad config
 */
const requestError = (error: AxiosError): ErrorResponse => {
  return Promise.reject({
    message: error.message || 'An error occured on our side, try again',
  });
};

export {beforeRequest, requestError};
