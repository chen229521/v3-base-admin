import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

/**
 * 定义常用的内容类型常量
 */
export type ContentType =
  | 'text/html'
  | 'text/plain'
  | 'multipart/form-data'
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'application/octet-stream';

/**
 * 请求选项接口，用于配置请求的钩子和错误处理
 * @template ResponseData 后端返回的数据类型
 */
export interface RequestOption<ResponseData = any> {
  /**
   * 请求前的处理函数，可以用于修改请求配置
   * @param config 内部请求配置
   * @returns 修改后的请求配置或其Promise
   */
  onRequest: (
    config: InternalAxiosRequestConfig,
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;

  /**
   * 判断后端返回是否成功的函数
   * @param response 后端返回的响应
   * @returns 成功与否的判断结果
   */
  isBackendSuccess: (response: AxiosResponse<ResponseData>) => boolean;

  /**
   * 后端请求失败时的处理函数，可以用于重试或其他操作
   * @param response 后端返回的响应
   * @param instance Axios实例
   * @returns 处理后的响应或null，或一个Promise
   */
  onBackendFail: (
    response: AxiosResponse<ResponseData>,
    instance: AxiosInstance,
  ) => Promise<AxiosResponse | null> | Promise<void>;

  /**
   * 转换后端响应的函数，可以用于统一处理响应数据
   * @param response 后端返回的响应
   * @returns 转换后的数据或其Promise
   */
  transformBackendResponse(response: AxiosResponse<ResponseData>): any | Promise<any>;

  /**
   * 错误处理函数，用于处理请求中出现的错误
   * @param error 请求中的错误
   */
  onError: (error: AxiosError<ResponseData>) => void | Promise<void>;
}

/**
 * 响应映射，定义了不同类型的响应数据
 */
interface ResponseMap {
  blob: Blob;
  text: string;
  arrayBuffer: ArrayBuffer;
  stream: ReadableStream<Uint8Array>;
  document: Document;
}

/**
 * 响应类型，包括json和其他自定义类型
 */
export type ResponseType = keyof ResponseMap | 'json';

/**
 * 根据响应类型映射到具体的数据类型
 * @template R 响应类型
 * @template JsonType JSON数据类型
 */
export type MappedType<R extends ResponseType, JsonType = any> = R extends keyof ResponseMap
  ? ResponseMap[R]
  : JsonType;

/**
 * 自定义请求配置，排除了responseType并添加了新的泛型
 * @template R 响应类型
 */
export type CustomAxiosRequestConfig<R extends ResponseType = 'json'> = Omit<
  AxiosRequestConfig,
  'responseType'
> & {
  responseType?: R;
};

/**
 * 请求实例的公共方法，包括取消请求和获取状态
 * @template T 状态类型
 */
export interface RequestInstanceCommon<T> {
  /**
   * 取消特定的请求
   * @param requestId 请求ID
   */
  cancelRequest: (requestId: string) => void;

  /**
   * 取消所有请求
   */
  cancelAllRequest: () => void;

  /**
   * 请求实例的状态
   */
  state: T;
}

/**
 * 请求实例，包括发起请求和取消请求的方法
 * @template S 状态类型
 */
export interface RequestInstance<S = Record<string, unknown>> extends RequestInstanceCommon<S> {
  /**
   * 发起请求并返回对应的响应数据
   * @template T 响应数据类型
   * @template R 响应类型
   * @param config 请求配置
   * @returns 响应数据的Promise
   */
  <T = any, R extends ResponseType = 'json'>(config: CustomAxiosRequestConfig<R>): Promise<
    MappedType<R, T>
  >;
}

/**
 * 成功的响应数据结构
 * @template T 响应数据类型
 * @template ResponseData 后端返回的数据类型
 */
export type FlatResponseSuccessData<T = any, ResponseData = any> = {
  data: T;
  error: null;
  response: AxiosResponse<ResponseData>;
};

/**
 * 失败的响应数据结构
 * @template ResponseData 后端返回的数据类型
 */
export type FlatResponseFailData<ResponseData = any> = {
  data: null;
  error: AxiosError<ResponseData>;
  response: AxiosResponse<ResponseData>;
};

/**
 * 统一的响应数据结构，可以是成功或失败的数据
 * @template T 响应数据类型
 * @template ResponseData 后端返回的数据类型
 */
export type FlatResponseData<T = any, ResponseData = any> =
  | FlatResponseSuccessData<T, ResponseData>
  | FlatResponseFailData<ResponseData>;

/**
 * 扁平化请求实例，返回统一的响应数据结构
 * @template S 状态类型
 * @template ResponseData 后端返回的数据类型
 */
export interface FlatRequstInstance<S = Record<string, unknown>, ResponseData = any>
  extends RequestInstanceCommon<S> {
  /**
   * 发起请求并返回扁平化的响应数据
   * @template T 响应数据类型
   * @template R 响应类型
   * @param config 请求配置
   * @returns 扁平化的响应数据的Promise
   */
  <T = any, R extends ResponseType = 'json'>(config: CustomAxiosRequestConfig<R>): Promise<
    FlatResponseData<MappedType<R, T>, ResponseData>
  >;
}
