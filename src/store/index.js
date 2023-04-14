import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios);

export default new Vuex.Store({
  state: {
    account: '',
    token: '',
    chainId: false,
    // isEth: false,
    // locale: 'tw',
    // langs: ['tw'],
    nowWidth: 0,
    // rpcUrl: '',
    backendUrl: 'https://defi-v2.api-absolute-uv.com',
    backendVersion: '/api/v1',
    // vaultAddress: '', // cd
    // version: 'staging',
    // isWhitelist: false,
    // isMember: false,
    // interestTokens: [],
    // depositTokens: [],
    // dialogShow: {
    //   isShow: false,
    //   type: ''
    // },
    // loading: {
    //   isShow: false,
    //   text: ''
    // },
  },
  mutations: {
    // // chain data
    // updateRpcUrl(state, rpcUrl){
    //   state.rpcUrl = rpcUrl
    // },
    // updateContractAddress(state, contract){
    //   state.vaultAddress = contract.cd
    //   state.version = contract.version
    // },
    updateChainId(state, chainId){
      state.chainId = chainId
    },
    // updateIsEth(state, isEth){
    //   state.isEth = isEth
    // },
    // user data
    updateAccount(state, account){
      state.account = account
    },
    updateToken(state, token){
      state.token = token
    },
    updateUserInfo(state, userInfo){
      state.userInfo = userInfo
    },
    clearInfo(state){
			state.userInfo = {}
			state.account = ''
			state.token = ''
    },
    // // app data
    // updateLang(state, lang){
    //   state.locale = lang
    // },
    updateNowWidth(state, nowWidth){
      state.nowWidth = nowWidth
    },
    // updateDialog(state, data) {
    //   state.dialogShow = data
    // },
    // updateLoading(state, loading) {
    //   state.loading = loading
    // },
    // updateInterestTokens(state, tokens){
    //   state.interestTokens = tokens
    // },
    // updateDepositTokens(state, tokens){
    //   state.depositTokens = tokens
    // },
  },
  actions: {
    // // chain data
    // async getRpcUrl({ state, commit }){
    //   let result = await Vue.axios.get(`${state.backendUrl}${state.backendVersion}/rpc_url`)
    //   if (result.data.data && result.data.data.length) {
    //     if (result.data.data[0]) {
    //       commit('updateRpcUrl', result.data.data[0])
    //     }else {
    //       commit('updateRpcUrl', state.version === 'staging' ? 'https://data-seed-prebsc-1-s1.binance.org:8545' : 'https://bsc.getblock.io/mainnet/15db4d71-9556-49be-a956-ae738babec27/')
    //     }
    //   } else {
    //     commit('updateRpcUrl', state.version === 'staging' ? 'https://data-seed-prebsc-1-s1.binance.org:8545' : 'https://bsc.getblock.io/mainnet/15db4d71-9556-49be-a956-ae738babec27/')
    //   }
    // },
    // async getContractAddress({ state, commit }){
    //   let result = await Vue.axios.get(`${state.backendUrl}${state.backendVersion}/contract`)
    //   if (result.data.data) {
    //     commit('updateContractAddress', result.data.data)
    //   }
    // },
    // // app data
    // async getVaultTokenPair({ state, commit }){
    //   let interestTokens = []
    //   let depositTokens = []
    //   let result
    //   result = await Vue.axios.get(`${state.backendUrl}${state.backendVersion}/token_list/interest`)
    //   if (result.data.data.length) {
    //     result.data.data.forEach(item => {
    //       interestTokens.push({token: item.toLowerCase()})
    //     })
    //   }
    //   result = await Vue.axios.get(`${state.backendUrl}${state.backendVersion}/token_list/cd`)
    //   if (result.data.data.length) {
    //     result.data.data.forEach(item => {
    //       depositTokens.push({token: item.toLowerCase()})
    //     })
    //   }

    //   commit('updateInterestTokens', interestTokens)
    //   commit('updateDepositTokens', depositTokens)
    // },
    // user data
    async login({ state, commit }, res){
      let result = await Vue.axios.post(`${state.backendUrl}${state.backendVersion}/login`, res)
      if (result.data.status === 675) {
        Vue.toasted.error('帳號不存在')
      } else if (result.data.status === 686) {
        Vue.toasted.error('地址錯誤')
      } else if (result.data.status === 432) {
        Vue.toasted.error('帳號或連接錢包地址錯誤')
      } else {
        Vue.$cookies.set('token', result.data.data)
        commit('updateToken', result.data.data)
      }

      return result.data
    },
    async getUserInfo({ state, commit }){
      let result = await Vue.axios.get(`${state.backendUrl}${state.backendVersion}/admin/info`, {
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      commit('updateUserInfo', result.data.data)
    },
    // // whitelist
    // async getWhitelistList({ state }){
    //   let result = await Vue.axios.get(`${state.backendUrl}/admin${state.backendVersion}/white_list`, {
    //     headers: {
    //       authorization: `Berear ${state.token}`
    //     }
    //   })
    //   return result.data
    // },
    // async addWhitelistList({ state }, res){
    //   let result = await Vue.axios.post(`${state.backendUrl}/admin${state.backendVersion}/create_white_list`, res, {
    //     headers: {
    //       authorization: `Berear ${state.token}`
    //     }
    //   })
    //   return result.data
    // },
    // async deleteWhitelistList({ state }, res){
    //   let result = await Vue.axios.post(`${state.backendUrl}/admin${state.backendVersion}/delete_white_list`, res, {
    //     headers: {
    //       authorization: `Berear ${state.token}`
    //     }
    //   })
    //   return result.data
    // },
    // // admin list
    // async getAdminList({ state }){
    //   let result = await Vue.axios.get(`${state.backendUrl}/admin${state.backendVersion}/admin_list`, {
    //     headers: {
    //       authorization: `Berear ${state.token}`
    //     }
    //   })
    //   return result.data
    // },
    // async addAdminList({ state }, res){
    //   let result = await Vue.axios.post(`${state.backendUrl}/admin${state.backendVersion}/create_admin`, res, {
    //     headers: {
    //       authorization: `Berear ${state.token}`
    //     }
    //   })
    //   return result.data
    // },
    // async deleteAdminList({ state }, res){
    //   let result = await Vue.axios.post(`${state.backendUrl}/admin${state.backendVersion}/delete_admin`, res, {
    //     headers: {
    //       authorization: `Berear ${state.token}`
    //     }
    //   })
    //   return result.data
    // },
    // // rate setting
    // async getCurrRate({ state }){
    //   let result = await Vue.axios.get(`${state.backendUrl}/admin${state.backendVersion}/month_percent`, {
    //     headers: {
    //       authorization: `Berear ${state.token}`
    //     }
    //   })
    //   return result.data
    // },
    // async getRateHistory({ state }){
    //   let result = await Vue.axios.get(`${state.backendUrl}/admin${state.backendVersion}/set_month_percent_history`, {
    //     headers: {
    //       authorization: `Berear ${state.token}`
    //     }
    //   })
    //   return result.data
    // },
    // async setRate({ state }, data){
    //   let result = await Vue.axios.post(`${state.backendUrl}/admin${state.backendVersion}/set_month_percent`, data, {
    //     headers: {
    //       authorization: `Berear ${state.token}`
    //     }
    //   })
    //   return result.data
    // },
    // // analyze
    // // async getTokenBalance({ state }){
    // //   let result = await Vue.axios.get(`${state.backendUrl}/analyze${state.backendVersion}/home`, {
    // //     headers: {
    // //       authorization: `Berear ${state.token}`
    // //     }
    // //   })
    // //   return result.data
    // // },
    // async getTokenDailyDetail({ state }, data){
    //   let result = await Vue.axios.post(`${state.backendUrl}/analyze${state.backendVersion}/daily_token_detial`, data, {
    //     headers: {
    //       authorization: `Berear ${state.token}`
    //     }
    //   })
    //   return result.data
    // },
    // async getInterestTokenDailyDetail({ state }, data){
    //   let result = await Vue.axios.post(`${state.backendUrl}/analyze${state.backendVersion}/daily_token_interest_detial`, data, {
    //     headers: {
    //       authorization: `Berear ${state.token}`
    //     }
    //   })
    //   return result.data
    // },
    // async getTokenPrice(_, data){
    //   let result = await Vue.axios.get(`https://pro-api.coingecko.com/api/v3/simple/price?ids=${data.token}&vs_currencies=${data.currency}&include_last_updated_at=true&x_cg_pro_api_key=CG-JC54SgmUabpyX94wxVDmLffX`)
    //   return result.data
    // },
  },
  modules: {}
})
