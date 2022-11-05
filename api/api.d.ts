import {AxiosInstance, AxiosResponse, AxiosRequestConfig} from 'axios';

/**
 * This is not error response but the type of value of `errors` key in server error object
 */
export type RawServerErrorMessage = Record<string, string | string[]>;

/**
 * Error object after transformation, to be consumed by adapters
 */
export type ServerErrorObject = {
  message: string;
};

/**
 * Success object from server
 */
export type SuccessObject<Data = any> = {
  status: boolean;
  message: string;
  data: Data;
};

export type ErrorResponse = Promise<ServerErrorObject>;
export type SuccessRes<Data = any> = Promise<SuccessObject<Data>>;

/**
 * Custom AxiosInstance without `AxiosResponse` wrapping `post` and `get` responses
 * and adding all the unneeded properties.
 *
 * We dont need the properties added by `AxiosResponse` in adapters
 * because we have interceptors that extracts and returns response data from response
 * to the calling adapter
 */
export interface _AxiosInstance extends AxiosInstance {
  post: <
    ReqBody = Record<string, string>,
    ResData = Record<string, any>,
    Res = SuccessRes<ResData>,
  >(
    url: string,
    data?: ReqBody,
    config?: AxiosRequestConfig<ReqBody>,
  ) => Res;

  get: <
    ResData = Record<string, any>,
    Res = SuccessRes<ResData>,
    ReqBody = Record<string, string>,
  >(
    url: string,
    config?: AxiosRequestConfig<ReqBody> | undefined,
  ) => Res;

  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig<any>>;
    response: AxiosInterceptorManager<SuccessObject<any>>;
  };
}
