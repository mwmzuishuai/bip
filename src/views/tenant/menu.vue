<script setup>
import { ref } from 'vue'
import useAuth from '@/utils/composables/useAuth'

const { auth } = useAuth()
const formMenu = ref({
  page: 1,
  size: 10,
})
const auths = ref({
  delete: auth('sys:user:delete'),
  edit: auth('sys:user:edit'),
})
const columns = ref([
  {
    prop: 'menu_name',
    label: '套餐名称',
    width: '160',
    align: 'center',
  },
  {
    prop: 'num',
    label: '关联租户数',
    width: '200',
    align: 'center',
  },
  {
    prop: 'package_description',
    label: '套餐描述',
    width: '100',
    align: 'center',
    render: true,
  },
  {
    prop: 'last_modify_time',
    label: '最近修改',
    align: 'center',
  },
  {
    prop: 'create_time',
    label: '创建时间',
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
  formMenu.value = {

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
  titleDrawer.value = '新增套餐'
  drwawerForm.value = {
    tenant_name: '',
    tenant_code: '',
    package_description: '',
  }
}
// 页码切换
function handleCurrentChange(val) {
  formMenu.value.page = val
}
function handleSizeChange(val) {
  formMenu.value.size = val
}
</script>

<template>
  <div class="absolute-container">
    <FaPageMain>
      <FaSearchBar :show-toggle="false">
        <template #default>
          <ElForm :model="formMenu" label-width="120px" size="default" @keydown.enter="getTenantList">
            <ElRow>
              <ElCol :span="6">
                <ElFormItem label="套餐名称">
                  <ElInput v-model="formMenu.username" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="租户编码">
                  <ElInput v-model="formMenu.phone" clearable placeholder="请输入" />
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
              <ElCol v-if="titleDrawer === '新增用户'" :span="12">
                <ElFormItem label="用户名称" prop="username">
                  <ElInput v-model="drwawerForm.username" clearable placeholder="请输入" />
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
