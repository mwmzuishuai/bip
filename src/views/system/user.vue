<script setup>
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import api from '@/api/modules/system'
import useStystemStore from '@/store/modules/system'

const stytemStore = useStystemStore()
const { deptsTreeTvalue } = storeToRefs(stytemStore)
const titleDrawer = ref('新增用户')
const addFormRef = ref(null)
const dtawerKey = ref(false)
const deptList = ref([])
const formUser = ref({
  page: 1,
  size: 10,
})
const drwawerForm = ref({
})
const addRules = reactive({
  username: [
    { required: true, message: '请输入用户名称', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value.includes(' ')) {
          callback(new Error('用户名称不能含有空白字符'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
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
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    // 昵称不能含有空白字符
    {
      validator: (rule, value, callback) => {
        if (value.includes(' ')) {
          callback(new Error('昵称不能含有空白字符'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  is_active: [
    { required: true, message: '请选择状态', trigger: 'blur' },
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择性别'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码长度不能小于6位'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        if (value.includes(' ')) {
          callback(new Error('密码不能含有空白字符'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  email: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback()
          return
        }
        const emailReg = /^[\w-]+@[\w-]+(?:\.[\w-]+)+$/
        if (!emailReg.test(value)) {
          callback(new Error('请输入正确的邮箱'))
        }
      },
    },
  ],
})
const loading = ref(false)
const pagination = ref({
  pageSizes: [10, 20, 30, 40],
  total: 0,
})
const columns = ref([
  {
    type: 'selection',
    width: '50',
    align: 'center',
  },
  {
    prop: 'username',
    label: '用户名称',
    width: '260',
    align: 'center',
  },
  {
    prop: 'nickname',
    label: '昵称',
    width: '200',
    align: 'center',
  },
  {
    prop: 'gender',
    label: '性别',
    width: '100',
    align: 'center',
    render: true,
  },
  {
    prop: 'phone',
    label: '手机号',
    width: '250',
    align: 'center',
  },
  {
    prop: 'dept_name',
    label: '部门',
    width: '200',
    align: 'center',
  },
  {
    prop: 'role_names',
    label: '角色',
    width: '200',
    align: 'center',
    render: true,
  },
  {
    prop: 'is_active',
    label: '状态',
    width: '150',
    align: 'center',
    render: true,
  },
  {
    prop: 'create_time',
    label: '创建时间',
    align: 'center',
  },
])
const dataList = ref([
])
async function getUserList() {
  const form = { ...formUser.value }
  if (form.create_time) {
    form.create_time = form.create_time.join(',')
  }
  loading.value = true
  await api.getUserList(form).then((res) => {
    dataList.value = res.data.items
    pagination.value.total = res.data.total
  })
  loading.value = false
}
function handleCurrentChange(val) {
  formUser.value.page = val
  getUserList()
}
// 获取角色列表
const roleList = ref([])
function isgetRolelist() {
  api.getRolelist({ page: 1, size: 200 }).then((res) => {
    roleList.value = res.data.items
  })
}
async function dalete(val) {
  try {
    await ElMessageBox.confirm('是否确认删除?', '删除用户', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'error',
    })

    const id = val ? val.id : delectList.value.join(',')

    // 等待删除操作完成
    await api.deleteUser(id)

    // 显示成功提示
    toast.success('删除成功')

    // 刷新用户列表
    await getUserList()
  }
  catch (error) {
    // 错误处理（用户取消删除或API请求失败）
    if (error !== 'cancel' && error !== 'close') {
      toast.error('删除失败')
    }
  }
}
function handleSizeChange(val) {
  formUser.value.size = val
  getUserList()
}
// 搜索
function searchList() {
  getUserList()
}
// 重置
function reset() {
  formUser.value = {
    page: 1,
    size: 10,
  }
  getUserList()
}
// 编辑
function handleEdit(val) {
  titleDrawer.value = '编辑用户'
  dtawerKey.value = true
  getUserInfos(val.id)
}
// 获取用户信息
function getUserInfos(id) {
  api.getUserInfo(id).then((res) => {
    drwawerForm.value = {
      id: res.data.id,
      username: res.data.username,
      nickname: res.data.nickname,
      gender: res.data.gender,
      email: res.data.email,
      phone: res.data.phone,
      avatar: res.data.avatar,
      is_active: res.data.is_active,
      dept_id: res.data.dept_id,
      role_ids: res.data.role_ids,
    }
  })
}
// 修改用户信息
async function putUserInfos(formEl) {
  if (!formEl) { return }

  await formEl.validate((valid) => {
    if (valid) {
      if (titleDrawer.value === '编辑用户') {
        api.patchUserInfo(drwawerForm.value.id, drwawerForm.value).then(() => {
          toast.success('修改成功')
          dtawerKey.value = false
          getUserList()
        })
      }
      else {
        api.postUserInfo(drwawerForm.value).then(() => {
          toast.success('新增成功')
          dtawerKey.value = false
          getUserList()
        })
      }
    }
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
async function handleSwitchChange(res) {
  const is_key = res.is_active

  api.patchUserInfo(res.id, { is_active: res.is_active }).then(() => {
    toast.success('修改成功')
    dtawerKey.value = false
    getUserList()
  }).catch(() => {
    res.is_active = !is_key
  })
}
// 新增用户
function postUserInfos() {
  dtawerKey.value = true
  titleDrawer.value = '新增用户'
  drwawerForm.value = {

  }
}
// 多选
function handleSelectionChange(val) {
  delectList.value = val.map((item) => {
    return item.id
  })
}
onMounted(() => {
  getUserList()
  isgetRolelist()
})
watch(() => formUser.value, () => {

}, {
  deep: true,
})
</script>

<template>
  <div class="absolute-container">
    <FaPageMain>
      <FaSearchBar :show-toggle="false">
        <template #default>
          <ElForm :model="formUser" label-width="120px" size="default" @keydown.enter="searchList">
            <ElRow>
              <ElCol :span="6">
                <ElFormItem label="用户名称">
                  <ElInput v-model="formUser.username" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="手机号">
                  <ElInput v-model="formUser.phone" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="状态">
                  <ElSelect v-model="formUser.is_active" clearable placeholder="请选择">
                    <ElOption :value="false" label="已禁用" />
                    <ElOption :value="true" label="已启动" />
                  </ElSelect>
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="创建日期">
                  <el-date-picker
                    v-model="formUser.create_time" end-placeholder="结束日期" placeholder="选择日期范围"
                    range-separator="-" start-placeholder="开始日期" type="daterange" value-format="YYYY-MM-DD"
                  />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="部门" prop="parent_id">
                  <ElTreeSelect
                    v-model="formUser.dept_id" :data="deptsTreeTvalue" check-strictly clearable
                    placeholder="请输入"
                  />
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElFormItem>
                <ElButton type="primary" @click="searchList">
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
      <div class="m-[20px] m-b-4 flex">
        <ElButton type="primary" @click="postUserInfos()">
          <template #icon>
            <FaIcon name="i-ep:plus" />
          </template>
          新增
        </ElButton>
        <ElButton type="danger" @click="dalete()">
          <template #icon>
            <FaIcon name="i-ep:Delete" />
          </template>
          删除
        </ElButton>
      </div>
      <DataTable
        :columns="columns" :data-list="dataList" :loading="loading" :operate="true" :pagination="pagination"
        @delete="dalete" @edit="handleEdit" @current-change="handleCurrentChange" @size-change="handleSizeChange"
        @selection-change="handleSelectionChange"
      >
        <template #is_active="{ date }">
          <!-- {{ date }} -->
          <ElSwitch
            v-model="date.is_active" :before-change="handleBeforeSwitchChange" active-text="已启动" class="switch-container" inactive-text="已禁止"
            inline-prompt size="large" @change="handleSwitchChange(date)"
          />
        </template>
        <template #gender="{ date }">
          {{ date.gender === 1 ? '男' : '女' }}
        </template>
        <template #dept_id="{ date }">
          {{ deptList.value?.find((item) => item.id === date.dept_id)?.name }}
        </template>
        <template #role_names="{ date }">
          <div class="flex flex-col justify-center" style=" align-items: center;">
            <el-tag
              v-for="item in date.role_names" :key="item" style=" max-width: 50%;margin: 10px 0;"
              type="success"
            >
              {{ item }}
            </el-tag>
          </div>
        </template>
      </DataTable>
    </FaPageMain>
    <ElDrawer v-model="dtawerKey" :title="titleDrawer" size="40%">
      <FaSearchBar :show-toggle="false">
        <template #default>
          <ElForm ref="addFormRef" :model="drwawerForm" :rules="addRules" label-width="120px" size="default">
            <ElRow>
              <ElCol v-if="titleDrawer === '新增用户'" :span="12">
                <ElFormItem label="用户名称" prop="username">
                  <ElInput v-model="drwawerForm.username" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="12">
                <ElFormItem label="归属部门" prop="dept_id">
                  <ElTreeSelect
                    v-model="drwawerForm.dept_id" :data="deptsTreeTvalue" check-strictly clearable
                    placeholder="请选择"
                  />
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElCol :span="12">
                <ElFormItem label="手机号码" prop="phone">
                  <ElInput v-model="drwawerForm.phone" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="12">
                <ElFormItem label="邮箱" prop="email">
                  <ElInput v-model="drwawerForm.email" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElCol :span="12">
                <ElFormItem label="用户性别" prop="gender">
                  <ElRadioGroup v-model="drwawerForm.gender">
                    <ElRadio :value="1">
                      男
                    </ElRadio>
                    <ElRadio :value="2">
                      女
                    </ElRadio>
                  </ElRadioGroup>
                </ElFormItem>
              </ElCol>
              <ElCol :span="12">
                <ElFormItem label="状态" prop="is_active">
                  <ElRadioGroup v-model="drwawerForm.is_active">
                    <ElRadio :value="true">
                      启用
                    </ElRadio>
                    <ElRadio :value="false">
                      禁用
                    </ElRadio>
                  </ElRadioGroup>
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElCol :span="12">
                <ElFormItem label="角色" prop="role_ids">
                  <ElSelect v-model="drwawerForm.role_ids" clearable filterable multiple placeholder="请选择">
                    <ElOption v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
                  </ElSelect>
                </ElFormItem>
              </ElCol>
              <ElCol :span="12">
                <ElFormItem label="昵称" prop="nickname">
                  <ElInput v-model="drwawerForm.nickname" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElCol v-if="titleDrawer === '新增用户'" :span="12">
                <ElFormItem label="密码" prop="password">
                  <ElInput v-model="drwawerForm.password" clearable placeholder="请输入" type="password" />
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElFormItem>
                <ElButton type="primary" @click="putUserInfos(addFormRef)">
                  确定
                </ElButton>
                <ElButton @click="dtawerKey = false">
                  取消
                </ElButton>
              </ElFormItem>
            </ElRow>
          </ElForm>
        </template>
      </FaSearchBar>
    </ElDrawer>
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

.switch-container {
  --el-switch-on-color: #1b9cfc;
  --el-switch-off-color: #ff4949;
}

.trees {
  height: 100%;
  border-right: 1px solid #dfe4ea;
}
</style>
