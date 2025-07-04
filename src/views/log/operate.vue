<script setup>
// 表格相关
const formOperate = ref({
  page: 1,
  size: 10,
})
const dataList = ref([])
const loading = ref(false)
const pagination = ref({
  pageSizes: [10, 20, 30, 40],
  total: 0,
})
const columns = ref([
  {
    prop: 'username',
    label: '用户名称',
    width: '260',
    align: 'center',
  },
  {
    prop: 'method',
    label: '请求类型',
    width: '100',
    align: 'center',
  },
  {
    prop: 'title',
    label: '操作模块',
    width: '160',
    align: 'center',
  },
  {
    prop: 'path',
    label: '请求路径',
    width: '100',
    align: 'center',
  },
  {
    prop: 'ip',
    label: 'IP地址',
    width: '260',
    align: 'center',
  },
  {
    prop: 'dateTime',
    label: '操作时间',
    width: '260',
    align: 'center',
  },
  {
    prop: 'country',
    label: '国家',
    width: '160',
    align: 'center',
  },
  {
    prop: 'status',
    label: '操作状态',
    width: '260',
    align: 'center',
  },
  {
    prop: 'code',
    label: '状态码',
    width: '260',
    align: 'center',
  },
  {
    prop: 'cost_time',
    label: '请求耗时',
    width: '160',
    align: 'center',
  },
  {
    prop: 'create_time',
    label: '操作时间',
    width: '260',
    align: 'center',
  },
  {
    prop: 'is_delete',
    label: '是否删除',
    width: '100',
    align: 'center',
  },
])

function handleCurrentChange(val) {
  formOperate.value.page = val
}
function handleSizeChange(val) {
  formOperate.value.size = val
}
//获取操作日志列表
function getOperateList (){
  api.getOperateList(formOperate.value).then(res => {
    dataList.value = res.data
  })
}
//重置
function resetForm (){
  formOperate.value = {
    page: 1,
    size: 10,
  }
  getOperateList()
}
onMounted(() => {
  // getOperateList()
});
</script>

<template>
  <div class="absolute-container">
    <FaPageMain>
      <FaSearchBar :show-toggle="false">
        <template #default>
          <ElForm :model="formOperate" size="default" label-width="120px" @keyup.enter="getOperateList">
            <ElRow>
              <ElCol :span="6">
                <ElFormItem label="用户名称">
                  <ElInput v-model="formOperate.username" placeholder="请输入" clearable />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="操作模块">
                  <ElInput v-model="formOperate.title" placeholder="请输入" clearable />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="状态">
                  <ElInput v-model="formOperate.code" placeholder="请输入" clearable />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="操作日期">
                  <el-date-picker
                    v-model="formOperate.create_time" type="daterange" range-separator="-"
                    start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss"
                    placeholder="选择日期范围"
                  />
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElFormItem>
                <ElButton type="primary" @click="getOperateList">
                  <template #icon>
                    <FaIcon name="i-ep:search" />
                  </template>
                  搜索
                </ElButton>
                <ElButton @click="resetForm">
                  重置
                </ElButton>
              </ElFormItem>
            </ElRow>
          </ElForm>
        </template>
      </FaSearchBar>
    </FaPageMain>
    <FaPageMain class="flex-1 overflow-auto" main-class="flex-1 flex flex-col overflow-auto">
      <DataTable
        :columns="columns" :data-list="dataList" :pagination="pagination" :loading="loading"
        @current-change="handleCurrentChange" @size-change="handleSizeChange"
      />
    </FaPageMain>
  </div>
</template>

<style scoped lang='scss'>
.absolute-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
