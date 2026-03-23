import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/landing' },
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
  {
    path: '/app',
    component: () => import('@/views/TabsView.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/app/home' },
      { path: 'home', component: () => import('@/views/HomeView.vue') },
      { path: 'signals', component: () => import('@/views/SignalsView.vue') },
      { path: 'watchlist', component: () => import('@/views/WatchlistView.vue') },
      { path: 'portfolio', component: () => import('@/views/PortfolioView.vue') },
      { path: 'market', component: () => import('@/views/MarketView.vue') }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) next('/landing')
  else next()
})

export default router