export default {
  namespaced: true,
  state: {
    isNodeUpdateLoopStarted: false,
    isNodesUpdateLoopStarted: false,
    node: null,
    nodes: [],
    sortBy: 'stakeTotal',
    sortOrder: 'asc'
  },
  getters: {
    node(state) {
      // return state.nodes.find((node) => node.stashAddress === rootState.route.params.stash);
      return state.node;
    },

    nodesSorted(state) {
      const nodes = [...state.nodes].sort((a, b) => {
        if (state.sortBy === 'stakeTotal') {
          if (Number(a[state.sortBy]) > Number(b[state.sortBy])) { return 1; }
          if (Number(a[state.sortBy]) < Number(b[state.sortBy])) { return -1; }
        } else {
          if (a[state.sortBy] > b[state.sortBy]) { return 1; }
          if (a[state.sortBy] < b[state.sortBy]) { return -1; }
        }
        return 0;
      });

      if (state.sortOrder === 'asc') {
        nodes.reverse();
      }

      return nodes;
    }
  },
  mutations: {
    SET_NODE(state, node) {
      state.node = node;
    },

    SET_NODES(state, nodes) {
      state.nodes = nodes;
    },

    UPDATE_SORTING(state, sortBy) {
      state.sortBy = sortBy;
    },

    UPDATE_NODE_UPDATE_FLAG(state, isNodeUpdateLoopStarted) {
      state.isNodeUpdateLoopStarted = isNodeUpdateLoopStarted;
    },

    UPDATE_NODES_UPDATE_FLAG(state, isNodesUpdateLoopStarted) {
      state.isNodesUpdateLoopStarted = isNodesUpdateLoopStarted;
    }
  },
  actions: {
    async getNode({ commit, rootState }) {
      const response = await this._vm.$api.post(
        '/',
        {
          jsonrpc: '2.0',
          method: 'getNode',
          id: 1,
          params: {
            stashAddress: rootState.route.params.stash
          }
        }
      );
      commit('SET_NODE', response.data.result);
    },

    async getNodeLoop({ commit, dispatch, state }) {
      dispatch('getNode');
      if (!state.isNodeUpdateLoopStarted) {
        setInterval(() => {
          dispatch('getNode');
        }, 4500);
        commit('UPDATE_NODE_UPDATE_FLAG', true);
      }
    },

    async getNodes({ commit }) {
      const response = await this._vm.$api.post(
        '/',
        {
          jsonrpc: '2.0',
          method: 'getNodes',
          id: 1
        }
      );
      commit('SET_NODES', response.data.result);
    },

    async getNodesLoop({ commit, dispatch, state }) {
      dispatch('getNodes');
      if (!state.isNodesUpdateLoopStarted) {
        setInterval(() => {
          dispatch('getNodes');
        }, 4500);
        commit('UPDATE_NODES_UPDATE_FLAG', true);
      }
    }
  }
};
