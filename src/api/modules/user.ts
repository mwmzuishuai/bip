import api from '../index'

export default {
  // 登录
  login: (data: any) => api.post('/auth/login', data),
  // 登出
  logout: () => api.post('/auth/logout'),
  // 获取权限
  permission: () => api.get('/sys/permissions'),
  // permission: () => api.get('user/permission', {
  //   baseURL: '/mock/',
  // }),
  // 验证码
  getCaptcha: () => api.get('/auth/captcha'),
  // 获取个人用户信息
  getInfo: () => api.get('/sys/users/current'),
  // 获取公司列表
  getCompanyList: () => api.get('/sys/users/current/tenants'),
  // 修改密码
  passwordEdit: (data: {
    password: string
    newPassword: string
  }) => api.post('user/password/edit', data, {
    baseURL: '/mock/',
  }),
}
