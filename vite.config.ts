import process from "node:process";
import { defineConfig, loadEnv } from "vite";
import { setupVitePlugins } from "./build/plugins";
import { getBuildTime } from "./build/config/time";

// https://vite.dev/config/
export default defineConfig((configEnv) => {
  const viteEnv = loadEnv(
    configEnv.mode,
    process.cwd()
  ) as unknown as Env.ImportMeta;
  const buildTime = getBuildTime();
  return {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          additionalData: `@use "@/styles/scss/global.scss" as *;`,
        },
      },
    },
    plugins: setupVitePlugins(viteEnv, buildTime),
  };
});
