import type { ProxyOptions } from 'vite';
import { createServiceConfig } from '../../src/utils/service';
import path from 'path';

/**
 * 创建 Vite 代理配置
 *
 * @param env 环境变量，用于检查是否启用 HTTP 代理
 * @param enable 是否启用代理的标志
 * @returns 如果未启用 HTTP 代理，则返回 undefined；否则返回代理配置对象
 */
export function createViteProxy(env: Env.ImportMeta, enable: boolean) {
  // 检查是否启用 HTTP 代理
  const isEnableHttpProxy = enable && env.VITE_HTTP_PROXY === 'Y';
  if (!isEnableHttpProxy) {
    return undefined;
  }

  // 解构服务配置，包括基础 URL、代理模式和其他配置项
  const { baseURL, proxyPattern, other } = createServiceConfig(env);
  // 创建代理配置项，这是一个映射，键是代理模式，值是代理配置
  const proxy: Record<string, ProxyOptions> = createProxyItem({ baseURL, proxyPattern });
  // 遍历其他配置项，并将其添加到代理配置中
  other.forEach((item) => {
    Object.assign(proxy, createProxyItem(item));
  });

  // 返回完整的代理配置
  return proxy;
}

/**
 * 创建单个代理配置项
 *
 * @param item 服务配置项，包括基础 URL 和代理模式
 * @returns 返回一个映射，键是代理模式，值是代理配置
 */
function createProxyItem(item: App.Service.ServiceConfigItem) {
  const proxy: Record<string, ProxyOptions> = {};

  // 设置代理配置项，包括目标 URL、是否更改源以及路径重写规则
  proxy[item.proxyPattern] = {
    target: item.baseURL,
    changeOrigin: true,
    rewrite: (path) => path.replace(new RegExp(`^${item.proxyPattern}`), ''),
  };
  return proxy;
}
