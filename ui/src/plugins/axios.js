import Vue from 'vue';
import axios from 'axios';

export default {
  install: () => {
    Vue.prototype.$api = axios.create({
      baseURL: `http://127.0.0.1:${process.env.VUE_APP_API_PORT}/`
    });
  }
};
