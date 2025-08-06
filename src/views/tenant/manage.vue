<script setup>
import { ref } from 'vue'
import useAuth from '@/utils/composables/useAuth'
import tenantApi from '@/api/modules/tenant'
import { toast } from 'vue-sonner'
import {ElMessageBox} from "element-plus";
const { auth } = useAuth()
const formTenant = ref({
  page: 1,
  size: 10,
})
const auths = ref({
  delete: auth('sys:user:delete'),
  edit: auth('sys:user:edit'),
})
const menus = ref([])
const columns = ref([
  {
    prop: 'name',
    label: '租户名称',
    width: '160',
    align: 'center',
  },
  {
    prop: 'package',
    label: '套餐名称',
    width: '200',
    align: 'center',
    render: true
  },
  {
    prop: 'tenant_admin',
    label: '租户管理员',
    width: '100',
    align: 'center',
  },
  {
    prop: 'admin_phone',
    label: '管理员手机号',
    width: '200',
    align: 'center',
  },
  {
    prop: 'account_count',
    label: '账号额度',
    width: '100',
    align: 'center',
  },
  {
    prop: 'is_active',
    label: '状态',
    width: '150',
    align: 'center',
    render: true,
  },
  {
    prop: 'expire_time',
    label: '有效期',
    align: 'center',
  },
])
const pagination = ref({
  pageSizes: [10, 20, 30, 40],
  total: 0,
})
// 抽屉相关
const dtawerKey = ref(false)
const titleDrawer = ref('新增租户')
const addFormRef = ref(null)
const drwawerForm = ref(
  {

      name: "0",
      package_id: "",
      account_count: 0,
      expire_time: "",
      is_active: true,
      remark: "",
      username: "",
      password: "",
      nickname: "",
      gender: 0,
      email: "",
      phone: "",
      avatar: "",
  }
)
const addRules = ref({
  name: [{ required: true, message: '请输入租户名称', trigger: ['blur'] }],
  tenant_code: [{ required: true, message: '请输入租户编码', trigger: ['blur'] }],
  package_name: [{ required: true, message: '请输入套餐名称', trigger: ['blur'] }],
  expire_time: [{ required: true, message: '请输入有效期', trigger: ['blur'] }],
  username: [{ required: true, message: '请输入管理员账号', trigger: ['blur'] }],
  password: [{ required: true, message: '请输入管理员密码', trigger: ['blur'] }],
  nickname: [{ required: true, message: '请输入昵称', trigger: ['blur'] }],
  real_name: [{ required: true, message: '请输入真实姓名', trigger: ['blur'] }],
  phone: [{ required: true, message: '请输入手机号', trigger: ['blur'] }],
  email: [{ required: true, message: '请输入邮箱', trigger: ['blur'] }],
  package_id: [{ required: true, message: '请选择套餐', trigger: ['change'] }],
})

