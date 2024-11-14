import { createApp } from "vue";
import App from "./App.vue";
import { setupNProgress } from "./plugins";
import { setupRouter } from "./router";

async function setupApp() {
  setupNProgress();
  const app = createApp(App);

  await setupRouter(app);

  app.mount("#app");
}

setupApp();
