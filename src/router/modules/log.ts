import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/log',
  component: Layout,
  name: 'log',
  meta: {
    title: '日志管理',
    icon: 'i-ep:Tickets',
    // auth: ['log'],
  },
  children: [
    {
      path: 'operate',
      name: 'operate',
      component: () => import('@/views/log/operate.vue'),
      meta: {
        title: '操作日志',
        icon: 'i-ant-design:FileSearchOutlined ',
        // auth: ['sys:role:view'],
      },
    },
  ],
}

export default routes
