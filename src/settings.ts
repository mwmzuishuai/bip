import type { RecursiveRequired, Settings } from '#/global'
import { cloneDeep } from 'es-toolkit'
import settingsDefault from '@/settings.default'
import { merge } from '@/utils/object'

const globalSettings: Settings.all = {
  app: {
    enablePermission: true,
    // routeBaseOn: 'backend'
  },
  menu: {
    enableSubMenuCollapseButton: true,
  },
  topbar: {
    mode: 'fixed',
  },
  layout: {
    enableMobileAdaptation: true,
  },
  tabbar: {
    enable: true,
    enableIcon: true,
    enableHotkeys: true,
  },
  toolbar: {
    fullscreen: true,
    pageReload: true,
    colorScheme: true,
  },
}

export default merge(globalSettings, cloneDeep(settingsDefault)) as RecursiveRequired<Settings.all>
