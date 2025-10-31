import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'

import HomeView from '@/view/HomeView.vue'
import StrategysView from '@/view/StrategysView.vue'
import StrategyDetailVue from '@/view/StrategyDetail.vue'

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
