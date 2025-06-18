import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/system',
  component: Layout,
  name: 'system',
  meta: {
    title: '系统管理',
    icon: 'i-heroicons-solid:menu-alt-3',
  },
  children: [
    {
      path: 'role',
      name: 'role',
      component: () => import('@/views/system/role.vue'),
      meta: {
        title: '角色管理',
      },
    },
    {
      path: 'menu',
      name: 'menu',
      component: () => import('@/views/system/menu.vue'),
      meta: {
        title: '菜单管理',
      },
    },
    {
      path: 'dept',
      name: 'dept',
      component: () => import('@/views/system/dept.vue'),
      meta: {
        title: '部门管理',
      },
    },
    {
      path: 'user',
      name: 'user',
      component: () => import('@/views/system/user.vue'),
      meta: {
        title: '用户管理',
      },
    },
  ],
}

export default routes