const loading = ref(false)
const dataList = ref([
])
// 重置
function reset() {
  formTenant.value = {

  }
}
// 删除
function dalete() {}
// 编辑
function handleEdit(data) {
  dtawerKey.value = true
  titleDrawer.value = '编辑租户'
  getPackage()
  getTenantDetail(data.id)
}
// 新增
async function postUserInfos() {
  dtawerKey.value = true
  titleDrawer.value = '新增租户'
  await getPackage()
  drwawerForm.value = {
    name: "",
    package_id: "",
    account_count: 0,
    expire_time: "",
    is_active: true,
    remark: "",
    username: "",
    password: "",
    nickname: "",
    gender: 0,
    email: "",
    phone: "",
    avatar: "",
  }
}
// 页码切换
function handleCurrentChange(val) {
  formTenant.value.page = val
  getTenantList()
}
function handleSizeChange(val) {
  formTenant.value.size = val
  getTenantList()
}
//获取租户列表
async function getTenantList() {
  loading.value = true
  const res = await tenantApi.getTenantList(formTenant.value)
  loading.value = false
  dataList.value = res.data.items
  pagination.value.total = res.data.total

}
//获取租户详情
async function getTenantDetail(id) {
  const res = await tenantApi.getTenantDetail(id)
  delete res.data.admin
  drwawerForm.value = {
    ...res.data,
  }
}
function handleSwitchChange(item) {
  tenantApi.patchPackage(item.id, { is_active: item.is_active }).then(() => {
    toast.success('修改成功')
    getTenantList()
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
//获取套餐列表
function getPackage() {
  tenantApi.getPackageList({  page: 1,
    size: 100,}).then((res) => {
    menus.value = res.data.items
  })
}

//提交
async function  putUserInfos(formEl){
  if (!formEl) { return }
  await formEl.validate((valid) => {
    if (valid) {
      if (titleDrawer.value === '新增租户') {
        const obj = {
          tenant:{
            name: drwawerForm.value.name,
            package_id: drwawerForm.value.package_id,
            account_count: drwawerForm.value.account_count,
            expire_time: drwawerForm.value.expire_time,
            is_active: drwawerForm.value.is_active,
            remark: drwawerForm.value.remark,
          },
          manager: {
            username: drwawerForm.value.username,
            password: drwawerForm.value.password,
            nickname: drwawerForm.value.nickname,
            gender: drwawerForm.value.gender,
            email: drwawerForm.value.email,
            phone: drwawerForm.value.phone,
          }
        }
        tenantApi.addTenant(obj).then(() => {
          toast.success('新增成功')
          dtawerKey.value = false
          getTenantList()
        })
      }
    }
  })
}
onMounted(()=>{
  getTenantList()
})
</script>

<template>
  <div class="absolute-container">
    <FaPageMain>
      <FaSearchBar :show-toggle="false">
        <template #default>
          <ElForm :model="formTenant" label-width="120px" size="default" @keydown.enter="getTenantList">
            <ElRow>
              <ElCol :span="6">
                <ElFormItem label="租户名称">
                  <ElInput v-model="formTenant.username" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="状态">
                  <ElSelect v-model="formTenant.is_active" clearable placeholder="请选择">
                    <ElOption :value="false" label="已禁用" />
                    <ElOption :value="true" label="已启动" />


                  </ElSelect>
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElFormItem>
                <ElButton type="primary" @click="getTenantList">
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
      </div>
      <DataTable
        :auth="auths" :columns="columns" :data-list="dataList" :loading="loading"
        :operate="auths.delete || auths.edit" :pagination="pagination" @delete="dalete" @edit="handleEdit"
        @current-change="handleCurrentChange" @size-change="handleSizeChange"
      >
        <template #is_active="{ date }">
          <!-- {{ date }} -->
          <ElSwitch
            v-model="date.is_active" :before-change="handleBeforeSwitchChange" active-text="已启动" class="switch-container" inactive-text="已禁止"
            inline-prompt size="large" @change="handleSwitchChange(date)"
          />
        </template>
        <template #package="{ date }">
          {{ date.package.name }}
        </template>
      </DataTable>
    </FaPageMain>
    <ElDrawer v-model="dtawerKey" :title="titleDrawer" size="40%">
      <FaSearchBar :show-toggle="false">
        <template #default>
          <ElForm ref="addFormRef" :model="drwawerForm" :rules="addRules" label-width="120px" size="default">
            <ElRow>
              <ElCol :span="12">
                <ElFormItem label="租户名称" prop="name">
                  <ElInput v-model="drwawerForm.name" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="12">
                <ElFormItem label="账号额度" prop="account_quota">
                  <ElInputNumber  v-model="drwawerForm.account_count" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElCol :span="12">
                <ElFormItem label="租户套餐" prop="package_id">
                  <ElSelect v-model="drwawerForm.package_id" clearable placeholder="请输入">
                    <ElOption v-for="item in menus" :key="item.id" :label="item.name" :value="item.id" />
                  </ElSelect>
                </ElFormItem>
              </ElCol>
              <ElCol :span="12">
                <ElFormItem label="过期时间" prop="expire_time">
                  <ElDatePicker v-model="drwawerForm.expire_time" clearable  placeholder="请输入" value-format="YYYY-MM-DD" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="12">
                <ElFormItem label="状态" prop="is_active">
                  <ElRadioGroup v-model="drwawerForm.is_active">
                    <ElRadio :value="true">
                      启动
                    </ElRadio>
                    <ElRadio :value="false">
                      禁止
                    </ElRadio>
                  </ElRadioGroup>
                </ElFormItem>
              </ElCol>
              <ElCol :span="24">
                <ElFormItem label="描述" prop="remark">
                  <ElInput v-model="drwawerForm.remark" clearable placeholder="请输入" type="textarea" />
                </ElFormItem>
              </ElCol>
            </ElRow>
            <template v-if="titleDrawer === '新增租户'">
              <ElDivider content-position="left">租户管理员用户信息</ElDivider>
              <ElRow>
                <ElCol :span="12">
                  <ElFormItem label="管理员账号" prop="username">
                    <ElInput v-model="drwawerForm.username" clearable placeholder="请输入" />
                  </ElFormItem>
                </ElCol>
                <ElCol :span="12">
                  <ElFormItem label="管理员密码" prop="password">
                    <ElInput v-model="drwawerForm.password" clearable placeholder="请输入" type="password" />
                  </ElFormItem>
                </ElCol>
                <ElCol :span="12">
                  <ElFormItem label="昵称" prop="nickname">
                    <ElInput v-model="drwawerForm.nickname" clearable placeholder="请输入" />
                  </ElFormItem>
                </ElCol>
                <ElCol :span="12">
                  <ElFormItem label="手机号" prop="phone">
                    <ElInput v-model="drwawerForm.phone" clearable placeholder="请输入" />
                  </ElFormItem>
                </ElCol>
                <ElCol :span="12">
                  <ElFormItem label="邮箱" prop="email">
                    <ElInput v-model="drwawerForm.email" clearable placeholder="请输入" />
                  </ElFormItem>
                </ElCol>

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

              </ElRow>
            </template>

            <ElDivider/>
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
</style>
