import Vue from 'vue'
import Router from 'vue-router'
import AuthLayout from '@/layouts/Auth'
import MainLayout from '@/layouts/Main'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  base: process.env.BASE_URL,
  // mode: 'history',
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      redirect: 'ecommerce/dashboard',
      component: MainLayout,
      meta: {
        authRequired: true,
        hidden: true,
      },
      children: [
        {
          path: '/customer',
          meta: {
            title: 'Customer Dashboard',
          },
          component: () => import('./views/customer'),
        },
        {
          path: '/category/list',
          meta: {
            title: 'Category Dashboard',
          },
          component: () => import('./views/category'),
        },
        {
          path: '/report',
          meta: {
            title: 'Report Dashboard',
          },
          component: () => import('./views/report'),
        },
        {
          path: '/section/list',
          meta: {
            title: 'Category Dashboard',
          },
          component: () => import('./views/section'),
        },
        {
          path: '/location',
          meta: {
            title: 'Location Dashboard',
          },
          component: () => import('./views/location'),
        },
        {
          path: '/service-area/list',
          meta: {
            title: 'ServiceArea Dashboard',
          },
          component: () => import('./views/servicearea'),
        },
        {
          path: '/order/list',
          meta: {
            title: 'Orders Dashboard',
          },
          component: () => import('./views/order'),
        },
        {
          path: '/product/list',
          meta: {
            title: 'Products Dashboard',
          },
          component: () => import('./views/products'),
        },
        {
          path: '/asset/list',
          meta: {
            title: 'Assets Dashboard',
          },
          component: () => import('./views/assets'),
        },
        {
          path: '/offer',
          meta: {
            title: 'Offers Dashboard',
          },
          component: () => import('./views/offer'),
        },
        // Ecommerce
        {
          path: '/ecommerce/dashboard',
          meta: {
            title: 'Ecommerce Dashboard',
          },
          component: () => import('./views/ecommerce/dashboard'),
        },
        {
          path: '/ecommerce/orders',
          meta: {
            title: 'Ecommerce Orders',
          },
          component: () => import('./views/ecommerce/orders'),
        },
        {
          path: '/ecommerce/product-catalog',
          meta: {
            title: 'Ecommerce Product Catalog',
          },
          component: () => import('./views/ecommerce/product-catalog'),
        },
        {
          path: '/ecommerce/product-details',
          meta: {
            title: 'Ecommerce Product Details',
          },
          component: () => import('./views/ecommerce/product-details'),
        },
        {
          path: '/ecommerce/cart',
          meta: {
            title: 'Ecommerce Cart',
          },
          component: () => import('./views/ecommerce/cart'),
        },
      ],
    },

    // System Pages
    {
      path: '/auth',
      component: AuthLayout,
      redirect: 'auth/login',
      children: [
        {
          path: '/auth/404',
          meta: {
            title: 'Error 404',
          },
          component: () => import('./views/auth/404'),
        },
        {
          path: '/auth/500',
          meta: {
            title: 'Error 500',
          },
          component: () => import('./views/auth/500'),
        },
        {
          path: '/auth/login',
          meta: {
            title: 'Sign In',
          },
          component: () => import('./views/auth/login'),
        },
        {
          path: '/auth/register',
          meta: {
            title: 'Sign Up',
          },
          component: () => import('./views/auth/register'),
        },
        {
          path: '/auth/forgot-password',
          meta: {
            title: 'Forgot Password',
          },
          component: () => import('./views/auth/forgot-password'),
        },
        {
          path: '/auth/lockscreen',
          meta: {
            title: 'Lockscreen',
          },
          component: () => import('./views/auth/lockscreen'),
        },
      ],
    },

    // Redirect to 404
    {
      path: '*',
      redirect: 'auth/404',
      hidden: true,
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.authRequired)) {
    if (!store.state.user.authorized) {
      next({
        path: '/auth/login',
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
