import api from '../index'

export default {
  getUserList: (data: any) => api.get('/sys/users', { params: { ...data } }),
  // patchUser: (id: number, data: any) => api.patch(`/sys/user/${id}`, data),
  // 获取用户信息
  getUserInfo: (id: number) => api.get(`/sys/users/${id}`),
  // 更新用户信息
  patchUserInfo: (id: number, data: any) => api.patch(`/sys/users/${id}`, data),
  // 新增用户
  postUserInfo: (data: any) => api.post(`/sys/users`, data),
  // 删除用户
  deleteUser: (id: string) => api.delete(`/sys/users/${id}`),
  // 获取所有部门树架构
  getTreeDepts: () => api.get('/sys/depts'),
  // 获取所有菜单树结构
  routeList: (data: any) => api.get('/sys/menus/tree', { params: { ...data } }),
  // 新增菜单
  addRoute: (data: any) => api.post('/sys/menus', data),
  // 修改菜单
  patchRoute: (id: number, data: any) => api.patch(`/sys/menus/${id}`, data),
  // 删除菜单
  deleteRoute: (id: number) => api.delete(`/sys/menus/${id}`),
  // 获取角色列表
  getRolelist: (data: any) => api.get('/sys/roles', { params: { ...data } }),
  // 修改角色信息
  patchRoleInfo: (id: number, data: any) => api.patch(`/sys/roles/${id}`, data),
  // 新增角色信息
  postRoleInfo: (data: any) => api.post(`/sys/roles`, data),
  // 获取角色信息的详细数据
  getRoleInfo: (id: number) => api.get(`/sys/roles/${id}`),
}
