import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const rootRoute = { path: '/app/home' }

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: rootRoute
  },

  // 🌐 Public routes
  {
    path: '/landing',
    component: () => import('@/views/LandingView.vue'),
    meta: { public: true }
  },
  {
    path: '/onboarding',
    component: () => import('@/views/OnboardingView.vue'),
    meta: { public: true }
  },

  // 🔐 Protected app (tabs)
  {
    path: '/app',
    component: () => import('@/views/TabsView.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/app/home' },

      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/HomeView.vue')
      },
      {
        path: 'signals',
        name: 'signals',
        component: () => import('@/views/SignalsView.vue')
      },
      {
        path: 'watchlist',
        name: 'watchlist',
        component: () => import('@/views/WatchlistView.vue')
      },
      {
        path: 'portfolio',
        name: 'portfolio',
        component: () => import('@/views/PortfolioView.vue')
      },
      {
        path: 'market',
        name: 'market',
        component: () => import('@/views/MarketView.vue')
      }
    ]
  },

  // ❌ fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


// 🧠 Global guard (замества Keycloak логиката)
router.beforeEach((to) => {
  const auth = useAuthStore()

  // redirect root
  if (to.path === '/') {
    return rootRoute
  }

  // 🔐 auth check
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { path: '/landing' }
  }

  return true
})

export default router