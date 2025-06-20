import { defineFakeRoute } from 'vite-plugin-fake-server/client'

export default defineFakeRoute([
  {
    url: '/mock/app/route/list',
    method: 'get',
    response: () => {
      return {
        error: '',
        status: 1,
        data: [
          {
            meta: {
              title: '主应用',
              icon: 'uim:box',
            },
            children: [
              {
                path: '/system',
                component: 'Layout',
                name: 'system',
                meta: {
                  title: '系统管理',
                  icon: 'heroicons-solid:menu-alt-3',
                },
                children: [
                  {
                    path: 'dept',
                    name: 'dept',
                    component: 'system/dept.vue',
                    meta: {
                      title: '部门管理',
                    },
                  },
                  {
                    path: 'menu',
                    name: 'menu',
                    component: 'system/menu.vue',
                    meta: {
                      title: '菜单管理',
                    },
                  },
                  {
                    path: 'role',
                    name: 'role',
                    component: 'system/role.vue',
                    meta: {
                      title: '角色管理',
                      icon: 'i-ep:edit',
                    },
                  },
                  {
                    path: 'user',
                    name: 'user',
                    component: 'system/user.vue',
                    meta: {
                      title: '用户管理',
                    },
                  },
                ],
              },
            ],
          },
        ],
      }
    },
  },
  {
    url: '/mock/app/menu/list',
    method: 'get',
    response: () => {
      return {
        error: '',
        status: 1,
        data: [
          {
            meta: {
              title: '演示',
              icon: 'uim:box',
            },
            children: [
              {
                meta: {
                  title: '多级导航',
                  icon: 'heroicons-solid:menu-alt-3',
                },
                children: [
                  {
                    path: '/multilevel_menu_example/page',
                    meta: {
                      title: '导航1',
                    },
                  },
                  {
                    meta: {
                      title: '导航2',
                    },
                    children: [
                      {
                        path: '/multilevel_menu_example/level2/page',
                        meta: {
                          title: '导航2-1',
                        },
                      },
                      {
                        meta: {
                          title: '导航2-2',
                        },
                        children: [
                          {
                            path: '/multilevel_menu_example/level2/level3/page1',
                            meta: {
                              title: '导航2-2-1',
                            },
                          },
                          {
                            path: '/multilevel_menu_example/level2/level3/page2',
                            meta: {
                              title: '导航2-2-2',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }
    },
  },
])
