import json5 from 'json5';

/**
 * 创建服务配置
 * @param env 包含环境变量的ImportMeta对象
 * @returns 返回服务配置对象
 */
export function createServiceConfig(env: Env.ImportMeta) {
  // 从环境变量中解构服务基础URL
  const { VITE_SERVICE_BASE_URL, VITE_OTHER_SERVICE_BASE_URL } = env;

  // 初始化其他服务基础URL的配置对象
  let other = {} as Record<App.Service.OtherBaseURLKey, string>;

  // 尝试解析其他服务基础URL的JSON5字符串
  try {
    other = json5.parse(VITE_OTHER_SERVICE_BASE_URL);
  } catch {
    // 如果解析失败，则输出错误信息
    console.error('VITE_OTHER_SERVICE_BASE_URL is not a valid json5 string');
  }

  // 构建简单的HTTP服务配置对象
  const httpConfig: App.Service.SimpleServiceConfig = {
    baseURL: VITE_SERVICE_BASE_URL,
    other,
  };

  // 获取其他HTTP服务的键
  const otherHttpKeys = Object.keys(httpConfig.other) as App.Service.OtherBaseURLKey[];

  // 根据其他HTTP服务的键，构建每个服务的配置项数组
  const otherConfig: App.Service.OtherServiceConfigItem[] = otherHttpKeys.map((key) => {
    return {
      key,
      baseURL: httpConfig.other[key],
      proxyPattern: createProxyPattern(key),
    };
  });

  // 构建最终的服务配置对象
  const config: App.Service.ServiceConfig = {
    baseURL: httpConfig.baseURL,
    proxyPattern: createProxyPattern(),
    other: otherConfig,
  };

  // 返回服务配置对象
  return config;
}

/**
 * 创建代理模式的路径
 * @param key 其他服务的键，可选
 * @returns 返回代理模式的路径
 */
function createProxyPattern(key?: App.Service.OtherBaseURLKey) {
  // 如果没有键，则返回默认的代理模式路径
  if (!key) {
    return '/proxy-default';
  }

  // 根据键返回特定的代理模式路径
  return `/proxy-${key}`;
}

/**
 * 获取服务的基础URL
 * @param env 包含环境变量的ImportMeta对象
 * @param isProxy 是否使用代理模式
 * @returns 返回服务的基础URL配置
 */
export function getServiceBaseURL(env: Env.ImportMeta, isProxy: boolean) {
  // 获取服务配置中的基础URL和其它服务配置
  const { baseURL, other } = createServiceConfig(env);

  // 初始化其他服务的基础URL配置对象
  const otherBaseURL = {} as Record<App.Service.OtherBaseURLKey, string>;

  // 遍历其他服务配置，根据是否使用代理模式设置相应的URL
  other.forEach((item) => {
    otherBaseURL[item.key] = isProxy ? item.proxyPattern : item.baseURL;
  });

  // 返回服务的基础URL配置，包括主要基础URL和其它服务的URL
  return {
    baseURL: isProxy ? createProxyPattern() : baseURL,
    otherBaseURL,
  };
}
