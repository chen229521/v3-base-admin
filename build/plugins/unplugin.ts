import type { PluginOption } from "vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
export function setupUnplugin(viteEnv: Env.ImportMeta) {
  /** The name of the local icon collection */

  const plugins: PluginOption[] = [
    Components({
      dts: "src/typings/components.d.ts",
      types: [{ from: "vue-router", names: ["RouterLink", "RouterView"] }],
      resolvers: [NaiveUiResolver()],
    }),
  ];

  return plugins;
}
