<script  setup>
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const value = ref(1)
const { companyList } = storeToRefs(userStore)
function companyChage(val) {
  console.log(val)
}
</script>

<template>
  <el-select v-model="value" placeholder="Select" style="width: 240px" @change="companyChage">
    <el-option
      v-for="item in companyList"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<style scoped>

</style>
