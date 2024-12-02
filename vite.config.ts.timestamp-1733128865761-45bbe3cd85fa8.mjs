// vite.config.ts
import process3 from "node:process";
import { defineConfig, loadEnv } from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/vite@5.4.11_@types+node@22.7.9_sass@1.80.4/node_modules/vite/dist/node/index.js";

// build/plugins/index.ts
import vue from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/@vitejs+plugin-vue@5.1.5_vite@5.4.11_@types+node@22.7.9_sass@1.80.4__vue@3.5.12_typescript@5.6.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueDevtools from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/vite-plugin-vue-devtools@7.5.4_rollup@4.26.0_vite@5.4.11_@types+node@22.7.9_sass@1.80.4__vue@3.5.12_typescript@5.6.3_/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";

// build/plugins/router.ts
import ElegantVueRouter from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/@elegant-router+vue@0.3.8/node_modules/@elegant-router/vue/dist/vite.mjs";
function setupElegantRouter() {
  return ElegantVueRouter({
    layouts: {
      base: "src/layouts/base-layout/index.vue",
      blank: "src/layouts/blank-layout/index.vue"
    },
    customRoutes: {
      names: ["exception_403", "exception_404", "exception_500"]
    },
    routePathTransformer(routeName, routePath) {
      const key = routeName;
      if (key === "login") {
        const modules = [
          "pwd-login",
          "code-login",
          "register",
          "reset-pwd",
          "bind-wechat"
        ];
        const moduleReg = modules.join("|");
        return `/login/:module(${moduleReg})?`;
      }
      return routePath;
    },
    onRouteMetaGen(routeName) {
      const key = routeName;
      const constantRoutes = ["login", "403", "404", "500"];
      const meta = {
        title: key,
        i18nKey: `route.${key}`
      };
      if (constantRoutes.includes(key)) {
        meta.constant = true;
      }
      return meta;
    }
  });
}

// build/plugins/unplugin.ts
import process from "node:process";
import path from "node:path";
import Icons from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/unplugin-icons@0.19.3_@vue+compiler-sfc@3.5.12/node_modules/unplugin-icons/dist/vite.js";
import IconsResolver from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/unplugin-icons@0.19.3_@vue+compiler-sfc@3.5.12/node_modules/unplugin-icons/dist/resolver.js";
import Components from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/unplugin-vue-components@0.27.4_@babel+parser@7.26.2_rollup@4.26.0_vue@3.5.12_typescript@5.6.3_/node_modules/unplugin-vue-components/dist/vite.js";
import { AntDesignVueResolver, NaiveUiResolver } from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/unplugin-vue-components@0.27.4_@babel+parser@7.26.2_rollup@4.26.0_vue@3.5.12_typescript@5.6.3_/node_modules/unplugin-vue-components/dist/resolvers.js";
import { FileSystemIconLoader } from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/unplugin-icons@0.19.3_@vue+compiler-sfc@3.5.12/node_modules/unplugin-icons/dist/loaders.js";
import { createSvgIconsPlugin } from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.4.11_@types+node@22.7.9_sass@1.80.4_/node_modules/vite-plugin-svg-icons/dist/index.mjs";
function setupUnplugin(viteEnv) {
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv;
  const localIconPath = path.join(process.cwd(), "src/assets/svg-icon");
  console.log(localIconPath);
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, "");
  const plugins = [
    Icons({
      compiler: "vue3",
      customCollections: {
        [collectionName]: FileSystemIconLoader(
          localIconPath,
          (svg) => svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
        )
      },
      scale: 1,
      defaultClass: "inline-block"
    }),
    Components({
      dts: "src/typings/components.d.ts",
      types: [{ from: "vue-router", names: ["RouterLink", "RouterView"] }],
      resolvers: [
        AntDesignVueResolver({
          importStyle: false
        }),
        NaiveUiResolver(),
        IconsResolver({ customCollections: [collectionName], componentPrefix: VITE_ICON_PREFIX })
      ]
    }),
    createSvgIconsPlugin({
      iconDirs: [localIconPath],
      symbolId: `${VITE_ICON_LOCAL_PREFIX}-[dir]-[name]`,
      inject: "body-last",
      customDomId: "__SVG_ICON_LOCAL__"
    })
  ];
  return plugins;
}

// build/plugins/unocss.ts
import process2 from "node:process";
import path2 from "node:path";
import unocss from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/@unocss+vite@0.63.6_rollup@4.26.0_typescript@5.6.3_vite@5.4.11_@types+node@22.7.9_sass@1.80.4_/node_modules/@unocss/vite/dist/index.mjs";
import presetIcons from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/@unocss+preset-icons@0.63.6/node_modules/@unocss/preset-icons/dist/index.mjs";
import { FileSystemIconLoader as FileSystemIconLoader2 } from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/@iconify+utils@2.1.33/node_modules/@iconify/utils/lib/loader/node-loaders.mjs";
function setupUnocss(viteEnv) {
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv;
  const localIconPath = path2.join(process2.cwd(), "src/assets/svg-icon");
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, "");
  return unocss({
    presets: [
      presetIcons({
        prefix: `${VITE_ICON_PREFIX}-`,
        scale: 1,
        extraProperties: {
          display: "inline-block"
        },
        collections: {
          [collectionName]: FileSystemIconLoader2(
            localIconPath,
            (svg) => svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
          )
        },
        warn: true
      })
    ]
  });
}

// build/plugins/index.ts
function setupVitePlugins(viteEnv, buildTime) {
  const plugin = [
    vue(),
    setupElegantRouter(),
    VueDevtools(),
    ...setupUnplugin(viteEnv),
    setupUnocss(viteEnv)
  ];
  return plugin;
}

// vite.config.ts
import { URL, fileURLToPath } from "node:url";

