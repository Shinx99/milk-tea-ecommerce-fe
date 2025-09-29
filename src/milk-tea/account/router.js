import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Profile from './views/Profile.vue'

export default [
  { path: '/login',    name: 'login',    component: Login,    meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: Register, meta: { guestOnly: true } },
  { path: '/account/profile', name: 'profile', component: Profile, meta: { authOnly: true } },
]
