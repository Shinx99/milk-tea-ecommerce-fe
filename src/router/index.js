import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/milk-tea/home/views/Home.vue'
import accountRoutes from '@/milk-tea/account/router'
import { authState } from '@/milk-tea/account/store'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  ...accountRoutes,
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  const isLoggedIn = !!authState.currentUser
  if (to.meta?.guestOnly && isLoggedIn)   return { path: '/home' }
  if (to.meta?.authOnly && !isLoggedIn)   return { path: '/login', query: { redirect: to.fullPath } }
})

export default router
