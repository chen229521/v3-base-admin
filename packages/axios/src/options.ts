import type { CreateAxiosDefaults } from 'axios';
import type { IAxiosRetryConfig } from 'axios-retry';
import { stringify } from 'qs';
import { isHttpSuccess } from './shared';
import type { RequestOption } from './type';

/**
 * 创建默认请求选项
 * 该函数用于生成请求的默认配置，可以接受一个部分定义的请求选项对象作为参数
 * 参数中的选项将覆盖默认选项
 *
 * @param options 部分定义的请求选项，用于覆盖默认配置
 * @returns 返回一个完整填充了默认值的请求选项对象
 */
export function createDefaultOptions<ResponseData = any>(
  options?: Partial<RequestOption<ResponseData>>,
) {
  const opts: RequestOption<ResponseData> = {
    onRequest: async (config) => config,
    isBackendSuccess: (_responce) => true,
    onBackendFail: async () => {},
    transformBackendResponse: async (response) => response.data,
    onError: async () => {},
  };

  Object.assign(opts, options);
  return opts;
}

/**
 * 创建重试配置
 * 该函数用于生成HTTP请求的默认重试配置，可以接受一个部分定义的axios默认配置对象作为参数
 * 参数中的配置将覆盖重试配置的默认值
 *
 * @param config 部分定义的axios默认配置，用于覆盖重试配置的默认值
 * @returns 返回一个完整填充了重试配置的axios配置对象
 */
export function createRetryOptions(config: Partial<CreateAxiosDefaults>) {
  const retryConfig: IAxiosRetryConfig = {
    retries: 0,
  };

  Object.assign(retryConfig, config);

  return retryConfig;
}

/**
 * 创建axios配置
 * 该函数用于生成HTTP请求的默认axios配置，可以接受一个部分定义的axios默认配置对象作为参数
 * 参数中的配置将覆盖axios配置的默认值
 *
 * @param config 部分定义的axios默认配置，用于覆盖axios配置的默认值
 * @returns 返回一个完整填充了默认值的axios配置对象
 */
export function createAxiosConfig(config: Partial<CreateAxiosDefaults>) {
  const TEN_SECONDS = 10 * 1000;

  const axiosConfig: CreateAxiosDefaults = {
    timeout: TEN_SECONDS,
    headers: {
      'Content-Type': 'application/json',
    },
    validateStatus: isHttpSuccess,
    paramsSerializer: (params) => {
      return stringify(params);
    },
  };

  Object.assign(axiosConfig, config);
  return axiosConfig;
}
