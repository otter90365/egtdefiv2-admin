import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Toasted from 'vue-toasted';

// contract
import EgtDefi from '../plugins/defi'

const cookies = require('vue-cookies')
Vue.use(VueRouter)
Vue.use(cookies);
Vue.use(Toasted, {
  // router,
  position: 'top-center',
  duration: 2000,
});

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      requiresAuth: false,
      // auth: 0
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/whitelist',
    name: 'Whitelist',
    component: () => import('../views/Whitelist.vue'),
    meta: {
      requiresAuth: true,
      auth: 2
    },
  },
  // order
  {
    path: '/order/loaning',
    name: 'Order-Loaning',
    component: () => import('../views/Order/Loaning.vue'),
    meta: {
      requiresAuth: true,
      auth: 3
    },
  },
  {
    path: '/order/pending',
    name: 'Order-Pending',
    component: () => import('../views/Order/Pending.vue'),
    meta: {
      requiresAuth: true,
      auth: 3
    },
  },
  {
    path: '/order/close',
    name: 'Order-Close',
    component: () => import('../views/Order/Close.vue'),
    meta: {
      requiresAuth: true,
      auth: 3
    },
  },
  {
    path: '/authority',
    name: 'Authority',
    component: () => import('../views/Authority.vue'),
    meta: {
      requiresAuth: true,
      auth: 1
    },
  },
  {
    path: '/no-auth',
    name: 'noAuth',
    component: () => import('../views/noAuth.vue'),
    meta: { requiresAuth: false },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach(async (to, from, next) => {
  // Get chain data if no data
  try {
    await store.dispatch('getRpcUrlAndAddress')
    Vue.prototype.$defi = new EgtDefi();
  }catch(error) {
    store.commit('updateRpcUrl', 'https://bscrpc.com')
    console.log('error', error)
  }

  // Get user info from cookies
  try{
    let token = Vue.$cookies.get('token')
    if (token != undefined) {
      if ( store.state.token === '' ){
        try{
          store.commit('updateToken', token)
          await store.dispatch('getUserInfo')
        }catch(error){
          console.log('error', error)
          store.commit('clearInfo')
          Vue.$cookies.remove('address')
          Vue.$cookies.remove('token')
          next({name: 'Login'});
        }
      }
    }
  }catch(error){
    console.log('error', error)
    next();
  }

  // Get user info from cookies
  try{
    let address = Vue.$cookies.get('address')
    if (address != undefined) {
      if ( store.state.account === '' ){
        try{
          store.commit('updateAccount', address)
        }catch(error){
          console.log('error', error)
        }
      }
    }
  }catch(error){
    console.log('error', error)
    next();
  }

  // 如果 router 轉跳的頁面需要驗證 requiresAuth: true
  if (to.matched.some(record => {
    // console.log(record.name, record.meta.requiresAuth);
    return record.meta.requiresAuth;
  })) {
    // 未登入
    if (store.state.token === '' || store.state.account === ''){
      try{
        if (from.name !== 'Login') next({ name: 'Login' });
        Vue.toasted.error('請先登入')
      }catch(error){
        console.log('error', error)
      }
    // 權限不足
    } else if (!store.state.userInfo.permission.includes(to.matched[0].meta.auth)) {
      next({name: 'noAuth'});
    } else {
      next(); // 往下繼續執行
    }
  } else {
    next(); // 往下繼續執行
  }
});

export default router
