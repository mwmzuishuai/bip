<script setup>
import { ref } from 'vue'
import api from '@/api/modules/user'

const formUser = ref({
  // name: '',
  // mobile: '',
  // status: '',
  // date: '',
  page: 1,
  size: 10,
})
const pagination = ref({
  pageSizes: [10, 20, 30, 40],
  total: 0,
})
const data = ref([
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
])
const columns = ref([{
  prop: 'username',
  label: '用户名称',
  width: '260',
  align: 'center',
}, {
  prop: 'mobile',
  label: '手机号',
  width: '250',
  align: 'center',
}, {
  prop: 'deptName',
  label: '部门',
  width: '200',
  align: 'center',
}, {
  prop: 'status',
  label: '状态',
  width: '150',
  align: 'center',
  render: true,
}, {
  prop: 'createTime',
  label: '创建时间',
  align: 'center',
}])
const dataList = ref([
])
function getUserList() {
  api.getUserList(formUser.value).then((res) => {
    dataList.value = res.items
    pagination.value.total = res.total
  })
}
function handleCurrentChange(val) {
  formUser.value.page = val
  getUserList()
}
function dalete(val) {
  console.log(val)
}
onMounted(() => {
  getUserList()
})
</script>

<template>
  <div class="absolute-container">
    <FaPageMain class="flex-1 overflow-auto" main-class="flex-1 flex  overflow-auto">
      <div class="trees h-full w[10%]">
        <ElTree
          :data="data" :props="{
            children: 'children',
            label: 'label',
          }"
        />
      </div>
      <FaPageMain class="flex-1 overflow-auto" main-class="flex-1 flex flex-col overflow-auto">
        <FaSearchBar :show-toggle="false">
          <template #default>
            <ElForm :model="formUser" size="default" label-width="120px">
              <ElRow>
                <ElCol :span="6">
                  <ElFormItem label="角色名称">
                    <ElInput v-model="formUser.name" placeholder="请输入" clearable />
                  </ElFormItem>
                </ElCol>
                <ElCol :span="6">
                  <ElFormItem label="手机号">
                    <ElInput v-model="formUser.mobile" placeholder="请输入" clearable />
                  </ElFormItem>
                </ElCol>
                <ElCol :span="6">
                  <ElFormItem label="状态">
                    <ElSelect v-model="formUser.status" clearable placeholder="请选择">
                      <ElOption label="已禁用" :value="1" />
                      <ElOption label="已启动" :value="2" />
                    </ElSelect>
                  </ElFormItem>
                </ElCol>
                <ElCol :span="6">
                  <ElFormItem label="创建日期">
                    <el-date-picker
                      v-model="formUser.date" type="daterange" range-separator="-"
                      start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" placeholder="选择日期范围"
                    />
                  </ElFormItem>
                </ElCol>
              </ElRow>
              <ElRow>
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
        <div class="m-b-4 flex">
          <ElButton type="primary">
            <template #icon>
              <FaIcon name="i-ep:plus" />
            </template>
            新增
          </ElButton>
          <ElButton type="success">
            <template #icon>
              <FaIcon name="i-ep:Edit" />
            </template>
            修改
          </ElButton>
          <ElButton type="danger">
            <template #icon>
              <FaIcon name="i-ep:Delete" />
            </template>
            删除
          </ElButton>
        </div>
        <div class="flex-1 overflow-auto" main-class="flex-1 flex  overflow-auto">
          <DataTable
            :columns="columns" :data-list="dataList" :operate="true" :pagination="pagination"
            @edit="handleEdit" @delete="dalete" @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          >
            <template #status="{ date }">
              <!-- {{ date }} -->
              <ElSwitch
                v-model="date.status" inline-prompt active-text="已启动" inactive-text="已禁止" size="large" style="

  --el-switch-on-color: #1b9cfc; --el-switch-off-color: #ff4949;"
              />
            </template>
          </DataTable>
        </div>
      </FaPageMain>
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

.trees {
  height: 100%;
  border-right: 1px solid #dfe4ea;
}
</style>
