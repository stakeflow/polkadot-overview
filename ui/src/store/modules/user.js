export default {
  namespaced: true,
  state: {
    addresses: [],
    userStakes: {}
  },
  getters: {
    addresses: (state) => state.addresses,
    userStakes: (state) => state.userStakes
  },
  mutations: {
    UPDATE_ADDRESSES(state, addresses) {
      state.addresses = addresses;
    },

    UPDATE_USER_STAKES(state, userStakes) {
      state.userStakes = userStakes;
    }
  },
  actions: {
    async getUserStakes({ state, commit }) {
      const addresses = state.addresses.filter((a) => a.enabled).map((a) => a.address);

      await this._vm.$api.post(
        '/',
        {
          jsonrpc: '2.0',
          method: 'getUserStakes',
          params: {
            addresses
          },
          id: 1
        }
      ).then((res) => {
        commit('UPDATE_USER_STAKES', res.data.result.userStakes);
      });
    },

    getUserStakesLoop({ dispatch }) {
      dispatch('getUserStakes');

      setInterval(() => {
        dispatch('getUserStakes');
      }, 20000);
    },

    updateAddresses({ commit }, addresses) {
      localStorage.setItem('myAddresses', JSON.stringify(addresses));
      commit('UPDATE_ADDRESSES', addresses);
    },

    initAddresses({ commit }) {
      if (localStorage.getItem('myAddresses') !== null) {
        commit('UPDATE_ADDRESSES', JSON.parse(localStorage.getItem('myAddresses')));
      }
    }
  }
};
