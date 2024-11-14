import type { App } from "vue";
import {
  type RouterHistory,
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import { createBuiltinVueRoutes } from "./routes/builtin";

const { VITE_ROUTER_HISTORY_MODE = "history", VITE_BASE_URL } = import.meta.env;

const historyCreatorMap: Record<
  Env.RouterHistoryMode,
  (base?: string) => RouterHistory
> = {
  hash: createWebHashHistory,
  history: createWebHistory,
  memory: createMemoryHistory,
};

export const router = createRouter({
  history: historyCreatorMap[VITE_ROUTER_HISTORY_MODE](VITE_BASE_URL),
  routes: createBuiltinVueRoutes(),
});
