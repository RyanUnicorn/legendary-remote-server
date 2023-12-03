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
      path: '/devices/:id',
      name: 'devicesID',
      component: () => import('../views/DevicesView.vue')
    },
    {
      path: '/blockly/:id',
      name: 'blockly',
      component: () => import('../views/BlocklyView.vue')
    },
  ]
})

export default router
