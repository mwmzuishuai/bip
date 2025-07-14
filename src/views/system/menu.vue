<script setup>
import {
  ArrowLeft,
  ArrowRight,
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { toast } from 'vue-sonner'
import api from '@/api/modules/system'
import useStystemStore from '@/store/modules/system'

const stytemStore = useStystemStore()
const { getMenus } = stytemStore
const { menus, menusTree } = storeToRefs(stytemStore)
const loading = ref(false)
const menuTitle = ref('新增菜单')
const isIndeterminate = ref(false)
const isIndeterminate1 = ref(false)
const checkedCities = ref([])
const checkedCities1 = ref([])
const cities = ref([])
const cities1 = ref([])
const paginationForm = ref({
  pageNum: 1,
  pageSize: 20,
})
const total = ref(0)
const checkAll = ref(false)
const checkAll1 = ref(false)
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
        addForm.value.api_ids = cities1.value.map(item => item.id)
        api.addRoute({ ...addForm.value }).then(() => {
          menukey.value = false
          toast.success('新增成功')
          getMenus()
        })
      }
      else {
        addForm.value.api_ids = cities1.value.map(item => item.id)
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
// 获取菜单详情
async function getMenuDetail(id) {
  try {
    const response = await api.getRouteInfo(id)
    addForm.value = response.data

    cities1.value = response.data.apis
  }
  catch (error) {
    console.error('获取菜单详情失败:', error)
  }
}
// 点击编辑
async function handleEdit(row) {
  menuTitle.value = '编辑菜单'
  menukey.value = true
  await getMenuDetail(row.id)
  generateData()
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
async function seleceMenu() {
  loading.value = false
  await getMenus(formMenu.value)
  loading.value = true
}

function change(value) {
  paginationForm.value.pageNum = value
  cities.value = generateData().filter((i) => {
    return !cities1.value.find(item => item.id === i.id)
  })
}

function handleCheckAllChange(val) {
  checkedCities.value = val ? cities.value : []
  isIndeterminate.value = false
}

function handleCheckAllChange1(val) {
  checkedCities1.value = val ? cities1.value : []
  isIndeterminate1.value = false
}

function handleCheckedCitiesChange(value) {
  const checkedCount = value.length
  checkAll.value = checkedCount === cities.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.value.length
}

function handleCheckedCitiesChange1(value) {
  const checkedCount = value.length
  checkAll1.value = checkedCount === cities1.value.length
  isIndeterminate1.value = checkedCount > 0 && checkedCount < cities1.value.length
}

function xuan() {
  if (checkedCities.value.length > 0) {
    cities1.value.push(...checkedCities.value)
    cities.value = cities.value.filter((item) => {
      return !cities1.value.includes(item)
    })
    checkedCities.value = []
  }
}

async function xuan2() {
  if (checkedCities1.value.length > 0) {
    cities.value.push(...checkedCities1.value)
    checkedCities1.value = []
    cities1.value = cities1.value.filter((i) => {
      return !cities.value.find(item => item.id === i.id)
    })
  }
}
// 请求接口权限
async function generateData() {
  const res = await api.getApilist({ ...paginationForm.value })
  checkedCities1.value = []
  cities.value = res.data.items.filter((i) => {
    return !cities1.value.find(item => item.id === i.id)
  })
}
</script>

<template>
  <div class="absolute-container">
    <FaPageMain class="mb-0">
      <FaSearchBar :show-toggle="false">
        <template #default>
          <ElForm :model="formMenu" label-width="120px" size="default" @keyup.enter="getMenus(formMenu)">
            <ElRow>
              <ElCol :span="6">
                <ElFormItem label="菜单名称">
                  <ElInput v-model="formMenu.name" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="类型">
                  <ElSelect v-model="formMenu.type_id" clearable placeholder="请选择">
                    <ElOption :value="0" label="目录" />
                    <ElOption :value="1" label="菜单" />
                    <ElOption :value="2" label="按钮" />
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
        :columns="columns" :data-list="menus" :default-expand-all="defaultExpandAll" :loading="loading"
        :operate="true" row-key="id" @delete="handleDelete" @edit="handleEdit"
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
    <ElDrawer v-model="menukey" :title="menuTitle" size="40%">
      <ElForm ref="addFormRef" :model="addForm" :rules="addRules" label-width="120px" size="default">
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="菜单名称" prop="name">
              <ElInput v-model="addForm.name" clearable placeholder="请输入" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="父级菜单" prop="parent_id">
              <ElTreeSelect v-model="addForm.parent_id" :data="menusTree" check-strictly clearable placeholder="请输入" />
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
              <ElInput v-model="addForm.perms" clearable placeholder="请输入" />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="24">
            <ElFormItem label="接口选择" prop="api">
              <div class="w-full flex justify-between" style="align-items: center">
                <div class="left">
                  <header>接口选择</header>
                  <el-checkbox
                    v-model="checkAll"
                    :indeterminate="isIndeterminate"
                    @change="handleCheckAllChange"
                  >
                    全选
                  </el-checkbox>
                  <el-checkbox-group
                    v-model="checkedCities"
                    @change="handleCheckedCitiesChange"
                  >
                    <el-checkbox v-for="city in cities" :key="city" :label="city.name" :value="city">
                      {{ city.name }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
                <div style="height:10px">
                  <el-button-group>
                    <el-button :icon="ArrowLeft" type="primary" @click="xuan2" />
                    <el-button :icon="ArrowRight" type="primary" @click="xuan" />
                  </el-button-group>
                </div>
                <div class="right">
                  <header>已选接口</header>
                  <el-checkbox
                    v-model="checkAll1"
                    :indeterminate="isIndeterminate1"
                    @change="handleCheckAllChange1"
                  >
                    全选
                  </el-checkbox>
                  <el-checkbox-group
                    v-model="checkedCities1"
                    @change="handleCheckedCitiesChange1"
                  >
                    <el-checkbox v-for="city in cities1" :key="city" :label="city.name" :value="city">
                      {{ city.name }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <el-pagination
                :pager-count="5" :total="total" background size="small" style="margin-top: 10px"
                @current-change="change"
              />
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
    </ElDrawer>
  </div>
</template>

<style lang='scss' scoped>
.absolute-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
:deep() {
  .el-checkbox-group {
    display: flex;
    flex-direction: column;

  }
}

.left {
  border: 1px solid #ccc;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 10px;
  width: 30%;
  height: 400px;
  overflow: auto;
  background-color: #ecf0f1;
  box-shadow: 0px 0px 5px 1px #999;
}

.right {
  border: 1px solid #ccc;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 10px;
  width: 30%;
  height: 400px;
  overflow: auto;
  background-color: #ecf0f1;
  box-shadow: 0px 0px 5px 1px #999;
}
</style>
