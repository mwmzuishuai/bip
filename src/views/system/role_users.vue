<route lang="yaml">
meta:
title: 角色用户管理
</route>

<script setup>
import { ElMessageBox } from 'element-plus'
import {  ref } from 'vue'
import { toast } from 'vue-sonner'
import api from '@/api/modules/system'
import useAuth from '@/utils/composables/useAuth'
import  {useRoute} from 'vue-router'
const route = useRoute()
const addFormRef = ref(null)
const { auth } = useAuth()
const loading = ref(false)
const loadingusers = ref(false)
const roleTitle = ref('添加角色')
const formRoleUsers = ref({
  page: 1,
  size: 10,
})
const formUsers = ref({
  page:1,
  size:10
})
const patchForm = ref({})
const roleUsersDrawerKey = ref(false)
const columns = ref([
  {
    prop: 'username',
    label: '用户名称',
    width: '180',
    align: 'center',
  },
  {
    prop: 'nickname',
    label: '昵称',
    align: 'center',
  },
  {
    prop: 'email',
    label: '邮箱',
    width: '100',
    align: 'center',
  },
  {
    prop: 'phone',
    label: '手机号',
    width: '100',
    align: 'center',
  },
  {
    prop: 'is_active',
    label: '状态',
    width: '100',
    align: 'center',
    render: true,
  },
  {
    prop:'cz',
    label: '操作',
    align: 'center',
    fixed: 'right',
    width: '200',
    render: true,
  },
])
const dataList = ref([])
const dataListusers = ref([])
const search = ref({
  name: '',
  department_id: '',
  department_job_id: '',
  role_id: '',
  check1: true,
  check2: false,
})
const pagination = ref({
  pageSizes: [10, 20, 30, 40],
  total: 0,
})
const paginationusers = ref({
  pageSizes: [10, 20, 30, 40],
  total: 0,
})
function handleSizeChange(val) {
  formRoleUsers.value.size = val
  getRolelist()
}
function handleSizeChangeusers (val) {
  formUsers.value.size = val
}
//添加用户
function addUsers(data) {
  ElMessageBox.confirm('是否确定添加角色?', '添加用户', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const role_id = route.params.role_id
    const user_id = data.id
    api.postRoleUsers(role_id,user_id).then(() => {
      toast.success('添加成功')
      getRolelist()
    })
  })
}
function handleCurrentChange(val) {
  formRoleUsers.value.page = val
  getRolelist()
}
function handleCurrentChangeusers(val) {
  formUsers.value.page = val
}
// 新增角色
function addRole() {
  roleTitle.value = '添加角色'
  roleUsersDrawerKey.value = true
  getUserList()
}
// 获取角色列表
function getRolelist() {
  loading.value = true
  const role_id = route.params.role_id
  api.getRoleUsers(role_id,formRoleUsers.value).then((res) => {
    dataList.value = res.data.items
    pagination.value.total = res.data.total
    loading.value = false
  })
}
async function getUserList() {
  const form = { ...formUsers.value }
  loadingusers.value = true
  await api.getUserList(form).then((res) => {
    dataListusers.value = res.data.items
    paginationusers.value.total = res.data.total
  })
  loadingusers.value = false
}
//取消
function cancelRole(data) {
  ElMessageBox.confirm('是否确定取消?', '取消', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const role_id = route.params.role_id
    const user_id = data.id
      api.deleteRoleUsers(role_id,user_id).then(() => {
        toast.success('删除成功')
        getRolelist()
      })
  })
}

//重置
function resetForm() {
  formRoleUsers.value = {
    page: 1,
    size: 10,
  }
  getRolelist()
}
onMounted(() => {
  getRolelist()
})
</script>