// src/utils/service.ts
import json5 from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/index.js";
function createServiceConfig(env) {
  const { VITE_SERVICE_BASE_URL, VITE_OTHER_SERVICE_BASE_URL } = env;
  console.log(VITE_OTHER_SERVICE_BASE_URL);
  let other = {};
  try {
    other = json5.parse(VITE_OTHER_SERVICE_BASE_URL);
  } catch {
    console.error("VITE_OTHER_SERVICE_BASE_URL is not a valid json5 string");
  }
  const httpConfig = {
    baseURL: VITE_SERVICE_BASE_URL,
    other
  };
  const otherHttpKeys = Object.keys(httpConfig.other);
  const otherConfig = otherHttpKeys.map((key) => {
    return {
      key,
      baseURL: httpConfig.other[key],
      proxyPattern: createProxyPattern(key)
    };
  });
  const config = {
    baseURL: httpConfig.baseURL,
    proxyPattern: createProxyPattern(),
    other: otherConfig
  };
  return config;
}
function createProxyPattern(key) {
  if (!key) {
    return "/proxy-default";
  }
  return `/proxy-${key}`;
}

// build/config/proxy.ts
function createViteProxy(env, enable) {
  const isEnableHttpProxy = enable && env.VITE_HTTP_PROXY === "Y";
  if (!isEnableHttpProxy) {
    return void 0;
  }
  const { baseURL, proxyPattern, other } = createServiceConfig(env);
  const proxy = createProxyItem({ baseURL, proxyPattern });
  other.forEach((item) => {
    Object.assign(proxy, createProxyItem(item));
  });
  return proxy;
}
function createProxyItem(item) {
  const proxy = {};
  proxy[item.proxyPattern] = {
    target: item.baseURL,
    changeOrigin: true,
    rewrite: (path3) => path3.replace(new RegExp(`^${item.proxyPattern}`), "")
  };
  return proxy;
}

