import type { PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";

export function setupVitePlugins(viteEnv: Env.ImportMeta, buildTime: string) {
  const plugin: PluginOption = [vue()];
  return plugin;
}
