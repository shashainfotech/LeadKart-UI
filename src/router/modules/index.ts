// src/router/modules/index.ts
// Temporary aggregator that consumes existing routes (to avoid breakage),
// but adds a catch-all 404 route. Later, split into feature modules.
import routes from '../routers'

const NotFound = () => import('@/view/Pages/pages/error-pages/page-404.vue')

export default [
  ...routes,
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
]
