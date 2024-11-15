import { createApp } from 'vue';
import App from './App.vue';
import './plugins/assets';
import { setupNProgress, setupIconifyOffline } from './plugins';
import { setupRouter } from './router';

async function setupApp() {
  setupNProgress();
  setupIconifyOffline();
  const app = createApp(App);

  await setupRouter(app);

  app.mount('#app');
}

setupApp();
