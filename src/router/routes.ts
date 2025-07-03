import type { Route } from '#/global'
import type { RouteRecordRaw } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:meta-layouts'
import useSettingsStore from '@/store/modules/settings'
import Logs from './modules/log'
import MultilevelMenuExample from './modules/system'

// 固定路由（默认路由）
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/:all(.*)*',
    name: 'notFound',
    component: () => import('@/views/[...all].vue'),
    meta: {
      title: '找不到页面',
    },
  },
]

// 系统路由
const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/index.vue'),
    meta: {
      title: () => useSettingsStore().settings.home.title,
      breadcrumb: false,
      // auth: [
      //   'main',
      // ],
    },
    children: [
      {
        path: '',
        component: () => import('@/views/index.vue'),
        meta: {
          title: () => useSettingsStore().settings.home.title,
          icon: 'i-ant-design:home-twotone',
          breadcrumb: false,
        },
      },
      {
        path: 'reload',
        name: 'reload',
        component: () => import('@/views/reload.vue'),
        meta: {
          title: '重新加载',
          breadcrumb: false,
        },
      },
    ],
  },
]

// 动态路由（异步路由、导航栏路由）
const asyncRoutes: Route.recordMainRaw[] = [
  {
    meta: {
      title: '系统',
      icon: 'i-uim:box',
    },
    children: [
      MultilevelMenuExample,
      Logs,
    ],
  },
  // {
  //   meta: {
  //     title: '检测',
  //     icon: 'streamline:industry-innovation-and-infrastructure',
  //   },
  //   children: [
  //     {
  //       path: '/systems',
  //       component: import('@/layouts/index.vue'),
  //       name: 'systems',
  //       meta: {
  //         title: '系统管理',
  //         icon: 'icon-park-twotone:system',
  //       },
  //       children: [
  //         {
  //           path: '',
  //           name: 'users',
  //           component: () => import('@/views/system/user.vue'),
  //           meta: {
  //             title: '用户管理',
  //             icon: 'material-symbols:manage-accounts-outline-rounded',
  //             menu: false,
  //             breadcrumb: false,
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
]

const constantRoutesByFilesystem = generatedRoutes.filter((item) => {
  return item.meta?.enabled !== false && item.meta?.constant === true
})

const asyncRoutesByFilesystem = setupLayouts(generatedRoutes.filter((item) => {
  return item.meta?.enabled !== false && item.meta?.constant !== true && item.meta?.layout !== false
}))

export {
  asyncRoutes,
  asyncRoutesByFilesystem,
  constantRoutes,
  constantRoutesByFilesystem,
  systemRoutes,
}
