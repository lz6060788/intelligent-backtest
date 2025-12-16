import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'

import HomeView from '@/view/HomeView.vue'
import StrategysView from '@/view/StrategysView.vue'
import StrategyDetailVue from '@/view/StrategyDetail.vue'
import TestView from '@/view/TestView.vue'
import ScreenerView from '@/view/ScreenerView.vue'
import StrategyListView from '@/view/StrategyListView.vue'
import TradingView from '@/view/TradingView.vue'
import CommunityView from '@/view/CommunityView.vue'
import ScreenerDetailView from '@/view/ScreenerDetailView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: () => {
      return { path: '/strategy/detail/1' }
    },
    // component: HomeView
  },
  {
    path: '/screener',
    name: 'screener',
    component: ScreenerView
  },
  {
    path: '/screener-detail/:id',
    name: 'screener-detail',
    component: ScreenerDetailView
  },
  {
    path: '/strategy-list',
    name: 'strategy-list',
    component: StrategyListView
  },
  {
    path: '/strategy-detail/:id',
    name: 'strategy-detail',
    component: StrategyDetailVue
  },
  {
    path: '/trading',
    name: 'trading',
    component: TradingView
  },
  {
    path: '/community',
    name: 'community',
    component: CommunityView
  },
  {
    path: '/test',
    name: 'test',
    component: TestView
  },
  {
    path: '/strategy',
    name: 'strategy',
    redirect: () => {
      return { path: '/' }
    },
    children: [
      {
        path: '',
        name: 'strategys',
        component: StrategysView
      },
      {
        path: 'detail/:id',
        name: 'detail',
        component: StrategyDetailVue
      },
    ]
  },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router;
