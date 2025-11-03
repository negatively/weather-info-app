import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '@renderer/views/MainLayout.vue'
import AirQualityPage from '@renderer/views/air-quality/AirQualityPage.vue'
import SettingPage from '@renderer/views/settings/SettingPage.vue'
import PM25Page from '@renderer/views/pm25/PM25Page.vue'
import PreviewAirQualityPage from '@renderer/views/air-quality/PreviewAirQualityPage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainLayout,
      children: [
        { path: '', name: 'air-quality', component: AirQualityPage },
        { path: 'settings', name: 'setting', component: SettingPage },
        { path: 'pm25', name: 'pm25', component: PM25Page },
        {
          path: 'air-quality/preview',
          name: 'air-quality.preview',
          component: PreviewAirQualityPage
        }
      ]
    }
  ]
})

export default router
