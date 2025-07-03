import api from '@/api/modules/system'

const useStystemStore = defineStore('system', () => {
  const depts = ref([])
  const deptsTree = ref([])
  const deptsTreeTvalue = ref([])
  const menus = ref([])
  const menusTree = ref([])
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
  // 获取菜单
  async function getMenus(data: any) {
    const res = await api.routeList(data)
    menus.value = res.data.menu_tree
    function processTree(data: any[]) {
      return data.map((item) => {
        return {
          label: item.name,
          value: item.id,
          ...item,
          children: item.children ? processTree(item.children) : [],
        }
      })
    }
    menusTree.value = processTree(menus.value)
  }
  return {
    deptsTreeTvalue,
    depts,
    getDepts,
    deptsTree,
    getMenus,
    menusTree,
    menus,

  }
})
export default useStystemStore
