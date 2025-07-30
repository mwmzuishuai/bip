import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}
const routes: RouteRecordRaw = {
  path: '/tenant',
  component: Layout,
  name: 'tenant',
  meta: {
    title: '租户配置',
    icon: 'i-ant-design:TeamOutlined',
  },
  children: [
    {
      path: 'manage',
      name: 'manage',
      component: () => import('@/views/tenant/manage.vue'),
      meta: {
        title: '租户管理',
        icon: 'i-ant-design:UserSwitchOutlined',

      },
    },
    {
      path: 'menu',
      name: 'menu',
      component: () => import('@/views/tenant/menu.vue'),
      meta: {
        title: '菜单管理',
        icon: 'i-ant-design:MenuOutlined',
      },
    },
  ],
}
export default routes
