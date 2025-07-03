<script setup>
import { ElMessageBox } from 'element-plus'
import { toast } from 'vue-sonner'
import api from '@/api/modules/system'
import useStystemStore from '@/store/modules/system'

const stytemStore = useStystemStore()
const { getMenus } = stytemStore
const { menus, menusTree } = storeToRefs(stytemStore)
const loading = ref(false)
const menuTitle = ref('新增菜单')
const formMenu = ref({
})
const columns = ref([
  {
    prop: 'name',
    label: '菜单名称',
    width: '300',
    align: 'center',
  },
  {
    prop: 'type',
    label: '菜单类型',
    width: '100',
    align: 'center',
    render: true,
  },
  {
    prop: 'perms',
    label: '权限标识',
    width: '400',
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
    prop: 'create_time',
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
const menukey = ref(false)
const addFormRef = ref(null)
const addForm = ref({
  parent_id: null, // 初始化 parent_id 为 null
  type: 0,
  perms: '',
  display: true,
})
const addRules = reactive({
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
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
  perms: [
    { required: true, message: '请输入权限标识', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value.includes(' ')) {
          callback(new Error('权限不能含有空白字符'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  component: [
    { required: true, message: '请输入组件', trigger: 'blur' },
  ],
  sort: [
    { required: true, message: '请输入排序', trigger: 'blur' },
    // 如果允许排序值为 0
    { type: 'number', min: 1, message: '排序必须大于0' },
  ],
})
// 保存
async function submitMenuForm(formEl) {
  // eslint-disable-next-line style/max-statements-per-line
  if (!formEl) { return }

  await formEl.validate((valid, fields) => {
    if (valid) {
      if (menuTitle.value === '新增菜单') {
        api.addRoute({ ...addForm.value }).then(() => {
          menukey.value = false
          toast.success('新增成功')
          getMenus()
        })
      }
      else {
        api.patchRoute(addForm.value.id, { ...addForm.value }).then(() => {
          menukey.value = false
          toast.success('修改成功')
          getMenus()
        })
      }
    }
    else {
      console.log(fields)
    }
  })
}
function addMenu() {
  menuTitle.value = '新增菜单'
  menukey.value = true
  addForm.value = {
    title: '',
    parent_id: null, // 初始化 parent_id 为 null
    type: 0,
    perms: '',
    display: true,
  }
}
function handleEdit(row) {
  menuTitle.value = '编辑菜单'
  menukey.value = true

  addForm.value = {
    ...row,
  }
}
// 删除菜单
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm('是否确认删除?', '删除用户', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'error',
    })

    const id = row.id

    // 等待删除操作完成
    await api.deleteRoute(id)

    // 显示成功提示
    toast.success('删除成功')

    // 刷新用户列表
    await getMenus()
  }
  catch (error) {
    // 错误处理（用户取消删除或API请求失败）
    if (error !== 'cancel' && error !== 'close') {
      toast.error('删除失败')
    }
  }
}
function reset() {
  formMenu.value = {
  }
  getMenus()
}
</script>

<template>
  <div class="absolute-container">
    <FaPageMain class="mb-0">
      <FaSearchBar :show-toggle="false">
        <template #default>
          <ElForm :model="formMenu" size="default" label-width="120px" @keyup.enter="getMenus(formMenu)">
            <ElRow>
              <ElCol :span="6">
                <ElFormItem label="菜单名称">
                  <ElInput v-model="formMenu.name" placeholder="请输入" clearable />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="类型">
                  <ElSelect v-model="formMenu.type_id" clearable placeholder="请选择">
                    <ElOption label="目录" :value="0" />
                    <ElOption label="菜单" :value="1" />
                    <ElOption label="按钮" :value="2" />
                  </ElSelect>
                </ElFormItem>
              </ElCol>
              <ElCol :span="8" />
              <ElFormItem>
                <ElButton type="primary" @click="getMenus(formMenu)">
                  <template #icon>
                    <FaIcon name="i-ep:search" />
                  </template>
                  搜索
                </ElButton>
                <ElButton @click="reset">
                  重置
                </ElButton>
              </ElFormItem>
            </ElRow>
          </ElForm>
        </template>
      </FaSearchBar>
    </FaPageMain>

    <FaPageMain class="flex-1 overflow-auto" main-class="flex-1 flex flex-col overflow-auto">
      <div class="m-b-4 flex">
        <ElButton type="primary" @click="addMenu">
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
        row-key="id" :data-list="menus" :columns="columns" :operate="true"
        :default-expand-all="defaultExpandAll" :loading="loading" @edit="handleEdit" @delete="handleDelete"
      >
        <template #status="{ date }">
          <!-- {{ date }} -->
          <ElTag v-if="date.display === true" type="success">
            正常
          </ElTag>
          <ElTag v-else type="danger">
            禁用
          </ElTag>
        </template>
        <template #type="{ date }">
          <ElTag v-if="date.type === 1" type="success">
            菜单
          </ElTag>
          <ElTag v-else-if="date.type === 0" color="#74b9ff" style="color: #0984e3;">
            目录
          </ElTag>
          <ElTag v-else type="warning">
            按钮
          </ElTag>
        </template>
      </DataTable>
    </FaPageMain>
    <ElDialog v-model="menukey" :title="menuTitle" width="800">
      <ElForm ref="addFormRef" :model="addForm" size="default" label-width="120px" :rules="addRules">
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="菜单名称" prop="name">
              <ElInput v-model="addForm.name" placeholder="请输入" clearable />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="父级菜单" prop="parent_id">
              <ElTreeSelect v-model="addForm.parent_id" :data="menusTree" placeholder="请输入" clearable check-strictly />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElFormItem label="菜单类型" prop="type">
            <ElRadioGroup v-model="addForm.type">
              <ElRadio :value="0">
                目录
              </ElRadio>
              <ElRadio :value="1">
                菜单
              </ElRadio>
              <ElRadio :value="2">
                按钮
              </ElRadio>
            </ElRadioGroup>
          </ElFormItem>
        </ElRow>
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="权限标识" prop="perms">
              <ElInput v-model="addForm.perms" placeholder="请输入" clearable />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElFormItem label="菜单状态" prop="display">
            <ElRadioGroup v-model="addForm.display">
              <ElRadio :value="true">
                显示
              </ElRadio>
              <ElRadio :value="false">
                隐藏
              </ElRadio>
            </ElRadioGroup>
          </ElFormItem>
        </ElRow>
        <ElRow>
          <ElFormItem>
            <ElButton type="primary" @click="submitMenuForm(addFormRef)">
              <template #icon>
                <FaIcon name="i-ep:plus" />
              </template>
              提交
            </ElButton>
            <ElButton @click="menukey = false">
              取消
            </ElButton>
          </ElFormItem>
        </ElRow>
      </ElForm>
    </ElDialog>
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
