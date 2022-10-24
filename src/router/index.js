import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useBaseLoading } from '@/components/Base/BaseLoading/index'
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

router.beforeEach(async (to) => {
    const userStore = useUserStore()

    // 假如尚未加載完 firebase user 狀態，等其確認加載完成再繼續路由導向
    if (!userStore.isUserLoadFinish) {
        const { close } = useBaseLoading({ text: '啟動應用' })
        await userStore.getCurrentUser()
        close()
    }

    if (to.meta.requireAuth && !userStore.user.uid) {
        return { name: 'login' }
    }

    if (to.meta.requireGuest && userStore.user.uid) {
        return { name: 'home' }
    }

    return true
})

export default router
