import Vue from 'vue'
import Router from 'vue-router'
import { publicRoute, protectedRoute } from './config'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { checkToken } from '@/api/users'
const routes = publicRoute.concat(protectedRoute)

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  linkActiveClass: 'active',
  routes: routes,
})

router.beforeEach((to, from, next) => {
  NProgress.start()

  if (to.path.indexOf('/auth') > -1 || to.path === '/403') {
    next()
  } else {
    checkToken()
      .then(cT => {
        next()
      })
      .catch(err => {
        NProgress.done()
        next('/auth/login')
      })
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
