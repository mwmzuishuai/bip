import api from '../index'

export default {
  // 登录
  login: (data: any) => api.post('/auth/login', data),

  // 获取权限
  permission: () => api.get('/sys/permissions'),
  // permission: () => api.get('user/permission', {
  //   baseURL: '/mock/',
  // }),
  // 验证码
  getCaptcha: () => api.get('/auth/captcha'),

  // 修改密码
  passwordEdit: (data: {
    password: string
    newPassword: string
  }) => api.post('user/password/edit', data, {
    baseURL: '/mock/',
  }),
}
