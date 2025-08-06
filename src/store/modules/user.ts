import apiUser from '@/api/modules/user'
import router from '@/router'
import useMenuStore from './menu'
import useRouteStore from './route'
import useSettingsStore from './settings'
import useTabbarStore from './tabbar'

const useUserStore = defineStore(
  // 唯一ID
  'user',
  () => {
    const settingsStore = useSettingsStore()
    const routeStore = useRouteStore()
    const menuStore = useMenuStore()
    const tabbarStore = useTabbarStore()
    const companyList = ref([])
    const account = ref(localStorage.account ?? '')
    const token = ref(localStorage.token ?? '')
    const avatar = ref(localStorage.avatar ?? '')
    const permissions = ref<string[]>([])
    const isLogin = computed(() => {
      if (token.value) {
        return true
      }
      return false
    })

    // 登录
    async function login(data: any) {
      const res = await apiUser.login(data)
      localStorage.setItem('token', res.data.access_token	)
      token.value = res.data.access_token
      const info = await apiUser.getInfo()
      account.value = info.data.nickname || '小小'
      avatar.value = info.data.avatar || ''
      localStorage.setItem('account', info.data.nickname)
      localStorage.setItem('avatar', info.data.avatar)
    }
    // 选择公司
    async function selectCompany(id: any) {
      const res = await apiUser.getPermission(id)
      localStorage.setItem('token', res.data.access_token)
      token.value = res.data.access_token
      localStorage.setItem('companyId', id)
    }
    // 获取公司列表
    async function getCompanyList() {
      const res = await apiUser.getCompanyList()
      companyList.value = res.data.tenants
    }
    // 手动登出
    function logout(redirect = router.currentRoute.value.fullPath) {
      // 此处仅清除计算属性 isLogin 中判断登录状态过期的变量，以保证在弹出登录窗口模式下页面展示依旧正常
      localStorage.removeItem('token')
      token.value = ''

      router.push({
        name: 'login',
        query: {
          ...(redirect !== settingsStore.settings.home.fullPath && router.currentRoute.value.name !== 'login' && { redirect }),
        },
      }).then(logoutCleanStatus)
    }
    // 请求登出
    function requestLogout() {
      // 此处仅清除计算属性 isLogin 中判断登录状态过期的变量，以保证在弹出登录窗口模式下页面展示依旧正常
      localStorage.removeItem('token')
      token.value = ''

      router.push({
        name: 'login',
        query: {
          ...(
            router.currentRoute.value.fullPath !== settingsStore.settings.home.fullPath
            && router.currentRoute.value.name !== 'login'
            && {
              redirect: router.currentRoute.value.fullPath,
            }
          ),
        },
      }).then(logoutCleanStatus)
    }
    // 登出后清除状态
    function logoutCleanStatus() {
      localStorage.removeItem('account')
      localStorage.removeItem('avatar')
      account.value = ''
      avatar.value = ''
      permissions.value = []
      settingsStore.updateSettings({}, true)
      tabbarStore.clean()
      routeStore.removeRoutes()
      menuStore.setActived(0)
    }

    // 获取权限
    async function getPermissions() {
      const res = await apiUser.permission()

      permissions.value = res.data.permissions
    }
    // 修改密码
    async function editPassword(data: {
      password: string
      newPassword: string
    }) {
      await apiUser.passwordEdit(data)
    }

    return {
      account,
      token,
      avatar,
      permissions,
      isLogin,
      companyList,
      login,
      logout,
      requestLogout,
      getPermissions,
      editPassword,
      selectCompany,
      getCompanyList,
    }
  },
)

export default useUserStore
