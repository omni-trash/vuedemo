import { createApp } from 'vue'
import App from './App.vue'

import * as pinia from 'pinia';
import router from './router/index';
import utils from './services/utils';

const app = createApp(App);

app.use(pinia.createPinia());
app.use(router);
app.use(utils);
app.mount('#app');
