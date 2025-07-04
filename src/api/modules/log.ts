import api from '../index'
export default {
  //获取操作日志列表
  getOperateList:(data:any)=>api.get('/log/operate',{params:{...data}})
  //
}
