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
    rpcUrl: '',
    backendUrl: 'https://defi-v2.api-absolute-uv.com',
    backendVersion: '/api/v1',
    defiAddress: '',
    tbtAddress: '',
    // version: 'staging',
    // isWhitelist: false,
    // isMember: false,
    // interestTokens: [],
    // depositTokens: [],
    // dialogShow: {
    //   isShow: false,
    //   type: ''
    // },
    loading: {
      isShow: false,
      text: ''
    },
    tokenPairs: [
      'EGT/TBT',
      'EGT/USDT',
    ],
    currTokenPair: 'EGT/TBT',
    pageItems: [
      10,
      20,
      50,
    ],
    ethPrice: 0,
    sidebarClose: true,
  },
  getters: {
    basicToken(state) {
      return state.currTokenPair.split('/')[1]
    },
    borrowToken(state) {
      return state.currTokenPair.split('/')[0]
    },
  },
  mutations: {
    // chain data
    updateRpcUrl(state, rpcUrl){
      state.rpcUrl = rpcUrl
    },
    updateContractAddress(state, contract){
      state.defiAddress = contract.usdt_v2
      state.tbtAddress = contract.tbt_v2
    },
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
    updateLoading(state, loading) {
      state.loading = loading
    },
    // updateInterestTokens(state, tokens){
    //   state.interestTokens = tokens
    // },
    // updateDepositTokens(state, tokens){
    //   state.depositTokens = tokens
    // },
    updateEthPrice(state, ethPrice){
      state.ethPrice = ethPrice
    },
    updateSidebarClose(state, sidebarClose){
      state.sidebarClose = sidebarClose
    },
    updateCurrTokenPair(state, currTokenPair){
      state.currTokenPair = currTokenPair
    },
  },
  actions: {
    // chain data
    async getRpcUrlAndAddress({ state, commit }){
      let result = await Vue.axios.get(`${state.backendUrl}${state.backendVersion}/url`)
      if (result.data.status === 200) {
        commit('updateRpcUrl', result.data.data.url)
        commit('updateContractAddress', result.data.data)
      } else {
        commit('updateRpcUrl', 'https://bscrpc.com')
      }
    },
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
    // whitelist
    async getWhitelistList({ state }, data){
      const tag = data.tag ? `?tag=tag&key=${data.tag}` : ''
      let result = await Vue.axios.get(`${state.backendUrl}${state.backendVersion}/whitelist/list${tag}`, {
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      return result.data
    },
    async addWhitelist({ state }, data){
      let result = await Vue.axios.post(`${state.backendUrl}${state.backendVersion}/whitelist/create`, data, {
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      return result.data
    },
    async updateWhitelistInfo({ state }, data){
      let result = await Vue.axios.patch(`${state.backendUrl}${state.backendVersion}/whitelist/update`, data, {
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      return result.data
    },
    async deleteWhitelist({ state }, data){
      let result = await Vue.axios.delete(`${state.backendUrl}${state.backendVersion}/whitelist/delete`, {
        data: data,
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      return result.data
    },
    // whitelist tag
    async getWhitelistTagList({ state }){
      let result = await Vue.axios.get(`${state.backendUrl}${state.backendVersion}/whitelist/tag`, {
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      return result.data
    },
    async addWhitelistTag({ state }, data){
      let result = await Vue.axios.post(`${state.backendUrl}${state.backendVersion}/whitelist/create_tag`, data, {
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      return result.data
    },
    async deleteWhitelistTag({ state }, data){
      let result = await Vue.axios.delete(`${state.backendUrl}${state.backendVersion}/whitelist/delete_tag`, {
        data: data,
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      return result.data
    },
    // admin list
    async getAdminList({ state }, data){
      const auth = data.auth ? `?tag=permission&key=${data.auth}` : ''
      let result = await Vue.axios.get(`${state.backendUrl}${state.backendVersion}/admin/list${auth}`, {
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      return result.data
    },
    async getAuthorityList({ state }){
      let result = await Vue.axios.get(`${state.backendUrl}${state.backendVersion}/admin/tag`, {
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      return result.data
    },
    async updateAdminAuth({ state }, data){
      let result = await Vue.axios.patch(`${state.backendUrl}${state.backendVersion}/admin/update_permission`, data, {
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      return result.data
    },
    async addAdmin({ state }, data){
      let result = await Vue.axios.post(`${state.backendUrl}${state.backendVersion}/admin/create`, data, {
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      return result.data
    },
    async deleteAdmin({ state }, data){
      let result = await Vue.axios.delete(`${state.backendUrl}${state.backendVersion}/admin/delete`, {
        data: data,
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      return result.data
    },
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
    async getEthPrice({commit}){
      try {
        let result = await Vue.axios.get(`https://pro-api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_last_updated_at=true&x_cg_pro_api_key=CG-JC54SgmUabpyX94wxVDmLffX`)
        commit('updateEthPrice', result.data.ethereum.usd)
      } catch (error) {
        commit('updateEthPrice', 0)
      }
    },
    // async getTokenPrice(_, data){
    //   let result = await Vue.axios.get(`https://pro-api.coingecko.com/api/v3/simple/price?ids=${data.token}&vs_currencies=${data.currency}&include_last_updated_at=true&x_cg_pro_api_key=CG-JC54SgmUabpyX94wxVDmLffX`)
    //   return result.data
    // },
    async getLoaningOrder({state}, data){
      const lender = data.lender ? `&lender=${data.lender}` : ''
      const borrower = data.borrower ? `&borrower=${data.borrower}` : ''
      const settle = data.settle ? `&settle_status=${data.settle}` : ''
      const startTime = data.startTime ? `&settle_time_start=${data.startTime}` : ''
      const endTime = data.endTime ? `&settle_time_end=${data.endTime}` : ''
      const countdownStartTime = data.countdownStartTime ? `&start_time=${data.countdownStartTime}` : ''
      const countdownEndTime = data.countdownEndTime ? `&end_time=${data.countdownEndTime}` : ''
      let result = await Vue.axios.get(`${state.backendUrl}${state.backendVersion}/order/ordering?basic_token=${data.basicToken.toLowerCase()}&borrow_token=${data.borrowToken.toLowerCase()}${lender}${borrower}${settle}${startTime}${endTime}${countdownStartTime}${countdownEndTime}`, {
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      return result.data
    },
    async getPendingOrder({state}, data){
      const lender = data.lender ? `&lender=${data.lender}` : ''
      const borrower = data.borrower ? `&borrower=${data.borrower}` : ''
      let result = await Vue.axios.get(`${state.backendUrl}${state.backendVersion}/order/unmatched?basic_token=${data.basicToken.toLowerCase()}&borrow_token=${data.borrowToken.toLowerCase()}${lender}${borrower}`, {
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      return result.data
    },
    async getCloseOrder({state}, data){
      const lender = data.lender ? `&lender=${data.lender}` : ''
      const borrower = data.borrower ? `&borrower=${data.borrower}` : ''
      const settle = data.settle ? `&settle_status=${data.settle}` : ''
      let result = await Vue.axios.get(`${state.backendUrl}${state.backendVersion}/order/complete?basic_token=${data.basicToken.toLowerCase()}&borrow_token=${data.borrowToken.toLowerCase()}${lender}${borrower}${settle}`, {
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      return result.data
    },
  },
  modules: {}
})
