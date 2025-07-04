<script setup>
import useStystemStore from '@/store/modules/system'
import api from '@/api/modules/system'
import { ElMessageBox } from 'element-plus'
import { ElCol, ElRow } from 'element-plus'
const stystemStore = useStystemStore()
import { toast } from 'vue-sonner'
const { depts, deptsTreeTvalue } = storeToRefs(stystemStore)
const { getDepts } = stystemStore
const deptForm = ref({
})
const deptFormRef = ref(null)
const drawerKey = ref(false)
const DrawerTitle = ref('新建部门')
const columns = ref([
  {
    prop: 'name',
    label: '部门名称',
    width: '400',
    align: 'center',
  },
  {
    prop: 'leader',
    label: '负责人',
    width: '200',
    align: 'center',
  },
  {
    prop: 'phone',
    label: '联系电话',
    width: '200',
    align: 'center'
  },
  {
    prop: 'create_time',
    label: '创建时间',
    align: 'center',
  },
])
const rules = reactive({
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
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
  leader: [
    { required: true, message: '请输入负责人', trigger: 'blur' },
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
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const phoneReg = /^1[3-9]\d{9}$/
        if (!phoneReg.test(value)) {
          callback(new Error('请输入正确的手机号'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})
// 展开折叠
const defaultExpandAll = ref(true)
function defaultset() {
  defaultExpandAll.value = !defaultExpandAll.value
}
// 新建菜单
function addDept() {
  drawerKey.value = true
  DrawerTitle.value = '新增部门'
  deptForm.value = {

  }
}
//编辑菜单
function handleEdit(row) {
  drawerKey.value = true
  DrawerTitle.value = '编辑部门'
  deptForm.value = row
}
//删除部门
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm('是否确认删除?', '删除用户', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'error',
    })
    const id = row.id

    // 等待删除操作完成
    await api.deleteDept(id)

    // 显示成功提示
    toast.success('删除成功')

    // 刷新用户列表
    await getDepts()
  }
  catch (error) {
    // 错误处理（用户取消删除或API请求失败）
    if (error !== 'cancel' && error !== 'close') {
      toast.error('删除失败')
    }
  }
}
function search() {
}

//保存
async function saveDeptPermissions(formEl) {
  if (!formEl) { return }
  await formEl.validate((valid) => {
    if (valid) {
      if (DrawerTitle.value === '新增部门') {
        api.addDept(deptForm.value).then(() => {
          toast.success('新增成功')
          drawerKey.value = false
          getDepts()
        })
      } else {
        api.patchDept(deptForm.value.id, { ...deptForm.value }).then(() => {
          toast.success('编辑成功')
          drawerKey.value = false
          getDepts()
        })
      }
    }
  })
}
</script>

<template>
  <div class="absolute-container">
    <FaPageMain class="mb-0">
      <FaSearchBar :show-toggle="false">
        <template #default>
          <ElForm v-model="deptForm" size="default" label-width="120px" @keyup.enter="search">
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
                <ElButton type="primary" @click="search">
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
        <ElButton type="primary" @click="addDept">
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
      <DataTable row-key="id" :data-list="depts" :columns="columns" :operate="true"
        :default-expand-all="defaultExpandAll" @edit="handleEdit" @delete="handleDelete">
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
    <ElDrawer v-model="drawerKey" size="40%" :title="DrawerTitle">
      <ElForm :model="deptForm" ref="deptFormRef" :rules="rules" label-width="100px" class="demo-drawer-form">
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="部门名称" prop="name">
              <ElInput v-model="deptForm.name" placeholder="请输入" clearable />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="负责人" prop="leader">
              <ElInput v-model="deptForm.leader" placeholder="请输入" clearable />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="联系电话" prop="phone">
              <ElInput v-model="deptForm.phone" placeholder="请输入" clearable />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="父级部门" prop="parent_id">
              <ElTreeSelect v-model="deptForm.parent_id" placeholder="请选择" :data="deptsTreeTvalue" clearable
                check-strictly />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <div class="action-buttons">
          <ElButton type="primary" @click="saveDeptPermissions(deptFormRef)">
            保存
          </ElButton>
          <ElButton @click="drawerKey = false">
            取消
          </ElButton>
        </div>
      </ElForm>
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
</style>
