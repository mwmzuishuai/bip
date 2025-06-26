<script setup>
const formMenu = ref({
  menuName: '',
  status: '',
})
const dataList = ref([
  {
    id: 3,
    date: '2016-05-01',
    menuName: 'wangxiaohu',
    icon: 'icon',
    path: 'path',
    component: 'component',
    permission: 'permission',
    sort: 'sort',
    status: 1,
    createTime: '2016-05-01',
    children: [
      {
        id: 31,
        date: '2016-05-01',
        menuName: 'wangxiaohu',
        icon: 'icon',
        path: 'path',
        component: 'component',
        permission: 'permission',
        sort: 'sort',
        status: 1,
        createTime: '2016-05-01',
      },
      {
        id: 32,
        date: '2016-05-01',
        menuName: 'wangxiaohu',
        icon: 'icon',
        path: 'path',
        component: 'component',
        permission: 'permission',
        sort: 'sort',
        status: 0,
        createTime: '2016-05-01',
      },
    ],
  },
])
const columns = ref([
  {
    prop: 'menuName',
    label: '菜单名称',
    width: '300',
    align: 'center',
  },
  {
    prop: 'icon',
    label: '图标',
    width: '100',
    align: 'center',
    render: true,
  },
  {
    prop: 'path',
    label: '路径',
    width: '200',
    align: 'center',
  },
  {
    prop: 'component',
    label: '组件',
    width: '300',
    align: 'center',
  },
  {
    prop: 'permission',
    label: '权限标识',
    width: '400',
    align: 'center',
  },
  {
    prop: 'sort',
    label: '排序',
    width: '100',
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
    prop: 'createTime',
    label: '创建时间',
    width: '200',
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
  menuName: '',
  menutop: '',
  menuType: '1',
  icon: '',
  // 初始化 sort 为数字类型
  sort: 0,
  status: '1',
  permission: '',
})
const addRules = reactive({
  menuName: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
  ],
  path: [
    { required: true, message: '请输入路径', trigger: 'blur' },
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
async function submitMenuForm(formEl) {
  // eslint-disable-next-line style/max-statements-per-line
  if (!formEl) { return }

  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(formEl.model)
    }
    else {
      console.log(fields)
    }
  })
}
// icon选择
</script>

<template>
  <div class="absolute-container">
    <FaPageMain class="mb-0">
      <FaSearchBar :show-toggle="false">
        <template #default>
          <ElForm :model="formMenu" size="default" label-width="120px">
            <ElRow>
              <ElCol :span="6">
                <ElFormItem label="角色名称">
                  <ElInput v-model="formMenu.name" placeholder="请输入" clearable />
                </ElFormItem>
              </ElCol>
              <ElCol :span="6">
                <ElFormItem label="状态">
                  <ElSelect v-model="formMenu.status" clearable placeholder="请选择">
                    <ElOption label="已禁用" :value="1" />
                    <ElOption label="已启动" :value="2" />
                  </ElSelect>
                </ElFormItem>
              </ElCol>
              <ElCol :span="8" />
              <ElFormItem>
                <ElButton type="primary">
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
        <ElButton v-auth="['system:user:edit']" type="primary" @click="menukey = true">
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
        row-key="id" :data-list="dataList" :columns="columns" :operate="true"
        :default-expand-all="defaultExpandAll"
      >
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
    <ElDialog v-model="menukey" title="添加菜单" width="800">
      <ElForm ref="addFormRef" :model="addForm" size="default" label-width="120px" :rules="addRules">
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="菜单名称" prop="menuName">
              <ElInput v-model="addForm.menuName" placeholder="请输入" clearable />
            </ElFormItem>
          </ElCol>
          <ElCol v-if="addForm.menuType !== '3'" :span="12">
            <ElFormItem label="图标" prop="icon">
              <ElPopover placement="bottom" trigger="click" popper-style="width: auto">
                <template #reference>
                  <ElInput v-model="addForm.icon" placeholder="请输入" clearable />
                </template>
                <div>
                  <IconChoose v-model:icons="addForm.icon" />
                </div>
              </ElPopover>
            </ElFormItem>
          </ElCol>
          <ElRow>
            <ElFormItem label="显示排序" prop="sort">
              <!-- 确保 v-model 绑定的值是数字类型 -->
              <ElInputNumber v-model.number="addForm.sort" :min="0" class="m-r[10px]" />
            </ElFormItem>
          </ElRow>
        </ElRow>
        <ElRow>
          <ElFormItem label="菜单类型" prop="menuType">
            <ElRadioGroup v-model="addForm.menuType">
              <ElRadio value="1">
                目录
              </ElRadio>
              <ElRadio value="2">
                菜单
              </ElRadio>
              <ElRadio value="3">
                按钮
              </ElRadio>
            </ElRadioGroup>
          </ElFormItem>
        </ElRow>
        <ElRow>
          <ElCol v-if="addForm.menuType !== '3'" :span="12">
            <ElFormItem label="菜单路径" prop="path">
              <ElInput v-model="addForm.path" placeholder="请输入" clearable />
            </ElFormItem>
          </ElCol>
          <ElCol v-if="addForm.menuType === '2'" :span="12">
            <ElFormItem label="组件路径" prop="component">
              <ElInput v-model="addForm.component" placeholder="请输入" clearable />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="权限标识" prop="permission">
              <ElInput v-model="addForm.permission" placeholder="请输入" clearable />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElFormItem label="菜单状态" prop="status">
            <ElRadioGroup v-model="addForm.status">
              <ElRadio value="1">
                显示
              </ElRadio>
              <ElRadio value="0">
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
