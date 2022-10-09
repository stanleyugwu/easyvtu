import axios from 'axios';
import {beforeRequest, requestError} from './interceptors/request';
import {errorResponse, successResponse} from './interceptors/response';
import {_AxiosInstance} from './api';

/**
 * Customized axios instance
 */
const _axios = axios.create({
  baseURL: 'https://easy-vtu.herokuapp.com/api',
  timeout: 10_000,
  timeoutErrorMessage: 'Request took too long, try again',
}) as _AxiosInstance;
_axios.interceptors.request.use(beforeRequest, requestError);
_axios.interceptors.response.use(successResponse, errorResponse);

export default _axios;
