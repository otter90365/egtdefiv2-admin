import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
// import app from '../main'
import Toasted from 'vue-toasted';

// // contract
// import Vault from '../plugins/defi'
// import Token from '../plugins/token'
// import { egtAddress, usdtAddress } from '@/assets/contract.js'

// import jwt_decode from "jwt-decode";
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
      requiresAuth: true,
      auth: 0
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false },
  },
  // {
  //   path: '/whitelist',
  //   name: 'Whitelist',
  //   component: () => import('../views/Whitelist.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     auth: 1
  //   },
  // },
  // order
  {
    path: '/order/loaning',
    name: 'Order-Loaning',
    component: () => import('../views/Order/Loaning.vue'),
    meta: {
      requiresAuth: true,
      auth: 4
    },
  },
  {
    path: '/order/pending',
    name: 'Order-Pending',
    component: () => import('../views/Order/Pending.vue'),
    meta: {
      requiresAuth: true,
      auth: 4
    },
  },
  {
    path: '/order/close',
    name: 'Order-Close',
    component: () => import('../views/Order/Close.vue'),
    meta: {
      requiresAuth: true,
      auth: 4
    },
  },
  // // analyze
  // {
  //   path: '/analyze',
  //   name: 'Analyze',
  //   component: () => import('../views/Analyze/index.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     auth: 2
  //   },
  // },
  // {
  //   path: '/analyze/:interestToken/:depositToken',
  //   name: 'Analyze-Token',
  //   component: () => import('../views/Analyze/token.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     auth: 2
  //   },
  // },
  // {
  //   path: '/analyze/:interestToken/:depositToken/details',
  //   name: 'Analyze-Token-Details',
  //   component: () => import('../views/Analyze/details.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     auth: 2
  //   },
  // },
  // {
  //   path: '/authority',
  //   name: 'Authority',
  //   component: () => import('../views/Authority.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     auth: 3
  //   },
  // },
  // // rate setting
  // {
  //   path: '/rate-setting',
  //   name: 'RateSetting',
  //   component: () => import('../views/RateSetting/index.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     auth: 0
  //   },
  // },
  // {
  //   path: '/rate-setting/:interestToken/:depositToken',
  //   name: 'RateSettingRecord',
  //   component: () => import('../views/RateSetting/history.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     auth: 0
  //   },
  // },
  // {
  //   path: '/rate-setting/:interestToken/:depositToken/edit',
  //   name: 'RateSettingEdit',
  //   component: () => import('../views/RateSetting/edit.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     auth: 0
  //   },
  // },
  // {
  //   path: '/no-auth',
  //   name: 'noAuth',
  //   component: () => import('../views/noAuth.vue'),
  //   meta: { requiresAuth: false },
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach(async (to, from, next) => {
  // // Get chain data if no data
  // try {
  //   await store.dispatch('getRpcUrl')
  // }catch(error) {
  //   store.commit('updateRpcUrl', 'https://rpc-mumbai.matic.today')
  //   console.log('error', error)
  // }

  // if (!store.state.vaultAddress){
  //   try {
  //     await store.dispatch('getContractAddress')
  //     Vue.prototype.$vault = new Vault();
  //   }catch(error) {
  //     console.log('error', error)
  //   }
  // }

  // // Get other data if no data
  // if (!store.state.interestTokens.length || !store.state.depositTokens.length) {
  //   try{
  //     await store.dispatch('getVaultTokenPair')
  //   }catch(error){
  //     console.log('error', error)
  //   }
  // }

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
    // // 未註冊
    // } else if (!store.state.isMember) {
    //   if (from.name !== 'Home') next({ name: 'Home', params: {lang: from.params.lang} });
    //   store.commit('updateDialog', {isShow: true, type: 'register'})
    } else {
      next(); // 往下繼續執行
    }
  } else {
    next(); // 往下繼續執行
  }
});

// router.afterEach(async (to) => {
  
// });


export default router
