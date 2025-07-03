<route lang="yaml">
meta:
  title: 角色管理
</route>

<script setup>
import { ElMessageBox } from 'element-plus'
import { nextTick, ref } from 'vue'
import { toast } from 'vue-sonner'
import api from '@/api/modules/system'
import useStystemStore from '@/store/modules/system'
import useAuth from '@/utils/composables/useAuth'

const addFormRef = ref(null)
const { auth } = useAuth()
const operate = ref({})
const stystemStore = useStystemStore()
const { menusTree } = storeToRefs(stystemStore)

const roleTitle = ref('添加角色')
const formRole = ref({
  page: 1,
  size: 10,
})
const treeRef = ref(null)
const patchForm = ref({})
const roleDrawerKey = ref(false)
// 父子联动
const treeKey = ref(true)
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
    prop: 'is_active',
    label: '状态',
    width: '100',
    align: 'center',
    render: true,
  },
  {
    prop: 'remark',
    label: '备注',
    align: 'center',
  },
])
const dataList = ref([])
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
const selectedMenuIds = ref([])
const options = [{
  label: '父子联动',
  value: false,
}, {
  label: '非父子联动',
  value: true,
}]

function handleSizeChange(val) {
  formRole.value.size = val
  getRolelist()
}

async function handleEdit(row) {
  const res = await api.getRoleInfo(row.id)
  patchForm.value = { ...row }
  selectedMenuIds.value = res.data.menu_ids
  roleDrawerKey.value = true
  roleTitle.value = '编辑角色'
  await nextTick()
  if (treeRef.value) {
    console.log(selectedMenuIds.value)

    treeRef.value.setCheckedKeys(selectedMenuIds.value)
  }
}

function handleDelete(row) {
  console.log(row)
}
const addRules = reactive({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value.includes(' ')) {
          callback(new Error('菜单名称不能含有空白字符'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  is_active: [
    { required: true, message: '请输入权限标识', trigger: 'blur' },
  ],
})
// 状态切换
async function handleSwitchChange(res) {
  const is_key = res.is_active

  api.patchRoleInfo(res.id, { is_active: res.is_active }).then(() => {
    toast.success('修改成功')
    roleDrawerKey.value = false
    getRolelist()
  }).catch(() => {
    res.is_active = !is_key
  })
}
function handleBeforeSwitchChange() {
  return new Promise((resolve) => {
    ElMessageBox.confirm('是否确定修改该状态?', '修改状态', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'error',
    }).then(() => {
      return resolve(true)
    })
  })
}
function handleCurrentChange(val) {
  formRole.value.page = val
  getRolelist()
}
// 新增角色
function addRole() {
  roleTitle.value = '添加角色'
  roleDrawerKey.value = true
  patchForm.value = {}
}
// 获取角色列表
function getRolelist() {
  api.getRolelist(formRole.value).then((res) => {
    dataList.value = res.data.items
    pagination.value.total = res.data.total
  })
}

// 保存角色权限
async function saveRolePermissions(formEl) {
  if (!formEl) { return }
  await formEl.validate((valid) => {
    if (valid) {
      if (roleTitle.value === '编辑角色') {
        api.patchRoleInfo(patchForm.value.id, {
          ...patchForm.value,
          menu_ids: [...treeRef.value.getHalfCheckedKeys(), ...treeRef.value.getCheckedKeys()],
        }).then(() => {
          roleDrawerKey.value = false
          toast.success('保存成功')
          getRolelist()
        })
      }
      else {
        api.postRoleInfo({
          ...patchForm.value,
          menu_ids: [...treeRef.value.getHalfCheckedKeys(), ...treeRef.value.getCheckedKeys()],
        }).then(() => {
          toast.success('保存成功')
        })
      }
    }
  })
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
          <ElForm :model="formRole" size="default" label-width="120px" @keyup.enter="getRolelist">
            <ElRow>
              <ElCol :span="12">
                <ElFormItem label="角色名称">
                  <ElInput v-model="formRole.name" placeholder="请输入" clearable />
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow v-show="!fold">
              <ElCol :span="6">
                <ElFormItem label="状态">
                  <ElSelect v-model="formRole.is_active" clearable placeholder="请选择">
                    <ElOption label="已禁用" :value="false" />
                    <ElOption label="已启动" :value="true" />
                  </ElSelect>
                </ElFormItem>
              </ElCol>
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
                <ElButton @click="search = { check1: true, check2: false }; getRolelist()">
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
        :columns="columns" :data-list="dataList" :operate="operate" :pagination="pagination" @edit="handleEdit"
        @delete="handleDelete" @current-change="handleCurrentChange" @size-change="handleSizeChange"
      >
        <template #is_active="{ date }">
          <ElSwitch
            v-model="date.is_active" inline-prompt active-text="已启动" inactive-text="已禁止" size="large"
            class="switch-container" :before-change="handleBeforeSwitchChange" @change="handleSwitchChange(date)"
          />
        </template>
      </DataTable>
    </FaPageMain>

    <!-- 角色编辑抽屉 -->
    <ElDrawer v-model="roleDrawerKey" :title="roleTitle" size="50%">
      <div class="drawer-content">
        <ElForm ref="addFormRef" :model="patchForm" size="default" label-width="120px" :rules="addRules">
          <ElRow>
            <ElCol :span="12">
              <ElFormItem label="角色名称" prop="name">
                <ElInput v-model="patchForm.name" placeholder="请输入" clearable />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="状态" prop="is_active">
                <ElRadioGroup v-model="patchForm.is_active" clearable placeholder="请选择">
                  <ElRadio :value="true">
                    启用
                  </ElRadio>
                  <ElRadio :value="false">
                    禁止
                  </ElRadio>
                </ElRadioGroup>
              </ElFormItem>
            </ElCol>
          </ElRow>
          <ElRow>
            <ElCol :span="24">
              <ElFormItem label="备注">
                <ElInput v-model="patchForm.remark" type="textarea" resize="none" placeholder="请输入内容" />
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElForm>
        <div style="margin-top: 10px;margin-bottom: 10px;">
          <ElSegmented v-model="treeKey" :options="options" size="large" />
        </div>
        <ElTree ref="treeRef" show-checkbox :data="menusTree" node-key="id" :check-strictly="treeKey" />
        <div class="action-buttons">
          <ElButton type="primary" @click="saveRolePermissions(addFormRef)">
            保存
          </ElButton>
          <ElButton @click="roleDrawerKey = false">
            取消
          </ElButton>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>

<style scoped lang="scss">
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
