<script setup>
import iconNames from './index.js'

const icons = defineModel('icons')
const icon = ref('')
const iconList = computed(() => {
  if (!icon.value) {
    return iconNames
  }
  return iconNames.filter(item => item.toLowerCase().includes(icon.value))
})
</script>

<template>
  <div calss="w-full h-[300px]">
    <ElInput v-model="icon" placeholder="请输入图表选择" clearable class="w-[300px]" />
    <div class="w-[300px] flex flex-wrap overflow-y-auto" style="max-height: 300px;">
      <div v-for="item in iconList" :key="item" class="w-[50%]">
        <ElButton text :icon="item" @click="icons = item ">
          {{ item }}
        </ElButton>
      </div>
    </div>
  </div>
</template>
