<script lang="ts" setup>
import useUserStore from '@/store/modules/user'

const emits = defineEmits<{
  onLogin: [account?: string]
  onRegister: [account?: string]
  onResetPassword: [account?: string]
}>()
const userStore = useUserStore()
const { companyList } = storeToRefs(userStore)
async function selectCompanys() {
  userStore.selectCompany()
  emits('onLogin')
}
onMounted(async () => {
  await userStore.getCompanyList()
  if (companyList.value.length < 2) {
    userStore.selectCompany().then((res) => {
      emits('onLogin')
    })
  }
})
</script>

<template>
  <div class="min-h-500px w-full flex-col-stretch-center p-12">
    <div class="mb-6 space-y-2">
      <h3 class="text-4xl color-[var(--el-text-color-primary)] font-bold">
        请选择公司 👋🏻
      </h3>
    </div>
    <ul class="ul mb-6 h-300px">
      <li v-for="item in companyList" :key="item" class="list h-40px flex items-center justify-between" @dblclick="selectCompanys(item)">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.ul{
  overflow-y: scroll;
  overflow-x: auto; /* 当内容超出时显示水平滚动条 */
  padding-right: 10px; /* 预留 10px 空间给 li 右移 */
}
.list{
  margin: 10px 0;
  background-color: #f2f2f6;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 4px;
  transition: all 0.4s;
  &:hover{
    background-color: #e2e2e6;
    box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.1);
    transform: translateX(10px);
  }
}
</style>
