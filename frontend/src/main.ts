import { createApp } from 'vue';
import { createPinia } from 'pinia';

// Imports Bootstrap customization
// import '@/assets/css/bootstrap-custom.scss';

// Imports Bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import '@/assets/css/custom.scss';
import 'bootstrap';

// Imports Base CSS
import '@/assets/css/base.scss';

import App from './App.vue';
import i18n from './i18n/i18n';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount('#app');
