import { createMemoryHistory, createWebHistory, createRouter } from 'vue-router'

import Dashboard from '../components/pages/Dashboard.vue'
import Lesson from '../components/pages/Lesson.vue'


const routes = [
    { path: '/', component: Dashboard, name: 'dashboard' },
    { path: '/lesson/:id', component: Lesson, name: 'lesson' }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router