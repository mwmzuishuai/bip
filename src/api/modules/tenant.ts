import api from '../index'
export default {
  //获取租户列表
  getTenantList: (data: any) => api.get('/tenant/tenants', { params: data }),
  //新增租户
  addTenant: (data: any) => api.post('/tenant/tenants', data),
  //获取租户详情
  getTenantDetail: (id: any) => api.get(`/tenant/tenants/${id}`),
  //修改租户信息
  patchTenant: (id: any, data: any) => api.patch(`/tenant/tenants/${id}`, data),
  //删除租户
  deleteTenant: (id: any) => api.delete(`/tenant/tenants/${id}`),
  //获取套餐列表
  getPackageList: (data:any) => api.get('/tenant/packages',{params: data}),
  //获取套餐详情
  getPackageDetail: (id: any) => api.get(`/tenant/packages/${id}`),
  //修改套餐信息
  patchPackage: (id: any, data: any) => api.patch(`/tenant/packages/${id}`, data),
  //新增套餐
  addPackage: (data: any) => api.post('/tenant/packages', data),
  //删除套餐
  deletePackage: (id: any) => api.delete(`/tenant/packages/${id}`),
}
