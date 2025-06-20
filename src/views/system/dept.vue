<script setup>
const deptForm = ref({
  deptName: '',
  status: '',
})
const dataList = ref([
  {
    id: 3,
    date: '2016-05-01',
    deptName: 'wangxiaohu',
    sort: 'sort',
    status: 1,
    createTime: '2016-05-01',
    children: [
      {
        id: 31,
        date: '2016-05-01',
        deptName: 'wangxiaohu',
        sort: 'sort',
        status: 1,
        createTime: '2016-05-01',
      },
      {
        id: 32,
        date: '2016-05-01',
        deptName: 'wangxiaohu',
        sort: 'sort',
        status: 0,
        createTime: '2016-05-01',
      },
    ],
  },
])
const columns = ref([
  {
    prop: 'deptName',
    label: '部门名称',
    width: '400',
    align: 'center',
  },
  {
    prop: 'sort',
    label: '排序',
    width: '300',
    align: 'center',
  },
  {
    prop: 'status',
    label: '状态',
    width: '200',
    align: 'center',
    render: true,
  },
  {
    prop: 'createTime',
    label: '创建时间',
    align: 'center',
  },
])
// 展开折叠
const defaultExpandAll = ref(true)
function defaultset() {
  defaultExpandAll.value = !defaultExpandAll.value
}
// 新建菜单
const deptkey = ref(false)
</script>

<template>
  <div class="absolute-container">
    <FaPageMain class="mb-0">
      <FaSearchBar :show-toggle="false">
        <template #default>
          <ElForm v-model="deptForm" size="default" label-width="120px">
            <ElRow>
              <ElCol :span="6">
                <ElFormItem label="部门名称" prop="deptName">
                  <ElInput v-model="deptForm.deptName" placeholder="请输入" clearable />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="状态" prop="status">
                  <ElSelect v-model="deptForm.status" clearable placeholder="请选择">
                    <ElOption label="正常" :value="1" />
                    <ElOption label="停用" :value="2" />
                  </ElSelect>
                </ElFormItem>
              </ElCol>
              <ElCol :span="8" />
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
    <FaPageMain class="flex-1 overflow-auto" main-class="flex-1 flex flex-col overflow-auto">
      <div class="m-b-4 flex">
        <ElButton type="primary" @click="deptkey = true">
          <template #icon>
            <FaIcon name="i-ep:plus" />
          </template>
          新增
        </ElButton>
        <ElButton @click="defaultset">
          <template #icon>
            <FaIcon name="i-ep:Sort" />
          </template>
          展开折叠
        </ElButton>
      </div>
      <DataTable
        row-key="id" :data-list="dataList" :columns="columns" :operate="true"
        :default-expand-all="defaultExpandAll"
      >
        <template #status="{ date }">
          <!-- {{ date }} -->
          <ElTag v-if="date.status === 1" type="success">
            正常
          </ElTag>
          <ElTag v-else type="danger">
            禁用
          </ElTag>
        </template>
        <template #icon="{ date }">
          <FaIcon :name="`i-ep:${date.icon}`" />
        </template>
      </DataTable>
    </FaPageMain>
  </div>
</template>

<style scoped>
.absolute-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
