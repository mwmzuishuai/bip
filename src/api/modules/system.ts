import { number } from 'zod'
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
}
