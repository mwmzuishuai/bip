<script setup>
import { ref } from 'vue'
import useAuth from '@/utils/composables/useAuth'
import api from '@/api/modules/tenant.js'
const { auth } = useAuth()
const treeKey = ref(true)
import useStystemStore from '@/store/modules/system'
const stystemStore = useStystemStore()
const { menusTree } = storeToRefs(stystemStore)
import { toast } from 'vue-sonner'
import {ElMessageBox} from "element-plus";
const treeRef = ref(null)
const options = [{
  label: '父子联动',
  value: false,
}, {
  label: '非父子联动',
  value: true,
}]
const formMenu = ref({
  page: 1,
  size: 10,
})
const auths = ref({
  delete: auth('tenant:package:delete'),
  edit: auth('tenant:package:edit'),
})
const columns = ref([
  {
    prop: 'name',
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
    prop: 'remark',
    label: '套餐描述',
    width: '100',
    align: 'center',
  },
  {
    prop: 'update_time',
    label: '最近修改',
    align: 'center',
  },
  {
    prop:'is_active',
    label:'状态',
    align:'center',
    render: true,
  }
  ,
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
const drwawerForm = ref({})
const addRules = ref({
  tenant_name: [{ required: true, message: '请输入租户名称', trigger: ['blur'] }],
  tenant_code: [{ required: true, message: '请输入租户编码', trigger: ['blur'] }],
})

const loading = ref(false)
const dataList = ref([
])
// 搜索
function getTenantList() {
  getPackage()
}
// 重置
function reset() {
  formMenu.value = {
    page: 1,
    size: 10,
  }
}
// 删除
function dalete(data) {
  ElMessageBox.confirm('是否确定删除?', '删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'error',
  }).then(() => {
    api.deletePackage(data.id).then(() => {
      toast.success('删除成功')
      getPackage()
    })
  })
}
// 编辑
async function handleEdit(item) {
  dtawerKey.value = true
  titleDrawer.value = '编辑套餐'
  stystemStore.getMenus()
  const res = await api.getPackageDetail(item.id)
  drwawerForm.value = res.data
  if (treeRef.value) {
    treeRef.value.setCheckedKeys(res.data.menus.map(item=>item.id))
  }
}
// 新增点击
function postUserInfos() {
  dtawerKey.value = true
  titleDrawer.value = '新增套餐'
  stystemStore.getMenus()
  drwawerForm.value = {
    tenant_name: '',
    tenant_code: '',
    package_description: '',
  }
  if (treeRef.value) {
    treeRef.value.setCheckedKeys([])
  }
}
// 页码切换
function handleCurrentChange(val) {
  formMenu.value.page = val
}
function handleSizeChange(val) {
  formMenu.value.size = val
}
//获取套餐列表
function getPackage() {
  api.getPackageList(formMenu.value).then((res) => {
    dataList.value = res.data.items
    pagination.value.total = res.data.total
  })
}
//提交
async function putUserInfos(formEl) {
  if (!formEl) { return }
  await formEl.validate((valid) => {
    if (valid) {
      if (titleDrawer.value === '编辑套餐'){
        const obj = {
          is_active:drwawerForm.value.is_active,
          name:drwawerForm.value.name,
          remark:drwawerForm.value.remark,
          menu_ids: [...treeRef.value.getHalfCheckedKeys(), ...treeRef.value.getCheckedKeys()],
        }
        api.patchPackage(drwawerForm.value.id,obj).then(() => {
          toast.success('修改成功')
          dtawerKey.value = false
          getPackage()
        })
      }else{
        const obj = {
          is_active:drwawerForm.value.is_active,
          name:drwawerForm.value.name,
          remark:drwawerForm.value.remark,
          menu_ids: [...treeRef.value.getHalfCheckedKeys(), ...treeRef.value.getCheckedKeys()],
        }
        api.addPackage(obj).then(() => {
          toast.success('新增成功')
          dtawerKey.value = false
          getPackage()
        })
      }

    }
  })
}
//状态修改
function handleSwitchChange(item) {
  api.patchPackage(item.id, { is_active: item.is_active }).then(() => {
    toast.success('修改成功')
    getPackage()
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
onMounted(()=>{
  getPackage()
  stystemStore.getMenus()
})
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
                  <ElInput v-model="formMenu.name" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="状态">
                  <ElSelect v-model="formMenu.is_active" clearable placeholder="请输入">
                    <ElOption label="已启动" value="1" />
                    <ElOption label="已禁止" value="0" />
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
        <ElButton v-auth="['tenant:package:add']" type="primary" @click="postUserInfos()">
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
            v-model="date.is_active" :before-change="handleBeforeSwitchChange" :disabled="!auth(['tenant:package:edit'])" active-text="已启动" class="switch-container" inactive-text="已禁止"
            inline-prompt size="large" @change="handleSwitchChange(date)"
          />
        </template>
      </DataTable>
    </FaPageMain>
    <ElDrawer v-model="dtawerKey" :title="titleDrawer" size="40%">
      <FaSearchBar :show-toggle="false">
        <template #default>
          <ElForm ref="addFormRef" :model="drwawerForm" :rules="addRules" label-width="120px" size="default">
            <ElRow>
              <ElCol :span="12">
                <ElFormItem label="套餐名称" prop="name">
                  <ElInput v-model="drwawerForm.name" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="12">
                <ElFormItem label="套餐描述" prop="remark">
                  <ElInput v-model="drwawerForm.remark" clearable placeholder="请输入" />
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
            <div style="margin-top: 10px;margin-bottom: 10px;">
              <ElSegmented v-model="treeKey" :options="options" size="large" />
            </div>
            <ElTree ref="treeRef" :check-strictly="treeKey" :data="menusTree" node-key="id" show-checkbox />
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
  transform: r;
}
.switch-container {
  --el-switch-on-color: #1b9cfc;
  --el-switch-off-color: #ff4949;
}
</style>
