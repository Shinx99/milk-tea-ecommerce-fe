import Login from './views/LoginView.vue'
import Register from './views/RegisterView.vue'
import Profile from './views/ProfileView.vue'

export default [
  { path: '/login',    name: 'login',    component: Login,    meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: Register, meta: { guestOnly: true } },
  { path: '/account/profile', name: 'profile', component: Profile, meta: { authOnly: true } },
]
