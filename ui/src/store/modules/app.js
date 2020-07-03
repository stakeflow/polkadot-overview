export default {
  namespaced: true,
  state: {
    appVersion: process.env.VUE_APP_VERSION,
    appState: {},
    isAppStateUpdateLoopStarted: false
  },
  getters: {
    appVersion: (state) => state.appVersion,
    appState: (state) => state.appState
  },
  mutations: {
    SET_APP_STATE(state, appState) {
      state.appState = appState;
    },
    UPDATE_APP_STATE_UPDATE_FLAG(state, isAppStateUpdateLoopStarted) {
      state.isAppStateUpdateLoopStarted = isAppStateUpdateLoopStarted;
    }
  },
  actions: {
    async getAppState({ commit }) {
      const response = await this._vm.$api.post(
        '/',
        {
          jsonrpc: '2.0',
          method: 'getAppState',
          id: 1
        }
      );

      commit('SET_APP_STATE', response.data.result);
    },

    async getAppStateLoop({ commit, dispatch, state }) {
      dispatch('getAppState');
      if (!state.isAppStateUpdateLoopStarted) {
        setInterval(() => {
          dispatch('getAppState');
        }, 4500);
        commit('UPDATE_APP_STATE_UPDATE_FLAG', true);
      }
    }
  }
};