// build/config/time.ts
import dayjs from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/dayjs@1.11.13/node_modules/dayjs/dayjs.min.js";
import utc from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/dayjs@1.11.13/node_modules/dayjs/plugin/utc.js";
import timezone from "file:///F:/Test/v3-base-admin/node_modules/.pnpm/dayjs@1.11.13/node_modules/dayjs/plugin/timezone.js";
function getBuildTime() {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const buildTime = dayjs.tz(Date.now(), "Asia/Shanghai").format("YYYY-MM-DD HH:mm:ss");
  return buildTime;
}

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///F:/Test/v3-base-admin/vite.config.ts";
var vite_config_default = defineConfig((configEnv) => {
  const viteEnv = loadEnv(configEnv.mode, process3.cwd());
  const buildTime = getBuildTime();
  const enableProxy = configEnv.command === "serve" && !configEnv.isPreview;
  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./", __vite_injected_original_import_meta_url)),
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          additionalData: `@use "@/styles/scss/global.scss" as *;`
        }
      }
    },
    plugins: setupVitePlugins(viteEnv, buildTime),
    define: {
      BUILD_TIME: JSON.stringify(buildTime)
    },
    server: {
      host: "0.0.0.0",
      port: 9527,
      open: true,
      proxy: createViteProxy(viteEnv, enableProxy),
      fs: {
        cachedChecks: false
      }
    },
    build: {
      reportCompressedSize: false,
      sourcemap: viteEnv.VITE_SOURCE_MAP === "Y",
      commonjsOptions: {
        ignoreTryCatch: false
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYnVpbGQvcGx1Z2lucy9pbmRleC50cyIsICJidWlsZC9wbHVnaW5zL3JvdXRlci50cyIsICJidWlsZC9wbHVnaW5zL3VucGx1Z2luLnRzIiwgImJ1aWxkL3BsdWdpbnMvdW5vY3NzLnRzIiwgInNyYy91dGlscy9zZXJ2aWNlLnRzIiwgImJ1aWxkL2NvbmZpZy9wcm94eS50cyIsICJidWlsZC9jb25maWcvdGltZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkY6XFxcXFRlc3RcXFxcdjMtYmFzZS1hZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcVGVzdFxcXFx2My1iYXNlLWFkbWluXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi9UZXN0L3YzLWJhc2UtYWRtaW4vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHsgc2V0dXBWaXRlUGx1Z2lucyB9IGZyb20gJy4vYnVpbGQvcGx1Z2lucyc7XHJcbmltcG9ydCB7IFVSTCwgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJztcclxuaW1wb3J0IHsgY3JlYXRlVml0ZVByb3h5LCBnZXRCdWlsZFRpbWUgfSBmcm9tICcuL2J1aWxkL2NvbmZpZyc7XHJcblxyXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKChjb25maWdFbnYpID0+IHtcclxuICBjb25zdCB2aXRlRW52ID0gbG9hZEVudihjb25maWdFbnYubW9kZSwgcHJvY2Vzcy5jd2QoKSkgYXMgdW5rbm93biBhcyBFbnYuSW1wb3J0TWV0YTtcclxuICBjb25zdCBidWlsZFRpbWUgPSBnZXRCdWlsZFRpbWUoKTtcclxuXHJcbiAgY29uc3QgZW5hYmxlUHJveHkgPSBjb25maWdFbnYuY29tbWFuZCA9PT0gJ3NlcnZlJyAmJiAhY29uZmlnRW52LmlzUHJldmlldztcclxuICByZXR1cm4ge1xyXG4gICAgYmFzZTogdml0ZUVudi5WSVRFX0JBU0VfVVJMLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICd+JzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuLycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGNzczoge1xyXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgICAgc2Nzczoge1xyXG4gICAgICAgICAgYXBpOiAnbW9kZXJuLWNvbXBpbGVyJyxcclxuICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgQHVzZSBcIkAvc3R5bGVzL3Njc3MvZ2xvYmFsLnNjc3NcIiBhcyAqO2AsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBzZXR1cFZpdGVQbHVnaW5zKHZpdGVFbnYsIGJ1aWxkVGltZSksXHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgQlVJTERfVElNRTogSlNPTi5zdHJpbmdpZnkoYnVpbGRUaW1lKSxcclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgaG9zdDogJzAuMC4wLjAnLFxyXG4gICAgICBwb3J0OiA5NTI3LFxyXG4gICAgICBvcGVuOiB0cnVlLFxyXG4gICAgICBwcm94eTogY3JlYXRlVml0ZVByb3h5KHZpdGVFbnYsIGVuYWJsZVByb3h5KSxcclxuICAgICAgZnM6IHtcclxuICAgICAgICBjYWNoZWRDaGVja3M6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBmYWxzZSxcclxuICAgICAgc291cmNlbWFwOiB2aXRlRW52LlZJVEVfU09VUkNFX01BUCA9PT0gJ1knLFxyXG4gICAgICBjb21tb25qc09wdGlvbnM6IHtcclxuICAgICAgICBpZ25vcmVUcnlDYXRjaDogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkY6XFxcXFRlc3RcXFxcdjMtYmFzZS1hZG1pblxcXFxidWlsZFxcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFxUZXN0XFxcXHYzLWJhc2UtYWRtaW5cXFxcYnVpbGRcXFxccGx1Z2luc1xcXFxpbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRjovVGVzdC92My1iYXNlLWFkbWluL2J1aWxkL3BsdWdpbnMvaW5kZXgudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuaW1wb3J0IFZ1ZURldnRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scyc7XG5pbXBvcnQgeyBzZXR1cEVsZWdhbnRSb3V0ZXIgfSBmcm9tICcuL3JvdXRlcic7XG5pbXBvcnQgeyBzZXR1cFVucGx1Z2luIH0gZnJvbSAnLi91bnBsdWdpbic7XG5pbXBvcnQgeyBzZXR1cFVub2NzcyB9IGZyb20gJy4vdW5vY3NzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwVml0ZVBsdWdpbnModml0ZUVudjogRW52LkltcG9ydE1ldGEsIGJ1aWxkVGltZTogc3RyaW5nKSB7XG4gIGNvbnN0IHBsdWdpbjogUGx1Z2luT3B0aW9uID0gW1xuICAgIHZ1ZSgpLFxuICAgIHNldHVwRWxlZ2FudFJvdXRlcigpLFxuICAgIFZ1ZURldnRvb2xzKCksXG4gICAgLi4uc2V0dXBVbnBsdWdpbih2aXRlRW52KSxcbiAgICBzZXR1cFVub2Nzcyh2aXRlRW52KSxcbiAgXTtcblxuICByZXR1cm4gcGx1Z2luO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxUZXN0XFxcXHYzLWJhc2UtYWRtaW5cXFxcYnVpbGRcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcVGVzdFxcXFx2My1iYXNlLWFkbWluXFxcXGJ1aWxkXFxcXHBsdWdpbnNcXFxccm91dGVyLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi9UZXN0L3YzLWJhc2UtYWRtaW4vYnVpbGQvcGx1Z2lucy9yb3V0ZXIudHNcIjtpbXBvcnQgdHlwZSB7IFJvdXRlTWV0YSB9IGZyb20gJ3Z1ZS1yb3V0ZXInO1xuaW1wb3J0IEVsZWdhbnRWdWVSb3V0ZXIgZnJvbSAnQGVsZWdhbnQtcm91dGVyL3Z1ZS92aXRlJztcbmltcG9ydCB0eXBlIHsgUm91dGVLZXkgfSBmcm9tICdAZWxlZ2FudC1yb3V0ZXIvdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBFbGVnYW50Um91dGVyKCkge1xuICByZXR1cm4gRWxlZ2FudFZ1ZVJvdXRlcih7XG4gICAgbGF5b3V0czoge1xuICAgICAgYmFzZTogJ3NyYy9sYXlvdXRzL2Jhc2UtbGF5b3V0L2luZGV4LnZ1ZScsXG4gICAgICBibGFuazogJ3NyYy9sYXlvdXRzL2JsYW5rLWxheW91dC9pbmRleC52dWUnLFxuICAgIH0sXG4gICAgY3VzdG9tUm91dGVzOiB7XG4gICAgICBuYW1lczogWydleGNlcHRpb25fNDAzJywgJ2V4Y2VwdGlvbl80MDQnLCAnZXhjZXB0aW9uXzUwMCddLFxuICAgIH0sXG4gICAgcm91dGVQYXRoVHJhbnNmb3JtZXIocm91dGVOYW1lLCByb3V0ZVBhdGgpIHtcbiAgICAgIGNvbnN0IGtleSA9IHJvdXRlTmFtZSBhcyBSb3V0ZUtleTtcbiAgICAgIGlmIChrZXkgPT09ICdsb2dpbicpIHtcbiAgICAgICAgY29uc3QgbW9kdWxlczogVW5pb25LZXkuTG9naW5Nb2R1bGVbXSA9IFtcbiAgICAgICAgICAncHdkLWxvZ2luJyxcbiAgICAgICAgICAnY29kZS1sb2dpbicsXG4gICAgICAgICAgJ3JlZ2lzdGVyJyxcbiAgICAgICAgICAncmVzZXQtcHdkJyxcbiAgICAgICAgICAnYmluZC13ZWNoYXQnLFxuICAgICAgICBdO1xuXG4gICAgICAgIGNvbnN0IG1vZHVsZVJlZyA9IG1vZHVsZXMuam9pbignfCcpO1xuXG4gICAgICAgIHJldHVybiBgL2xvZ2luLzptb2R1bGUoJHttb2R1bGVSZWd9KT9gO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcm91dGVQYXRoO1xuICAgIH0sXG4gICAgb25Sb3V0ZU1ldGFHZW4ocm91dGVOYW1lKSB7XG4gICAgICBjb25zdCBrZXkgPSByb3V0ZU5hbWUgYXMgUm91dGVLZXk7XG5cbiAgICAgIGNvbnN0IGNvbnN0YW50Um91dGVzOiBSb3V0ZUtleVtdID0gWydsb2dpbicsICc0MDMnLCAnNDA0JywgJzUwMCddO1xuXG4gICAgICBjb25zdCBtZXRhOiBQYXJ0aWFsPFJvdXRlTWV0YT4gPSB7XG4gICAgICAgIHRpdGxlOiBrZXksXG4gICAgICAgIGkxOG5LZXk6IGByb3V0ZS4ke2tleX1gIGFzIEFwcC5JMThuLkkxOG5LZXksXG4gICAgICB9O1xuXG4gICAgICBpZiAoY29uc3RhbnRSb3V0ZXMuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICBtZXRhLmNvbnN0YW50ID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1ldGE7XG4gICAgfSxcbiAgfSk7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkY6XFxcXFRlc3RcXFxcdjMtYmFzZS1hZG1pblxcXFxidWlsZFxcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFxUZXN0XFxcXHYzLWJhc2UtYWRtaW5cXFxcYnVpbGRcXFxccGx1Z2luc1xcXFx1bnBsdWdpbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRjovVGVzdC92My1iYXNlLWFkbWluL2J1aWxkL3BsdWdpbnMvdW5wbHVnaW4udHNcIjtpbXBvcnQgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xyXG5pbXBvcnQgdHlwZSB7IFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgSWNvbnMgZnJvbSAndW5wbHVnaW4taWNvbnMvdml0ZSc7XHJcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gJ3VucGx1Z2luLWljb25zL3Jlc29sdmVyJztcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XHJcbmltcG9ydCB7IEFudERlc2lnblZ1ZVJlc29sdmVyLCBOYWl2ZVVpUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnO1xyXG5pbXBvcnQgeyBGaWxlU3lzdGVtSWNvbkxvYWRlciB9IGZyb20gJ3VucGx1Z2luLWljb25zL2xvYWRlcnMnO1xyXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBVbnBsdWdpbih2aXRlRW52OiBFbnYuSW1wb3J0TWV0YSkge1xyXG4gIGNvbnN0IHsgVklURV9JQ09OX1BSRUZJWCwgVklURV9JQ09OX0xPQ0FMX1BSRUZJWCB9ID0gdml0ZUVudjtcclxuXHJcbiAgY29uc3QgbG9jYWxJY29uUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnc3JjL2Fzc2V0cy9zdmctaWNvbicpO1xyXG5cclxuICBjb25zb2xlLmxvZyhsb2NhbEljb25QYXRoKTtcclxuXHJcbiAgLyoqIFRoZSBuYW1lIG9mIHRoZSBsb2NhbCBpY29uIGNvbGxlY3Rpb24gKi9cclxuICBjb25zdCBjb2xsZWN0aW9uTmFtZSA9IFZJVEVfSUNPTl9MT0NBTF9QUkVGSVgucmVwbGFjZShgJHtWSVRFX0lDT05fUFJFRklYfS1gLCAnJyk7XHJcblxyXG4gIGNvbnN0IHBsdWdpbnM6IFBsdWdpbk9wdGlvbltdID0gW1xyXG4gICAgSWNvbnMoe1xyXG4gICAgICBjb21waWxlcjogJ3Z1ZTMnLFxyXG4gICAgICBjdXN0b21Db2xsZWN0aW9uczoge1xyXG4gICAgICAgIFtjb2xsZWN0aW9uTmFtZV06IEZpbGVTeXN0ZW1JY29uTG9hZGVyKGxvY2FsSWNvblBhdGgsIChzdmcpID0+XHJcbiAgICAgICAgICBzdmcucmVwbGFjZSgvXjxzdmdcXHMvLCAnPHN2ZyB3aWR0aD1cIjFlbVwiIGhlaWdodD1cIjFlbVwiICcpLFxyXG4gICAgICAgICksXHJcbiAgICAgIH0sXHJcbiAgICAgIHNjYWxlOiAxLFxyXG4gICAgICBkZWZhdWx0Q2xhc3M6ICdpbmxpbmUtYmxvY2snLFxyXG4gICAgfSksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgZHRzOiAnc3JjL3R5cGluZ3MvY29tcG9uZW50cy5kLnRzJyxcclxuICAgICAgdHlwZXM6IFt7IGZyb206ICd2dWUtcm91dGVyJywgbmFtZXM6IFsnUm91dGVyTGluaycsICdSb3V0ZXJWaWV3J10gfV0sXHJcbiAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgIEFudERlc2lnblZ1ZVJlc29sdmVyKHtcclxuICAgICAgICAgIGltcG9ydFN0eWxlOiBmYWxzZSxcclxuICAgICAgICB9KSxcclxuICAgICAgICBOYWl2ZVVpUmVzb2x2ZXIoKSxcclxuICAgICAgICBJY29uc1Jlc29sdmVyKHsgY3VzdG9tQ29sbGVjdGlvbnM6IFtjb2xsZWN0aW9uTmFtZV0sIGNvbXBvbmVudFByZWZpeDogVklURV9JQ09OX1BSRUZJWCB9KSxcclxuICAgICAgXSxcclxuICAgIH0pLFxyXG4gICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xyXG4gICAgICBpY29uRGlyczogW2xvY2FsSWNvblBhdGhdLFxyXG4gICAgICBzeW1ib2xJZDogYCR7VklURV9JQ09OX0xPQ0FMX1BSRUZJWH0tW2Rpcl0tW25hbWVdYCxcclxuICAgICAgaW5qZWN0OiAnYm9keS1sYXN0JyxcclxuICAgICAgY3VzdG9tRG9tSWQ6ICdfX1NWR19JQ09OX0xPQ0FMX18nLFxyXG4gICAgfSksXHJcbiAgXTtcclxuXHJcbiAgcmV0dXJuIHBsdWdpbnM7XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxUZXN0XFxcXHYzLWJhc2UtYWRtaW5cXFxcYnVpbGRcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcVGVzdFxcXFx2My1iYXNlLWFkbWluXFxcXGJ1aWxkXFxcXHBsdWdpbnNcXFxcdW5vY3NzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi9UZXN0L3YzLWJhc2UtYWRtaW4vYnVpbGQvcGx1Z2lucy91bm9jc3MudHNcIjtpbXBvcnQgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnXHJcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcclxuaW1wb3J0IHVub2NzcyBmcm9tICdAdW5vY3NzL3ZpdGUnXHJcbmltcG9ydCBwcmVzZXRJY29ucyBmcm9tICdAdW5vY3NzL3ByZXNldC1pY29ucydcclxuaW1wb3J0IHsgRmlsZVN5c3RlbUljb25Mb2FkZXIgfSBmcm9tICdAaWNvbmlmeS91dGlscy9saWIvbG9hZGVyL25vZGUtbG9hZGVycydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXR1cFVub2Nzcyh2aXRlRW52OiBFbnYuSW1wb3J0TWV0YSkge1xyXG4gICAgY29uc3QgeyBWSVRFX0lDT05fUFJFRklYLCBWSVRFX0lDT05fTE9DQUxfUFJFRklYIH0gPSB2aXRlRW52XHJcblxyXG4gICAgY29uc3QgbG9jYWxJY29uUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnc3JjL2Fzc2V0cy9zdmctaWNvbicpXHJcblxyXG4gICAgLyoqIFRoZSBuYW1lIG9mIHRoZSBsb2NhbCBpY29uIGNvbGxlY3Rpb24gKi9cclxuICAgIGNvbnN0IGNvbGxlY3Rpb25OYW1lID0gVklURV9JQ09OX0xPQ0FMX1BSRUZJWC5yZXBsYWNlKGAke1ZJVEVfSUNPTl9QUkVGSVh9LWAsICcnKVxyXG5cclxuICAgIHJldHVybiB1bm9jc3Moe1xyXG4gICAgICAgIHByZXNldHM6IFtcclxuICAgICAgICAgICAgcHJlc2V0SWNvbnMoe1xyXG4gICAgICAgICAgICAgICAgcHJlZml4OiBgJHtWSVRFX0lDT05fUFJFRklYfS1gLFxyXG4gICAgICAgICAgICAgICAgc2NhbGU6IDEsXHJcbiAgICAgICAgICAgICAgICBleHRyYVByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgW2NvbGxlY3Rpb25OYW1lXTogRmlsZVN5c3RlbUljb25Mb2FkZXIobG9jYWxJY29uUGF0aCwgKHN2ZykgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3ZnLnJlcGxhY2UoL148c3ZnXFxzLywgJzxzdmcgd2lkdGg9XCIxZW1cIiBoZWlnaHQ9XCIxZW1cIiAnKVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB3YXJuOiB0cnVlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXVxyXG4gICAgfSlcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkY6XFxcXFRlc3RcXFxcdjMtYmFzZS1hZG1pblxcXFxzcmNcXFxcdXRpbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkY6XFxcXFRlc3RcXFxcdjMtYmFzZS1hZG1pblxcXFxzcmNcXFxcdXRpbHNcXFxcc2VydmljZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRjovVGVzdC92My1iYXNlLWFkbWluL3NyYy91dGlscy9zZXJ2aWNlLnRzXCI7aW1wb3J0IGpzb241IGZyb20gJ2pzb241JztcblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTY3MERcdTUyQTFcdTkxNERcdTdGNkVcbiAqIEBwYXJhbSBlbnYgXHU1MzA1XHU1NDJCXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU3Njg0SW1wb3J0TWV0YVx1NUJGOVx1OEM2MVxuICogQHJldHVybnMgXHU4RkQ0XHU1NkRFXHU2NzBEXHU1MkExXHU5MTREXHU3RjZFXHU1QkY5XHU4QzYxXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTZXJ2aWNlQ29uZmlnKGVudjogRW52LkltcG9ydE1ldGEpIHtcbiAgLy8gXHU0RUNFXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU0RTJEXHU4OUUzXHU2Nzg0XHU2NzBEXHU1MkExXHU1N0ZBXHU3ODQwVVJMXG4gIGNvbnN0IHsgVklURV9TRVJWSUNFX0JBU0VfVVJMLCBWSVRFX09USEVSX1NFUlZJQ0VfQkFTRV9VUkwgfSA9IGVudjtcblxuICBjb25zb2xlLmxvZyhWSVRFX09USEVSX1NFUlZJQ0VfQkFTRV9VUkwpO1xuXG4gIC8vIFx1NTIxRFx1NTlDQlx1NTMxNlx1NTE3Nlx1NEVENlx1NjcwRFx1NTJBMVx1NTdGQVx1Nzg0MFVSTFx1NzY4NFx1OTE0RFx1N0Y2RVx1NUJGOVx1OEM2MVxuICBsZXQgb3RoZXIgPSB7fSBhcyBSZWNvcmQ8QXBwLlNlcnZpY2UuT3RoZXJCYXNlVVJMS2V5LCBzdHJpbmc+O1xuICB0cnkge1xuICAgIG90aGVyID0ganNvbjUucGFyc2UoVklURV9PVEhFUl9TRVJWSUNFX0JBU0VfVVJMKTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmVycm9yKCdWSVRFX09USEVSX1NFUlZJQ0VfQkFTRV9VUkwgaXMgbm90IGEgdmFsaWQganNvbjUgc3RyaW5nJyk7XG4gIH1cblxuICAvLyBcdTY3ODRcdTVFRkFcdTdCODBcdTUzNTVcdTc2ODRIVFRQXHU2NzBEXHU1MkExXHU5MTREXHU3RjZFXHU1QkY5XHU4QzYxXG4gIGNvbnN0IGh0dHBDb25maWc6IEFwcC5TZXJ2aWNlLlNpbXBsZVNlcnZpY2VDb25maWcgPSB7XG4gICAgYmFzZVVSTDogVklURV9TRVJWSUNFX0JBU0VfVVJMLFxuICAgIG90aGVyLFxuICB9O1xuXG4gIC8vIFx1ODNCN1x1NTNENlx1NTE3Nlx1NEVENkhUVFBcdTY3MERcdTUyQTFcdTc2ODRcdTk1MkVcbiAgY29uc3Qgb3RoZXJIdHRwS2V5cyA9IE9iamVjdC5rZXlzKGh0dHBDb25maWcub3RoZXIpIGFzIEFwcC5TZXJ2aWNlLk90aGVyQmFzZVVSTEtleVtdO1xuXG4gIC8vIFx1NjgzOVx1NjM2RVx1NTE3Nlx1NEVENkhUVFBcdTY3MERcdTUyQTFcdTc2ODRcdTk1MkVcdUZGMENcdTY3ODRcdTVFRkFcdTZCQ0ZcdTRFMkFcdTY3MERcdTUyQTFcdTc2ODRcdTkxNERcdTdGNkVcdTk4NzlcdTY1NzBcdTdFQzRcbiAgY29uc3Qgb3RoZXJDb25maWc6IEFwcC5TZXJ2aWNlLk90aGVyU2VydmljZUNvbmZpZ0l0ZW1bXSA9IG90aGVySHR0cEtleXMubWFwKChrZXkpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAga2V5LFxuICAgICAgYmFzZVVSTDogaHR0cENvbmZpZy5vdGhlcltrZXldLFxuICAgICAgcHJveHlQYXR0ZXJuOiBjcmVhdGVQcm94eVBhdHRlcm4oa2V5KSxcbiAgICB9O1xuICB9KTtcblxuICAvLyBcdTY3ODRcdTVFRkFcdTY3MDBcdTdFQzhcdTc2ODRcdTY3MERcdTUyQTFcdTkxNERcdTdGNkVcdTVCRjlcdThDNjFcbiAgY29uc3QgY29uZmlnOiBBcHAuU2VydmljZS5TZXJ2aWNlQ29uZmlnID0ge1xuICAgIGJhc2VVUkw6IGh0dHBDb25maWcuYmFzZVVSTCxcbiAgICBwcm94eVBhdHRlcm46IGNyZWF0ZVByb3h5UGF0dGVybigpLFxuICAgIG90aGVyOiBvdGhlckNvbmZpZyxcbiAgfTtcblxuICAvLyBcdThGRDRcdTU2REVcdTY3MERcdTUyQTFcdTkxNERcdTdGNkVcdTVCRjlcdThDNjFcbiAgcmV0dXJuIGNvbmZpZztcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTRFRTNcdTc0MDZcdTZBMjFcdTVGMEZcdTc2ODRcdThERUZcdTVGODRcbiAqIEBwYXJhbSBrZXkgXHU1MTc2XHU0RUQ2XHU2NzBEXHU1MkExXHU3Njg0XHU5NTJFXHVGRjBDXHU1M0VGXHU5MDA5XG4gKiBAcmV0dXJucyBcdThGRDRcdTU2REVcdTRFRTNcdTc0MDZcdTZBMjFcdTVGMEZcdTc2ODRcdThERUZcdTVGODRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlUHJveHlQYXR0ZXJuKGtleT86IEFwcC5TZXJ2aWNlLk90aGVyQmFzZVVSTEtleSkge1xuICAvLyBcdTU5ODJcdTY3OUNcdTZDQTFcdTY3MDlcdTk1MkVcdUZGMENcdTUyMTlcdThGRDRcdTU2REVcdTlFRDhcdThCQTRcdTc2ODRcdTRFRTNcdTc0MDZcdTZBMjFcdTVGMEZcdThERUZcdTVGODRcbiAgaWYgKCFrZXkpIHtcbiAgICByZXR1cm4gJy9wcm94eS1kZWZhdWx0JztcbiAgfVxuXG4gIC8vIFx1NjgzOVx1NjM2RVx1OTUyRVx1OEZENFx1NTZERVx1NzI3OVx1NUI5QVx1NzY4NFx1NEVFM1x1NzQwNlx1NkEyMVx1NUYwRlx1OERFRlx1NUY4NFxuICByZXR1cm4gYC9wcm94eS0ke2tleX1gO1xufVxuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NjcwRFx1NTJBMVx1NzY4NFx1NTdGQVx1Nzg0MFVSTFxuICogQHBhcmFtIGVudiBcdTUzMDVcdTU0MkJcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTc2ODRJbXBvcnRNZXRhXHU1QkY5XHU4QzYxXG4gKiBAcGFyYW0gaXNQcm94eSBcdTY2MkZcdTU0MjZcdTRGN0ZcdTc1MjhcdTRFRTNcdTc0MDZcdTZBMjFcdTVGMEZcbiAqIEByZXR1cm5zIFx1OEZENFx1NTZERVx1NjcwRFx1NTJBMVx1NzY4NFx1NTdGQVx1Nzg0MFVSTFx1OTE0RFx1N0Y2RVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VydmljZUJhc2VVUkwoZW52OiBFbnYuSW1wb3J0TWV0YSwgaXNQcm94eTogYm9vbGVhbikge1xuICAvLyBcdTgzQjdcdTUzRDZcdTY3MERcdTUyQTFcdTkxNERcdTdGNkVcdTRFMkRcdTc2ODRcdTU3RkFcdTc4NDBVUkxcdTU0OENcdTUxNzZcdTVCODNcdTY3MERcdTUyQTFcdTkxNERcdTdGNkVcbiAgY29uc3QgeyBiYXNlVVJMLCBvdGhlciB9ID0gY3JlYXRlU2VydmljZUNvbmZpZyhlbnYpO1xuXG4gIC8vIFx1NTIxRFx1NTlDQlx1NTMxNlx1NTE3Nlx1NEVENlx1NjcwRFx1NTJBMVx1NzY4NFx1NTdGQVx1Nzg0MFVSTFx1OTE0RFx1N0Y2RVx1NUJGOVx1OEM2MVxuICBjb25zdCBvdGhlckJhc2VVUkwgPSB7fSBhcyBSZWNvcmQ8QXBwLlNlcnZpY2UuT3RoZXJCYXNlVVJMS2V5LCBzdHJpbmc+O1xuXG4gIC8vIFx1OTA0RFx1NTM4Nlx1NTE3Nlx1NEVENlx1NjcwRFx1NTJBMVx1OTE0RFx1N0Y2RVx1RkYwQ1x1NjgzOVx1NjM2RVx1NjYyRlx1NTQyNlx1NEY3Rlx1NzUyOFx1NEVFM1x1NzQwNlx1NkEyMVx1NUYwRlx1OEJCRVx1N0Y2RVx1NzZGOFx1NUU5NFx1NzY4NFVSTFxuICBvdGhlci5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgb3RoZXJCYXNlVVJMW2l0ZW0ua2V5XSA9IGlzUHJveHkgPyBpdGVtLnByb3h5UGF0dGVybiA6IGl0ZW0uYmFzZVVSTDtcbiAgfSk7XG5cbiAgLy8gXHU4RkQ0XHU1NkRFXHU2NzBEXHU1MkExXHU3Njg0XHU1N0ZBXHU3ODQwVVJMXHU5MTREXHU3RjZFXHVGRjBDXHU1MzA1XHU2MkVDXHU0RTNCXHU4OTgxXHU1N0ZBXHU3ODQwVVJMXHU1NDhDXHU1MTc2XHU1QjgzXHU2NzBEXHU1MkExXHU3Njg0VVJMXG4gIHJldHVybiB7XG4gICAgYmFzZVVSTDogaXNQcm94eSA/IGNyZWF0ZVByb3h5UGF0dGVybigpIDogYmFzZVVSTCxcbiAgICBvdGhlckJhc2VVUkwsXG4gIH07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkY6XFxcXFRlc3RcXFxcdjMtYmFzZS1hZG1pblxcXFxidWlsZFxcXFxjb25maWdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkY6XFxcXFRlc3RcXFxcdjMtYmFzZS1hZG1pblxcXFxidWlsZFxcXFxjb25maWdcXFxccHJveHkudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6L1Rlc3QvdjMtYmFzZS1hZG1pbi9idWlsZC9jb25maWcvcHJveHkudHNcIjtpbXBvcnQgdHlwZSB7IFByb3h5T3B0aW9ucyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgeyBjcmVhdGVTZXJ2aWNlQ29uZmlnIH0gZnJvbSAnLi4vLi4vc3JjL3V0aWxzL3NlcnZpY2UnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbi8qKlxyXG4gKiBcdTUyMUJcdTVFRkEgVml0ZSBcdTRFRTNcdTc0MDZcdTkxNERcdTdGNkVcclxuICpcclxuICogQHBhcmFtIGVudiBcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdUZGMENcdTc1MjhcdTRFOEVcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjggSFRUUCBcdTRFRTNcdTc0MDZcclxuICogQHBhcmFtIGVuYWJsZSBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhcdTRFRTNcdTc0MDZcdTc2ODRcdTY4MDdcdTVGRDdcclxuICogQHJldHVybnMgXHU1OTgyXHU2NzlDXHU2NzJBXHU1NDJGXHU3NTI4IEhUVFAgXHU0RUUzXHU3NDA2XHVGRjBDXHU1MjE5XHU4RkQ0XHU1NkRFIHVuZGVmaW5lZFx1RkYxQlx1NTQyNlx1NTIxOVx1OEZENFx1NTZERVx1NEVFM1x1NzQwNlx1OTE0RFx1N0Y2RVx1NUJGOVx1OEM2MVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVZpdGVQcm94eShlbnY6IEVudi5JbXBvcnRNZXRhLCBlbmFibGU6IGJvb2xlYW4pIHtcclxuICAvLyBcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjggSFRUUCBcdTRFRTNcdTc0MDZcclxuICBjb25zdCBpc0VuYWJsZUh0dHBQcm94eSA9IGVuYWJsZSAmJiBlbnYuVklURV9IVFRQX1BST1hZID09PSAnWSc7XHJcbiAgaWYgKCFpc0VuYWJsZUh0dHBQcm94eSkge1xyXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIC8vIFx1ODlFM1x1Njc4NFx1NjcwRFx1NTJBMVx1OTE0RFx1N0Y2RVx1RkYwQ1x1NTMwNVx1NjJFQ1x1NTdGQVx1Nzg0MCBVUkxcdTMwMDFcdTRFRTNcdTc0MDZcdTZBMjFcdTVGMEZcdTU0OENcdTUxNzZcdTRFRDZcdTkxNERcdTdGNkVcdTk4NzlcclxuICBjb25zdCB7IGJhc2VVUkwsIHByb3h5UGF0dGVybiwgb3RoZXIgfSA9IGNyZWF0ZVNlcnZpY2VDb25maWcoZW52KTtcclxuICAvLyBcdTUyMUJcdTVFRkFcdTRFRTNcdTc0MDZcdTkxNERcdTdGNkVcdTk4NzlcdUZGMENcdThGRDlcdTY2MkZcdTRFMDBcdTRFMkFcdTY2MjBcdTVDMDRcdUZGMENcdTk1MkVcdTY2MkZcdTRFRTNcdTc0MDZcdTZBMjFcdTVGMEZcdUZGMENcdTUwM0NcdTY2MkZcdTRFRTNcdTc0MDZcdTkxNERcdTdGNkVcclxuICBjb25zdCBwcm94eTogUmVjb3JkPHN0cmluZywgUHJveHlPcHRpb25zPiA9IGNyZWF0ZVByb3h5SXRlbSh7IGJhc2VVUkwsIHByb3h5UGF0dGVybiB9KTtcclxuICAvLyBcdTkwNERcdTUzODZcdTUxNzZcdTRFRDZcdTkxNERcdTdGNkVcdTk4NzlcdUZGMENcdTVFNzZcdTVDMDZcdTUxNzZcdTZERkJcdTUyQTBcdTUyMzBcdTRFRTNcdTc0MDZcdTkxNERcdTdGNkVcdTRFMkRcclxuICBvdGhlci5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICBPYmplY3QuYXNzaWduKHByb3h5LCBjcmVhdGVQcm94eUl0ZW0oaXRlbSkpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBcdThGRDRcdTU2REVcdTVCOENcdTY1NzRcdTc2ODRcdTRFRTNcdTc0MDZcdTkxNERcdTdGNkVcclxuICByZXR1cm4gcHJveHk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcdTUyMUJcdTVFRkFcdTUzNTVcdTRFMkFcdTRFRTNcdTc0MDZcdTkxNERcdTdGNkVcdTk4NzlcclxuICpcclxuICogQHBhcmFtIGl0ZW0gXHU2NzBEXHU1MkExXHU5MTREXHU3RjZFXHU5ODc5XHVGRjBDXHU1MzA1XHU2MkVDXHU1N0ZBXHU3ODQwIFVSTCBcdTU0OENcdTRFRTNcdTc0MDZcdTZBMjFcdTVGMEZcclxuICogQHJldHVybnMgXHU4RkQ0XHU1NkRFXHU0RTAwXHU0RTJBXHU2NjIwXHU1QzA0XHVGRjBDXHU5NTJFXHU2NjJGXHU0RUUzXHU3NDA2XHU2QTIxXHU1RjBGXHVGRjBDXHU1MDNDXHU2NjJGXHU0RUUzXHU3NDA2XHU5MTREXHU3RjZFXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVQcm94eUl0ZW0oaXRlbTogQXBwLlNlcnZpY2UuU2VydmljZUNvbmZpZ0l0ZW0pIHtcclxuICBjb25zdCBwcm94eTogUmVjb3JkPHN0cmluZywgUHJveHlPcHRpb25zPiA9IHt9O1xyXG5cclxuICAvLyBcdThCQkVcdTdGNkVcdTRFRTNcdTc0MDZcdTkxNERcdTdGNkVcdTk4NzlcdUZGMENcdTUzMDVcdTYyRUNcdTc2RUVcdTY4MDcgVVJMXHUzMDAxXHU2NjJGXHU1NDI2XHU2NkY0XHU2NTM5XHU2RTkwXHU0RUU1XHU1M0NBXHU4REVGXHU1Rjg0XHU5MUNEXHU1MTk5XHU4OUM0XHU1MjE5XHJcbiAgcHJveHlbaXRlbS5wcm94eVBhdHRlcm5dID0ge1xyXG4gICAgdGFyZ2V0OiBpdGVtLmJhc2VVUkwsXHJcbiAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoYF4ke2l0ZW0ucHJveHlQYXR0ZXJufWApLCAnJyksXHJcbiAgfTtcclxuICByZXR1cm4gcHJveHk7XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxUZXN0XFxcXHYzLWJhc2UtYWRtaW5cXFxcYnVpbGRcXFxcY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFxUZXN0XFxcXHYzLWJhc2UtYWRtaW5cXFxcYnVpbGRcXFxcY29uZmlnXFxcXHRpbWUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6L1Rlc3QvdjMtYmFzZS1hZG1pbi9idWlsZC9jb25maWcvdGltZS50c1wiO2ltcG9ydCBkYXlqcyBmcm9tICdkYXlqcydcclxuaW1wb3J0IHV0YyBmcm9tICdkYXlqcy9wbHVnaW4vdXRjJ1xyXG5pbXBvcnQgdGltZXpvbmUgZnJvbSAnZGF5anMvcGx1Z2luL3RpbWV6b25lJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEJ1aWxkVGltZSgpIHtcclxuICAgIGRheWpzLmV4dGVuZCh1dGMpXHJcbiAgICBkYXlqcy5leHRlbmQodGltZXpvbmUpXHJcblxyXG4gICAgY29uc3QgYnVpbGRUaW1lID0gZGF5anMudHooRGF0ZS5ub3coKSwgJ0FzaWEvU2hhbmdoYWknKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKVxyXG5cclxuICAgIHJldHVybiBidWlsZFRpbWVcclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVQLE9BQU9BLGNBQWE7QUFDM1EsU0FBUyxjQUFjLGVBQWU7OztBQ0F0QyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxpQkFBaUI7OztBQ0R4QixPQUFPLHNCQUFzQjtBQUd0QixTQUFTLHFCQUFxQjtBQUNuQyxTQUFPLGlCQUFpQjtBQUFBLElBQ3RCLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxJQUNUO0FBQUEsSUFDQSxjQUFjO0FBQUEsTUFDWixPQUFPLENBQUMsaUJBQWlCLGlCQUFpQixlQUFlO0FBQUEsSUFDM0Q7QUFBQSxJQUNBLHFCQUFxQixXQUFXLFdBQVc7QUFDekMsWUFBTSxNQUFNO0FBQ1osVUFBSSxRQUFRLFNBQVM7QUFDbkIsY0FBTSxVQUFrQztBQUFBLFVBQ3RDO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0Y7QUFFQSxjQUFNLFlBQVksUUFBUSxLQUFLLEdBQUc7QUFFbEMsZUFBTyxrQkFBa0IsU0FBUztBQUFBLE1BQ3BDO0FBRUEsYUFBTztBQUFBLElBQ1Q7QUFBQSxJQUNBLGVBQWUsV0FBVztBQUN4QixZQUFNLE1BQU07QUFFWixZQUFNLGlCQUE2QixDQUFDLFNBQVMsT0FBTyxPQUFPLEtBQUs7QUFFaEUsWUFBTSxPQUEyQjtBQUFBLFFBQy9CLE9BQU87QUFBQSxRQUNQ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QUEsSUFDQSxTQUFTLGlCQUFpQixTQUFTLFNBQVM7QUFBQSxJQUM1QyxRQUFRO0FBQUEsTUFDTixZQUFZLEtBQUssVUFBVSxTQUFTO0FBQUEsSUFDdEM7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE9BQU8sZ0JBQWdCLFNBQVMsV0FBVztBQUFBLE1BQzNDLElBQUk7QUFBQSxRQUNGLGNBQWM7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLHNCQUFzQjtBQUFBLE1BQ3RCLFdBQVcsUUFBUSxvQkFBb0I7QUFBQSxNQUN2QyxpQkFBaUI7QUFBQSxRQUNmLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJwcm9jZXNzIiwgInByb2Nlc3MiLCAicGF0aCIsICJGaWxlU3lzdGVtSWNvbkxvYWRlciIsICJwYXRoIiwgInByb2Nlc3MiLCAiRmlsZVN5c3RlbUljb25Mb2FkZXIiLCAicGF0aCIsICJwcm9jZXNzIl0KfQo=
