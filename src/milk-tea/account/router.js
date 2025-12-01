// src/milk-tea/account/router.js

import Login from './views/LoginView.vue'
import Register from './views/RegisterView.vue'
import Profile from './views/ProfileView.vue'
import ForgotPassword from './views/ForgotPassword.vue'
import ResetPassword from './views/ResetPassword.vue'; 
import ChangePassword from './views/ChangePassword.vue';

export default [
  { path: '/login',    name: 'login',    component: Login,    meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: Register },
  { path: '/forgot-password',name: 'ForgotPassword',component:ForgotPassword}, // Mo cho fucntion Them nguoi dung cua Admin -> Register
  { path: '/reset-password', name: 'ResetPassword',component: ResetPassword},  
  { path: '/account/profile', name: 'profile', component: Profile, meta: { authOnly: true } },
  {path: '/account/change-password', name: "changePassword", component: ChangePassword} //Mo cho function change password cua Admin -> ChangePassword
]
