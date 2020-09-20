import Vue from 'vue';
import axios from 'axios';

export default {
  install: () => {
    Vue.prototype.$api = axios.create({
      baseURL: (process.env.NODE_ENV === 'production') ? 'https://polkadot-overview.genesislab.net/api' : `http://127.0.0.1:${process.env.VUE_APP_API_PORT}/`
    });
  }
};
