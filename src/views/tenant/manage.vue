<script setup>
import { ref } from 'vue'
import useAuth from '@/utils/composables/useAuth'

const { auth } = useAuth()
const formTenant = ref({
  page: 1,
  size: 10,
})
const auths = ref({
  delete: auth('sys:user:delete'),
  edit: auth('sys:user:edit'),
})
const columns = ref([
  {
    prop: 'tenant_name',
    label: '租户名称',
    width: '160',
    align: 'center',
  },
  {
    prop: 'package_name',
    label: '套餐名称',
    width: '200',
    align: 'center',
  },
  {
    prop: 'tenant_admin',
    label: '租户管理员',
    width: '100',
    align: 'center',
    render: true,
  },
  {
    prop: 'admin_phone',
    label: '管理员手机号',
    width: '200',
    align: 'center',
    render: true,
  },
  {
    prop: 'account_quota',
    label: '账号额度',
    width: '100',
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
const drwawerForm = ref()
const addRules = ref({
  tenant_name: [{ required: true, message: '请输入租户名称', trigger: ['blur'] }],
  tenant_code: [{ required: true, message: '请输入租户编码', trigger: ['blur'] }],
})

const loading = ref(false)
const dataList = ref([
])
// 搜索
function getTenantList() {

}
// 重置
function reset() {
  formTenant.value = {

  }
}
// 删除
function dalete() {}
// 编辑
function handleEdit() {

}
// 新增
function postUserInfos() {
  dtawerKey.value = true
  titleDrawer.value = '新增租户'
  drwawerForm.value = {
    username: '',
    phone: '',
    email: '',
    gender: 1,
    is_active: true,
  }
}
// 页码切换
function handleCurrentChange(val) {
  formTenant.value.page = val
}
function handleSizeChange(val) {
  formTenant.value.size = val
}
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
      />
    </FaPageMain>
    <ElDrawer v-model="dtawerKey" :title="titleDrawer" size="40%">
      <FaSearchBar :show-toggle="false">
        <template #default>
          <ElForm ref="addFormRef" :model="drwawerForm" :rules="addRules" label-width="120px" size="default">
            <ElRow>
              <ElCol :span="12">
                <ElFormItem label="租户名称" prop="username">
                  <ElInput v-model="drwawerForm.username" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElCol :span="12">
                <ElFormItem label="租户套餐" prop="setmenu">
                  <ElInput v-model="drwawerForm.setmenu" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="12">
                <ElFormItem label="过期时间" prop="expire_time">
                  <ElInput v-model="drwawerForm.expire_time" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="12">
                <ElFormItem label="账号额度" prop="account_quota">
                  <ElInput v-model="drwawerForm.account_quota" clearable placeholder="请输入" />
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
</style>
