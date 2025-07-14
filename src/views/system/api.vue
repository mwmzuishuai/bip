<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { toast } from 'vue-sonner'
import api from '@/api/modules/system'

const formApi = ref({
  page: 1,
  size: 10,
})
const addApiForm = ref({
  name: '',
  path: '',
  method: '',
  description: '',
  id: 0,
})
const columns = reactive(
  [
    {
      prop: 'name',
      label: '接口名称',
      width: 150,
      align: 'center',
    },
    {
      prop: 'path',
      label: '路径',
      width: 350,
      align: 'center',
    },
    {
      prop: 'method',
      label: '方法',
      width: 150,
      align: 'center',
      render: true,
    },
    {
      prop: 'description',
      label: '描述',
      align: 'center',
    },
  ],
)
const loading = ref(false)
const apikey = ref(false)
const apiTitle = ref('新增接口')
const dataList = ref([])
const apiRules = reactive({
  name: [
    { required: true, message: '请输入接口名称', trigger: 'blur' },
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
  path: [
    { required: true, message: '请输入接口路径', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value.includes(' ')) {
          callback(new Error('接口路径不能含有空白字符'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  method: [
    { required: true, message: '请输入接口方法', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value.includes(' ')) {
          callback(new Error('接口方法不能含有空白字符'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})
const addFormRef = ref(null)
const pagination = ref({
  pageSizes: [10, 20, 30, 40],
  total: 0,
})
function searchList() {
  getApiList()
}
function reset() {
  formApi.value = {
    page: 1,
    size: 10,
  }
}
// 获取列表
async function getApiList() {
  loading.value = true
  const res = await api.getApilist(formApi.value)
  dataList.value = res.data.items
  pagination.value.total = res.data.total
  loading.value = false
}
// 新增
function postApiInfos() {
  apikey.value = true
  apiTitle.value = '新增接口'
  addApiForm.value = {
  }
}
// 删除
async function dalete(row) {
  try {
    await ElMessageBox.confirm('是否确认删除?', '删除用户', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'error',
    })

    const id = row.id

    // 等待删除操作完成
    await api.deleteApi(id)

    // 显示成功提示
    toast.success('删除成功')

    // 刷新用户列表
    await getApiList()
  }
  catch (error) {
    // 错误处理（用户取消删除或API请求失败）
    if (error !== 'cancel' && error !== 'close') {
      toast.error('删除失败')
    }
  }
}
// 修改
async function handleEdit(vars: any) {
  apikey.value = true
  apiTitle.value = '修改接口'
  const res = await api.getApiInfo(vars.id)
  addApiForm.value = res.data
}
function handleCurrentChange(val: any) {
  formApi.value.page = val
  getApiList()
}
function handleSizeChange(val: any) {
  formApi.value.size = val
  getApiList()
}
function submitMenuForm(formEl: any) {
  formEl.validate(async (valid: any) => {
    if (valid) {
      // 提交表单
      if (apiTitle.value === '新增接口') {
        api.postApiInfo(addApiForm.value).then(() => {
          toast.success('新增成功')
          getApiList()
          apikey.value = false
        })
      }
      else {
        api.patchApiInfo(addApiForm.value.id, addApiForm.value).then(() => {
          toast.success('修改成功')
          getApiList()
          apikey.value = false
        })
      }
    }
    else {
      console.log('error submit!!')
      return false
    }
  })
}

onMounted(() => {
  getApiList()
})
</script>

<template>
  <div class="apiBox">
    <FaPageMain>
      <FaSearchBar :show-toggle="false">
        <template #default>
          <ElForm :model="formApi" label-width="120px" size="default" @keydown.enter="searchList">
            <ElRow>
              <ElCol :span="6">
                <ElFormItem label="接口名称">
                  <ElInput v-model="formApi.name" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="路径">
                  <ElInput v-model="formApi.path" clearable placeholder="请输入" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="方法">
                  <ElSelect v-model="formApi.method" clearable placeholder="请输入">
                    <ElOption value="GET">
                      <el-tag type="success">
                        GET
                      </el-tag>
                    </ElOption>
                    <ElOption value="POST">
                      <el-tag type="warning">
                        POST
                      </el-tag>
                    </ElOption>
                    <ElOption value="PATCH">
                      <el-tag type="info">
                        PATCH
                      </el-tag>
                    </ElOption>
                    <ElOption value="DELETE">
                      <el-tag type="danger">
                        DELETE
                      </el-tag>
                    </ElOption>
                  </ElSelect>
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
      <div style="margin-bottom: 10px">
        <ElButton type="primary" @click="postApiInfos()">
          <template #icon>
            <FaIcon name="i-ep:plus" />
          </template>
          新增
        </ElButton>
      </div>
      <DataTable
        :columns="columns" :data-list="dataList" :loading="loading" :operate="true" :pagination="pagination"
        @delete="dalete" @edit="handleEdit" @current-change="handleCurrentChange" @size-change="handleSizeChange"
      >
        <template #method="{ date }">
          <el-tag v-if="date.method === 'GET'" type="success">
            {{ date.method }}
          </el-tag>
          <el-tag v-if="date.method === 'POST'" type="warning">
            {{ date.method }}
          </el-tag>
          <el-tag v-if="date.method === 'PATCH'" type="info">
            {{ date.method }}
          </el-tag>
          <el-tag v-if="date.method === 'DELETE'" type="danger">
            {{ date.method }}
          </el-tag>
        </template>
      </DataTable>
    </FaPageMain>
    <ElDrawer v-model="apikey" :title="apiTitle" width="800">
      <ElForm ref="addFormRef" :model="addApiForm" :rules="apiRules" label-width="120px" size="default">
        <ElRow>
          <ElCol :span="24">
            <ElFormItem label="接口名称" prop="name">
              <ElInput v-model="addApiForm.name" clearable placeholder="请输入" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="路径" prop="path">
              <ElInput v-model="addApiForm.path" clearable placeholder="请输入" />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="方法" prop="method">
              <ElSelect v-model="addApiForm.method" clearable placeholder="请输入">
                <ElOption value="GET">
                  <el-tag type="success">
                    GET
                  </el-tag>
                </ElOption>
                <ElOption value="POST">
                  <el-tag type="warning">
                    POST
                  </el-tag>
                </ElOption>
                <ElOption value="PATCH">
                  <el-tag type="info">
                    PATCH
                  </el-tag>
                </ElOption>
                <ElOption value="DELETE">
                  <el-tag type="danger">
                    DELETE
                  </el-tag>
                </ElOption>
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="24">
            <ElFormItem label="描述" prop="description">
              <ElInput v-model="addApiForm.description" clearable placeholder="请输入" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElFormItem>
          <ElButton type="primary" @click="submitMenuForm(addFormRef)">
            <template #icon>
              <FaIcon name="i-ep:plus" />
            </template>
            提交
          </ElButton>
          <ElButton @click="apikey = false">
            取消
          </ElButton>
        </ElFormItem>
      </ElForm>
    </ElDrawer>
  </div>
</template>

<style lang="scss" scoped>
.apiBox{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
