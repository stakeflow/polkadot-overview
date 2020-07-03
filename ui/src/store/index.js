import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import nodes from './modules/nodes';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    $w: {
      width: 0,
      height: 0
    }
  },
  getters: {
    $w: (state) => state.$w,
    responsiveClass: (state) => {
      let responsiveClass = '';
      switch (true) {
        case (state.$w.width > 1440):
          responsiveClass = 'xxl';
          break;
        case (state.$w.width > 1200):
          responsiveClass = 'xl';
          break;
        case (state.$w.width > 992):
          responsiveClass = 'lg';
          break;
        case (state.$w.width > 768):
          responsiveClass = 'md';
          break;
        default:
          responsiveClass = 'sm';
          break;
      }
      return responsiveClass;
    }
  },
  mutations: {
  },
  actions: {
    initResizeListener({ state, dispatch }) {
      if (state.$w.width === 0) {
        window.addEventListener('resize', () => dispatch('handleResize'));
        dispatch('handleResize');
      }
    },
    handleResize({ state }) {
      state.$w.width = window.innerWidth;
      state.$w.height = window.innerHeight;
    }
  },
  modules: {
    app,
    user,
    nodes
  }
});
