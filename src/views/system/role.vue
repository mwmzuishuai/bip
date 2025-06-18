<script setup>
import { ref } from 'vue'

const columns = ref([
  {
    type: 'selection',
    width: '50',
    align: 'center',
  },
  {
    prop: 'name',
    label: '角色名称',
    width: '180',
    align: 'center',
  },
  {
    prop: 'ID',
    label: '角色ID',
    width: '180',
    align: 'center',
  },
  {
    prop: 'status',
    label: '状态',
    width: '100',
    align: 'center',
    render: true,
  },
  {
    prop: 'address',
    label: '地址',
    align: 'center',
  },
])
const dataList = ref([
  {
    name: '2016-05-02',
    ID: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄',
    status: 0,
  },
])
const search = ref({
  name: '',
  department_id: '',
  department_job_id: '',
  role_id: '',
  check1: true,
  check2: false,
})
const pagination = ref({
  page: 1,
  pageSizes: [10, 20, 30, 40],
})
function handleSelectionChange(val) {
  console.log(val)
}
function handleSizeChange(val) {
  console.log(`每页 ${val} 条`)
}
function handleEdit(row) {
  console.log(row)
}
function handleDelete(row) {
  console.log(row)
}
</script>

<template>
  <div class="absolute-container">
    <!-- 筛选条件 -->
    <FaPageMain class="mb-0">
      <FaSearchBar>
        <template #default="{ fold }">
          <ElForm :model="search" size="default" label-width="120px">
            <ElRow>
              <ElCol :span="12">
                <ElFormItem label="角色名称">
                  <ElInput v-model="search.name" placeholder="请输入" clearable />
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow v-show="!fold">
              <ElCol :span="6">
                <ElFormItem label="状态">
                  <ElSelect v-model="search.department_id" clearable placeholder="请选择">
                    <ElOption label="已禁用" :value="1" />
                    <ElOption label="已启动" :value="2" />
                  </ElSelect>
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="备注">
                  <ElInput v-model="search.name" placeholder="请输入" clearable />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="角色ID">
                  <ElInput v-model="search.name" placeholder="请输入" clearable />
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElCol :span="20" />
              <ElFormItem>
                <ElButton type="primary">
                  <template #icon>
                    <FaIcon name="i-ep:search" />
                  </template>
                  搜索
                </ElButton>
                <ElButton>重置</ElButton>
              </ElFormItem>
            </ElRow>
          </ElForm>
        </template>
      </FaSearchBar>
    </FaPageMain>
    <!-- 表格 -->
    <FaPageMain class="flex-1 overflow-auto" main-class="flex-1 flex flex-col overflow-auto">
      <DataTable :columns="columns" :data-list="dataList" :operate="true" :pagination="pagination" @edit="handleEdit"
        @delete="handleDelete" @current-change="handleSelectionChange" @size-change="handleSizeChange">
        <template #status="{ date }">
          <!-- {{ date }} -->
          <ElSwitch v-model="date.status" inline-prompt active-text="已启动" inactive-text="已禁止" size="large" style="

  --el-switch-on-color: #1b9cfc; --el-switch-off-color: #ff4949;" />
        </template>
      </DataTable>
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
