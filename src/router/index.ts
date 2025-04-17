import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/Home.vue'),
          meta: { title: '首页' }
        },
        {
          path: 'market',
          name: 'market',
          component: () => import('@/views/market/index.vue'),
          meta: { title: '行情数据' },
          children: [
            {
              path: 'stocks',
              name: 'stocks',
              component: () => import('@/views/market/Stocks.vue'),
              meta: { title: '股票行情' }
            },
            {
              path: 'bonds',
              name: 'bonds',
              component: () => import('@/views/market/Bonds.vue'),
              meta: { title: '债券行情' }
            },
            {
              path: 'funds',
              name: 'funds',
              component: () => import('@/views/market/Funds.vue'),
              meta: { title: '基金行情' }
            }
          ]
        },
        {
          path: 'analysis',
          name: 'analysis',
          component: () => import('@/views/analysis/index.vue'),
          meta: { title: '财务分析' },
          children: [
            {
              path: 'financial',
              name: 'financial',
              component: () => import('@/views/analysis/Financial.vue'),
              meta: { title: '财务指标' }
            },
            {
              path: 'report',
              name: 'report',
              component: () => import('@/views/analysis/Report.vue'),
              meta: { title: '分析报告' }
            }
          ]
        }
      ]
    }
  ]
})

export default router