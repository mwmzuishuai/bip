<script  setup>
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const value = ref(1)
const { companyList } = storeToRefs(userStore)
async function companyChage(val) {
  await userStore.selectCompany(val)
  value.value = val
  // 刷新页面
  window.location.reload()
}
onMounted(() => {
  userStore.getCompanyList()
  value.value = JSON.parse(localStorage.getItem('companyId'))
})
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
