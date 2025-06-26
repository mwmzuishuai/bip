import api from '@/api/modules/system'

const useStystemStore = defineStore('system', () => {
  const depts = ref([])
  const deptsTree = ref([])
  const deptsTreeTvalue = ref([])
  async function getDepts() {
    const res = await api.getTreeDepts()
    depts.value = res.data.dept_tree
    // 递归处理树形结构
    function processTree(data: any[], type: number) {
      if (type === 1) {
        return data.map((item) => {
          return {
            id: item.id,
            label: item.name,
            children: item.children ? processTree(item.children, type) : [],
          }
        })
      }
      else {
        return data.map((item) => {
          return {
            value: item.id,
            label: item.name,
            children: item.children ? processTree(item.children, type) : [],
          }
        })
      }
    }
    deptsTree.value = processTree(depts.value, 1)
    deptsTreeTvalue.value = processTree(depts.value, 2)
  }
  return {
    deptsTreeTvalue,
    depts,
    getDepts,
    deptsTree,
  }
})
export default useStystemStore
