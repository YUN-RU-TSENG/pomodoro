import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import { useUserStore } from '@/stores/user'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: {
                requireAuth: true,
            },
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue'),
            meta: {
                requireGuest: true,
            },
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/RegisterView.vue'),
            meta: {
                requireGuest: true,
            },
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/views/NotFound.vue'),
        },
    ],
})

router.beforeEach((to) => {
    const userStore = useUserStore()

    if (to.meta.requiresAuth && !userStore.user.email) {
        return { name: 'login' }
    }

    if (to.meta.requireGuest && userStore.user.email) {
        return { name: 'home' }
    }
})

export default router
