// src/milk-tea/account/router.js

import Login from "./views/LoginView.vue";
import Register from "./views/RegisterView.vue";
import Profile from "./views/ProfileView.vue";
import ForgotPassword from "./views/ForgotPassword.vue";
import ResetPassword from "./views/ResetPassword.vue";
import ChangePassword from "./views/ChangePassword.vue";
import AddressView from "./views/AddressView.vue";

export default [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  { path: "/reset-password", name: "ResetPassword", component: ResetPassword },
  {
    path: "/account/profile",
    name: "profile",
    component: Profile,
    meta: { authOnly: true },
  },
  {
    path: "/account/change-password",
    name: "changePassword",
    component: ChangePassword,
    meta: { authOnly: true },
  },
  {
    path: "/account/addresses",
    name: "addresses",
    component: AddressView,
    meta: { authOnly: true },
  },
];
