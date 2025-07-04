import api from '../index'

export default {
  // 后端获取路由数据
  // routeList: () => api.get('app/route/list', {
  //   baseURL: '/mock/',
  // }),
  routeList: () => api.get('/sys/menus'),
  addRoute: (data: any) => api.post('/sys/menus', data),

  // 基于文件系统路由模式下，后端获取导航菜单数据
  menuList: () => api.get('app/menu/list', {
    baseURL: '/mock/',
  }),
}
