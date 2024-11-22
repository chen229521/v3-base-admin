// 导入 axios 及其相关类型和错误处理
import axios, { AxiosError } from 'axios';
// 导入所需类型用于定义请求和响应
import type { AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';
// 导入 axios-retry 用于配置请求重试机制
import axiosRetry from 'axios-retry';
// 导入 nanoid 用于生成唯一的请求 ID
import { nanoid } from '@prb/utils';
// 导入配置 axios 默认选项、重试策略和自定义重试选项的函数
import { createAxiosConfig, createDefaultOptions, createRetryOptions } from './options';
// 导入常量定义，如请求 ID 的键名和后端错误代码
import { REQUEST_ID_KEY, BACKEND_ERROR_CODE } from './constant';
// 导入自定义请求配置、请求实例、响应类型等类型定义
import type {
  CustomAxiosRequestConfig,
  FlatRequstInstance,
  MappedType,
  RequestInstance,
  RequestOption,
  ResponseType,
} from './type';

/**
 * 创建通用请求实例的函数
 * @param axiosConfig? axios 的配置选项
 * @param options? 请求的自定义选项
 * @returns 返回一个包含请求实例和取消请求功能的对象
 */
function createCommonRequest<ResponseData = any>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>,
) {
  // 创建并应用默认的请求选项
  const opts = createDefaultOptions<ResponseData>(options);
  // 创建并应用自定义的 axios 配置
  const axiosConf = createAxiosConfig(axiosConfig);
  const instance = axios.create(axiosConf);
  const abortControllerMap = new Map<string, AbortController>();

  // 配置和应用请求重试策略
  const retryOptions = createRetryOptions(axiosConf);
  axiosRetry(instance, retryOptions);
  // 在请求拦截器中添加请求头和处理配置
  instance.interceptors.request.use((conf) => {
    const config: InternalAxiosRequestConfig = { ...conf };

    const requestId = nanoid();
    config.headers.set(REQUEST_ID_KEY, requestId);

    if (!config.signal) {
      const abortController = new AbortController();
      config.signal = abortController.signal;
      abortControllerMap.set(requestId, abortController);
    }

    const handleConfig = opts.onRequest?.(config) || config;

    return handleConfig;
  });

  // 在响应拦截器中处理成功和失败的响应
  instance.interceptors.response.use(
    async (response) => {
      const responseType: ResponseType = (response.config?.responseType as ResponseType) || 'json';
      if (responseType !== 'json' || opts.isBackendSuccess(response)) {
        return Promise.resolve(response);
      }

      const fail = await opts.onBackendFail(response, instance);
      if (fail) {
        return fail;
      }
      const backendError = new AxiosError<ResponseData>(
        'the backend request error',
        BACKEND_ERROR_CODE,
        response.config,
        response.request,
        response,
      );

      await opts.onError(backendError);

      return Promise.reject(backendError);
    },
    async (error: AxiosError<ResponseData>) => {
      await opts.onError(error);

      return Promise.reject(error);
    },
  );
  // 定义取消单个请求的方法
  function cancelRequest(requestId: string) {
    const abortController = abortControllerMap.get(requestId);
    if (abortController) {
      abortController.abort();
      abortControllerMap.delete(requestId);
    }
  }
  // 定义取消所有请求的方法
  function cancelAllRequest() {
    abortControllerMap.forEach((abortController) => {
      abortController.abort();
    });
    abortControllerMap.clear();
  }

  return {
    instance,
    opts,
    cancelRequest,
    cancelAllRequest,
  };
}

/**
 * 创建请求实例的函数，用于处理 JSON 或其他类型的响应
 * @param axiosConfig? axios 的配置选项
 * @param options? 请求的自定义选项
 * @returns 返回一个包含请求方法和取消请求功能的对象
 */
export function createRequest<ResponseData = any, State = Record<string, unknown>>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>,
) {
  const { instance, opts, cancelRequest, cancelAllRequest } = createCommonRequest<ResponseData>(
    axiosConfig,
    options,
  );

  const request: RequestInstance<State> = async function request<
    T = any,
    R extends ResponseType = 'json',
  >(config: CustomAxiosRequestConfig) {
    const response: AxiosResponse<ResponseData> = await instance(config);

    const responseType = response.config?.responseType || 'json';

    if (responseType === 'json') {
      return opts.transformBackendResponse(response);
    }
    return response.data as MappedType<R, T>;
  } as RequestInstance<State>;

  request.cancelRequest = cancelRequest;
  request.cancelAllRequest = cancelAllRequest;
  request.state = {} as State;

  return request;
}

/**
 * 创建扁平化请求实例的函数，用于处理 JSON 或其他类型的响应
 * @param axiosConfig? axios 的配置选项
 * @param options? 请求的自定义选项
 * @returns 返回一个包含请求方法和取消请求功能的对象
 */
export function createFlatRequest<ResponseData = any, State = Record<string, unknown>>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>,
) {
  const { instance, opts, cancelRequest, cancelAllRequest } = createCommonRequest<ResponseData>(
    axiosConfig,
    options,
  );

  const flatRequest: FlatRequstInstance<State, ResponseData> = async function flatRequest<
    T = any,
    R extends ResponseType = 'json',
  >(config: CustomAxiosRequestConfig) {
    try {
      const response: AxiosResponse<ResponseData> = await instance(config);

      const responseType = response.config?.responseType || 'json';

      if (responseType === 'json') {
        const data = opts.transformBackendResponse(response);
        return { data, error: null, response };
      }

      return { data: response.data as MappedType<R, T>, error: null };
    } catch (error) {
      return { data: null, error, response: (error as AxiosError<ResponseData>).response };
    }
  } as FlatRequstInstance<State, ResponseData>;

  flatRequest.cancelRequest = cancelRequest;
  flatRequest.cancelAllRequest = cancelAllRequest;
  flatRequest.state = {} as State;

  return flatRequest;
}

// 导出常量供外部使用
export { BACKEND_ERROR_CODE, REQUEST_ID_KEY };

// 导出类型定义供外部使用
export type * from './type';
export type { CreateAxiosDefaults, AxiosError };
