import { createWebHistory, createRouter } from 'vue-router'

import Lobby from './components/Lobby.vue'
import ManoirDuMal from './components/ManoirDuMal.vue'
import Connexion from './components/LoginForm.vue'
import Leaderboard from './components/LeaderboardPage.vue'
import Stats from './components/StatsPage.vue'

const routes = [
    { path: '/', component: Connexion },
    { path: '/lobby', component: Lobby },
    { path: '/manoir-du-mal', component: ManoirDuMal },
    { path: '/leaderboard', component: Leaderboard },
    { path: '/stats', component: Stats }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;