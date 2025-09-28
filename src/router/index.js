import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Hello from '../components/HelloWorld.vue'
//import About from '../components/About.vue'

const routes = [
  {path: '/', component: Hello},
  { path: '/home', component: Home },
  //{ path: '/about', component: About }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
