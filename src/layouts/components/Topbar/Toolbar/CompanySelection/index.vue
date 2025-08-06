<script  setup>
import useUserStore from '@/store/modules/user'
import useAuth from '@/utils/composables/useAuth'
const { auth, authAll } = useAuth()
const userStore = useUserStore()
const value = ref(1)
const { companyList } = storeToRefs(userStore)
async function companyChage(val) {
  await userStore.selectCompany(val)
  value.value = val
  // 刷新页面
  window.location.reload()
}
//租户区分
function getCompanyLists() {
  if (auth(['tenant:list'])){
    userStore.getCompanyList()
    value.value = JSON.parse(localStorage.getItem('companyId'))
  }
}
onMounted(() => {
  getCompanyLists()
})
</script>

<template>
  <el-select v-model="value" v-auth="['tenant:list']" placeholder="Select" style="width: 240px" @change="companyChage">
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
