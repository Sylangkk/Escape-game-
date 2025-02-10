import { createApp } from 'vue'
// import { createStore } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App.vue'
import router from './router'

import { faBars } from '@fortawesome/free-solid-svg-icons'

import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
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

library.add(faBars)

const app = createApp(App)
app.use(router)
app.use(store)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
