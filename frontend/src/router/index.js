import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView.vue')
    },
    {
      path: '/overview',
      name: 'overview',
      alias: '/',
      component: () => import('../views/OverviewView.vue')
    },
    {
      path: '/manual',
      name: 'manual',
      component: () => import('../views/ManualView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    },
    {
      path: '/devices',
      name: 'devices',
      component: () => import('../views/DevicesView.vue')
    },
  ]
})

export default router
