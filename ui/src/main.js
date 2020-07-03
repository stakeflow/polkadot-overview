import 'normalize.css';
import './assets/sass/main.scss';

import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all';

import { sync } from 'vuex-router-sync';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import $h from './plugins/helper';
import $api from './plugins/axios';

// Sync router and store
sync(store, router);

Vue.use($h);
Vue.use($api);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
