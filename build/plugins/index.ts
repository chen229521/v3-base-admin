import type { PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import { setupElegantRouter } from "./router";
import { setupUnplugin } from "./unplugin";
export function setupVitePlugins(viteEnv: Env.ImportMeta, buildTime: string) {
  const plugin: PluginOption = [
    vue(),
    setupElegantRouter(),
    ...setupUnplugin(viteEnv),
  ];
  return plugin;
}
