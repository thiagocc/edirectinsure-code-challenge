import { AuthLayout, DefaultLayout } from '@/components/layouts'

export const publicRoute = [
  {
    path: '*',
    component: () =>
      import(/* webpackChunkName: "errors" */ '@/views/error/NotFound.vue'),
  },
  {
    path: '/auth',
    component: AuthLayout,
    meta: {
      title: 'Login',
    },
    redirect: '/auth/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        meta: {
          title: 'Login',
        },
        component: () =>
          import(/* webpackChunkName: "login" */ '@/views/auth/Login.vue'),
      },
    ],
  },

  {
    path: '/404',
    name: '404',
    meta: {
      title: 'Not Found',
    },
    component: () =>
      import(/* webpackChunkName: "errors" */ '@/views/error/NotFound.vue'),
  },
  {
    path: '/403',
    name: '403',
    meta: {
      title: 'Access Denied',
    },
    component: () =>
      import(/* webpackChunkName: "errors" */ '@/views/error/Deny.vue'),
  },

  {
    path: '/500',
    name: '500',
    meta: {
      title: 'Server Error',
    },
    component: () =>
      import(/* webpackChunkName: "errors" */ '@/views/error/Error.vue'),
  },
]

export const protectedRoute = [
  {
    path: '/',
    component: DefaultLayout,
    meta: {
      title: 'Home',
      group: 'apps',
      icon: '',
    },
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        meta: {
          title: 'Dashboard',
          group: 'apps',
          icon: 'dashboard',
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
      },
    ],
  },
]
