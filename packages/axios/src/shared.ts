import type { AxiosHeaderValue, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * 获取请求的Content-Type头
 * @param config Axios请求配置对象
 * @returns 返回Content-Type的值，默认为'application/json'
 */
export function getContentType(config: InternalAxiosRequestConfig) {
  const contentType: AxiosHeaderValue = config.headers?.['Content-Type'] || 'application/json';

  return contentType;
}

/**
 * 判断HTTP状态码是否表示成功
 * @param status HTTP状态码
 * @returns 如果状态码在200到299之间，或者为304，则返回true，否则返回false
 */
export function isHttpSuccess(status: number) {
  const isSuccessCode = status >= 200 && status < 300;
  return isSuccessCode || status === 304;
}

/**
 * 判断响应类型是否为JSON
 * @param response Axios响应对象
 * @returns 如果响应类型为'json'或未指定响应类型，则返回true，否则返回false
 */
export function isResponseJson(response: AxiosResponse) {
  const { responseType } = response.config;

  return responseType === 'json' || responseType === undefined;
}
