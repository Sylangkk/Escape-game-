import { createWebHistory, createRouter } from 'vue-router'

import Lobby from './components/Lobby.vue'
import ManoirDuMal from './components/ManoirDuMal.vue'

const routes = [
    { path: '/', component: Lobby },
    {path: '/manoir-du-mal', component: ManoirDuMal}

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;