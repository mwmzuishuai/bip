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
    icon: 'i-ant-design:AppstoreOutlined',
    auth: ['sys'],
  },
  children: [
    {
      path: 'role',
      name: 'role',
      component: () => import('@/views/system/role.vue'),
      meta: {
        title: '角色管理',
        icon: 'tdesign:accessibility',
        auth: ['sys:role:view'],
      },
    },
    {
      path: 'menu',
      name: 'menu',
      component: () => import('@/views/system/menu.vue'),
      meta: {
        title: '菜单管理',
        icon: 'material-symbols:format-list-bulleted',
        auth: ['sys:menu:view'],
      },
    },
    {
      path: 'dept',
      name: 'dept',
      component: () => import('@/views/system/dept.vue'),
      meta: {
        title: '部门管理',
        icon: 'prime:flag',
        auth: ['sys:dept:view'],
      },
    },
    {
      path: 'user',
      name: 'user',
      component: () => import('@/views/system/user.vue'),
      meta: {
        title: '用户管理',
        icon: 'material-symbols:manage-accounts-outline-rounded',
        auth: ['sys:user:view'],
      },
    },
  ],
}

export default routes