<template>
  <div class="absolute-container">
    <!-- 筛选条件 -->
    <FaPageMain class="mb-0">
      <FaSearchBar>
        <template #default="{ fold }">
          <ElForm :model="formRoleUsers" label-width="120px" size="default" @keyup.enter="getRolelist">
            <ElRow>
              <ElCol :span="6">
                <ElFormItem label="用户名称">
                  <ElInput v-model="formRoleUsers.username" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="手机号码">
                  <ElInput v-model="formRoleUsers.phone" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
            </ElRow>

            <ElRow v-show="!fold">

            </ElRow>
            <ElRow>
              <ElCol :span="20" />
              <ElFormItem>
                <ElButton type="primary" @click="getRolelist">
                  <template #icon>
                    <FaIcon name="i-ep:search" />
                  </template>
                  搜索
                </ElButton>
                <ElButton @click="resetForm()">
                  重置
                </ElButton>
              </ElFormItem>
            </ElRow>
          </ElForm>
        </template>
      </FaSearchBar>
    </FaPageMain>

    <!-- 表格 -->
    <FaPageMain class="flex-1 overflow-auto" main-class="flex-1 flex flex-col overflow-auto">
      <div class="m-b-4 flex">
        <ElButton type="primary" @click="addRole()">
          <template #icon>
            <FaIcon name="i-ep:plus" />
          </template>
          新增
        </ElButton>
      </div>
      <DataTable
        :columns="columns" :data-list="dataList" :loading="loading"  :pagination="pagination"
         @current-change="handleCurrentChange" @size-change="handleSizeChange"
      >
        <template #is_active="{ date }">
          <!-- {{ date }} -->
          <ElTag v-if="date.is_active" type="success">
            正常
          </ElTag>
          <ElTag v-else type="danger">
            禁用
          </ElTag>
        </template>
        <template #cz="{ date }">
          <ElTooltip content="取消">
            <ElButton circle type="primary" @click="cancelRole(date)">
              <template #icon>
                <FaIcon name="i-ep:CloseBold" />
              </template>
            </ElButton>
          </ElTooltip>
        </template>
      </DataTable>
    </FaPageMain>

    <!-- 角色编辑抽屉 -->
    <ElDrawer v-model="roleUsersDrawerKey" :title="roleTitle" size="50%">
      <div class="drawer-content">
        <ElForm ref="addFormRef" :model="patchForm"  label-width="120px" size="default">
          <ElRow>
            <ElCol :span="12">
              <ElFormItem label="角色名称" prop="name">
                <ElInput v-model="patchForm.username" clearable placeholder="请输入" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="手机号码" prop="phone">
                <ElInput v-model="patchForm.phone" clearable placeholder="请输入" />
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElForm>
        <DataTable
           :columns="columns" :data-list="dataListusers" :loading="loadingusers"
          :pagination="paginationusers"
          @current-change="handleCurrentChangeusers" @size-change="handleSizeChangeusers"
        >
          <template #is_active="{ date }">
            <!-- {{ date }} -->
            <ElTag v-if="date.is_active" type="success">
              正常
            </ElTag>
            <ElTag v-else type="danger">
              禁用
            </ElTag>
          </template>
          <template #cz="{ date }">
            <ElTooltip content="添加">
              <ElButton circle type="success" @click="addUsers(date)">
                <template #icon>
                  <FaIcon name="i-ep:plus" />
                </template>
              </ElButton>
            </ElTooltip>
          </template>
        </DataTable>
<!--        <div class="action-buttons">-->
<!--          <ElButton type="primary" @click="saveRolePermissions(addFormRef)">-->
<!--            保存-->
<!--          </ElButton>-->
<!--          <ElButton @click="roleUsersDrawerKey = false">-->
<!--            取消-->
<!--          </ElButton>-->
<!--        </div>-->
      </div>
    </ElDrawer>
  </div>
</template>

<style lang="scss" scoped>
.absolute-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 20px;
}

.menu-section {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: 20px;
  overflow: hidden;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 5%);

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: #f8fafc;
    border-bottom: 1px solid #eee;

    span {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
  }
}

.switch-container {
  --el-switch-on-color: #1b9cfc;
  --el-switch-off-color: #ff4949;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  padding: 20px 0;
  margin-top: 20px;
  border-top: 1px solid #eee;

  .el-button {
    min-width: 100px;
    margin-left: 12px;
  }
}

:deep(.el-table) {
  .el-table__row {
    .el-table__expand-icon {
      margin-right: 8px;
    }

    .el-table__cell {
      padding: 12px 0;
    }
  }
}

:deep(.el-tree) {
  .el-tree-node__content {
    height: 40px;
  }
}
</style>
