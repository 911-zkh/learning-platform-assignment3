import { createRouter, createWebHistory } from 'vue-router'
import LearningPlatform from '../views/LearningPlatform.vue'

const routes = [
  {
    path: '/',
    redirect: '/assignment3'
  },
  {
    path: '/assignment3',
    name: 'LearningPlatform',
    component: LearningPlatform
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
