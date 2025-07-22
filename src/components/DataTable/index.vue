<script setup>
// columns：数据源，dataList：数据列表，operate：是否显示操作列,pagination：是否显示分页器及相关配置,rowKey：行的唯一标识，默认为id,defaultExpandAll：是否展开所有行
// 操作列的事件 edit 编辑 delete 删除

const props = defineProps(['columns', 'dataList', 'operate', 'pagination', 'rowKey', 'defaultExpandAll', 'loading', 'auth'])
const emit = defineEmits(['edit', 'delete', 'currentChange', 'sizeChange', 'selectionChange'])
const key = ref(new Date().getTime())
const multipleTableRef = ref(null)
function handleSizeChange(val) {
  emit('sizeChange', val)
}
function handleCurrentChange(val) {
  emit('currentChange', val)
}
function handleSelectionChange(val) {
  emit('selectionChange', val)
}
watch(() => props.defaultExpandAll, () => {
  key.value = new Date().getTime()
})
defineExpose({ multipleTableRef })
console.log(props)
</script>

<template>
  <ElTable
    :key="key" ref="multipleTableRef" v-loading="props.loading" :data="props.dataList" :default-expand-all="props.defaultExpandAll" :row-key="props.rowKey"
    height="100%" highlight-current-row stripe border
    @selection-change="handleSelectionChange"
  >
    <ElTableColumn
      v-for="(item, index) in props.columns" :key="index" :align="item.align" :label="item.label"
      :prop="item.prop" :sortable="item.sortable" :type="item.type" :width="item.width"
    >
      <template v-if="item.render" #default="scope">
        <slot :date="scope.row" :name="item.prop" />
      </template>
    </ElTableColumn>
    <ElTableColumn v-if="props.operate" align="center" fixed="right" label="操作" width="120">
      <template #default="scope">
        <div v-if="!scope.row.is_superuser">
          <ElButton v-if="props.auth ? props.auth.edit : true" :disabled="props.operate.edit" circle type="primary" @click="emit('edit', scope.row)">
            <template #icon>
              <FaIcon name="i-ep:edit" />
            </template>
          </ElButton>
          <ElButton v-if="props.auth ? props.auth.delete : true" :disabled="props.operate.delete" circle type="danger" @click="emit('delete', scope.row)">
            <template #icon>
              <FaIcon name="i-ep:delete" />
            </template>
          </ElButton>
        </div>
      </template>
    </ElTableColumn>
  </ElTable>
  <div class="flex justify-end">
    <ElPagination
      v-if="props.pagination" :disabled="props.pagination.disabled || false" :page-sizes="props.pagination.pageSizes"
      :total="props.pagination.total" background
      class="m-t[16px]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
