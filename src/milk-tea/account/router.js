// src/milk-tea/account/router.js

import Login from './views/LoginView.vue'
import Register from './views/RegisterView.vue'
import Profile from './views/ProfileView.vue'
import ForgotPassword from './views/ForgotPassword.vue'
import ResetPassword from './views/ResetPassword.vue'; 

export default [
  { path: '/login',    name: 'login',    component: Login,    meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: Register, meta: { guestOnly: true } },
  { path: '/forgot-password',name: 'ForgotPassword',component:ForgotPassword},
  { path: '/reset-password', name: 'ResetPassword',component: ResetPassword},  
  { path: '/account/profile', name: 'profile', component: Profile, meta: { authOnly: true } },
]