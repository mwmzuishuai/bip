<script setup>
// columns：数据源，dataList：数据列表，operate：是否显示操作列,pagination：是否显示分页器及相关配置,rowKey：行的唯一标识，默认为id,defaultExpandAll：是否展开所有行
// 操作列的事件 edit 编辑 delete 删除

const props = defineProps(['columns', 'dataList', 'operate', 'pagination', 'rowKey', 'defaultExpandAll'])
const emit = defineEmits(['edit', 'delete', 'currentChange', 'sizeChange', 'selectionChange'])
const key = ref(new Date().getTime())
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
</script>

<template>
  <ElTable
    :key="key" :data="props.dataList" stripe highlight-current-row border height="100%"
    :row-key="props.rowKey" :default-expand-all="props.defaultExpandAll" @selection-change="handleSelectionChange"
  >
    <ElTableColumn
      v-for="(item, index) in props.columns" :key="index" :type="item.type" :prop="item.prop"
      :label="item.label" :align="item.align" :width="item.width" :sortable="item.sortable"
    >
      <template v-if="item.render" #default="scope">
        <slot :name="item.prop" :date="scope.row" />
      </template>
    </ElTableColumn>
    <ElTableColumn v-if="props.operate" label="操作" fixed="right" width="120" align="center">
      <template #default="scope">
        <ElButton type="primary" circle @click="emit('edit', scope.row)">
          <template #icon>
            <FaIcon name="i-ep:edit" />
          </template>
        </ElButton>
        <ElButton type="danger" circle @click="emit('delete', scope.row)">
          <template #icon>
            <FaIcon name="i-ep:delete" />
          </template>
        </ElButton>
      </template>
    </ElTableColumn>
  </ElTable>
  <div class="flex justify-end">
    <ElPagination
      v-if="props.pagination" background :page-sizes="props.pagination.pageSizes"
      layout="total, sizes, prev, pager, next, jumper" :total="props.pagination.total"
      :disabled="props.pagination.disabled || false" class="m-t[16px]" @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
