import { createApp } from 'vue';
import App from './App.vue';

import './plugins/assets';
import { setupNProgress, setupIconifyOffline } from './plugins';
import { setupRouter } from './router';
import { setupStore } from './store';
import { setupI18n } from './locales';

async function setupApp() {
  setupNProgress();
  setupIconifyOffline();
  const app = createApp(App);
  setupStore(app);
  await setupRouter(app);

  setupI18n(app);
  app.mount('#app');
}

setupApp();
