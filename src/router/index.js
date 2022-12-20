import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import { useBaseLoading } from '@/components/Base/BaseLoading/index'
import { useUserStore } from '@/stores/user'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: AppLayout,
            meta: {
                requireAuth: true,
            },
            children: [
                {
                    path: '',
                    name: 'home',
                    component: () => import('@/views/HomeView.vue'),
                    meta: {
                        requireAuth: true,
                    },
                },
                {
                    path: 'pomodoro-setting',
                    name: 'pomodoroSetting',
                    component: () => import('@/views/PomodoroSettingView.vue'),
                    meta: {
                        requireAuth: true,
                    },
                },
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/DashboardView.vue'),
                    meta: {
                        requireAuth: true,
                    },
                },
            ],
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
        // 顯示等待組件
        const { close } = useBaseLoading()
        await userStore.getCurrentUser()
        // 關閉等待組件
        close()
    }

    // 假如是需要登入的頁面，需要登入，否則未登入導向登入
    if (to.meta.requireAuth && !userStore.user.uid) {
        return { name: 'login' }
    }

    // 假如是需要尚未登入的頁面，若是已登入則導向首頁
    if (to.meta.requireGuest && userStore.user.uid) {
        return { name: 'home' }
    }

    return true
})

export default router
