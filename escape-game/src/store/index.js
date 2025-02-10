import { createStore } from 'vuex'

export default createStore({
    state () {
      return {
        count: 0,
        username: '',
      }
    },
    mutations: {
      setUser(state, username) {
        state.username = username
      }
    },
    getters: {
      getUsername(state) {
        return state.username
      }
    }, 
    actions: {
      incrementAsync ({ commit }) {
        setTimeout(() => {
          commit('increment')
        }, 1000)
      }
    },
    modules: {
      // login
    }
})