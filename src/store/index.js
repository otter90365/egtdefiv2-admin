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
    nowWidth: 0,
    rpcUrl: '',
    backendUrl: 'https://defi-v2.api-absolute-uv.com',
    backendVersion: '/api/v1',
    usdtAddress: '',
    tbtAddress: '',
    // version: 'staging',
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
      state.usdtAddress = contract.usdt_v2
      state.tbtAddress = contract.tbt_v2
    },
    updateChainId(state, chainId){
      state.chainId = chainId
    },
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
    // app data
    updateNowWidth(state, nowWidth){
      state.nowWidth = nowWidth
    },
    updateLoading(state, loading) {
      state.loading = loading
    },
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
    async getWhitelistList({ state, getters }, data){
      const tag = data.tag ? `&tag=tag&key=${data.tag}` : ''
      let result = await Vue.axios.get(`${state.backendUrl}${state.backendVersion}/whitelist/list?contract_tag=${getters.basicToken.toLowerCase()}${tag}`, {
        headers: {
          authorization: `Berear ${state.token}`
        }
      })
      return result.data
    },
    async addWhitelist({ state, getters }, data){
      data.contract_tag = getters.basicToken.toLowerCase()
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
    async getEthPrice({commit}){
      try {
        let result = await Vue.axios.get(`https://pro-api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_last_updated_at=true&x_cg_pro_api_key=CG-JC54SgmUabpyX94wxVDmLffX`)
        commit('updateEthPrice', result.data.ethereum.usd)
      } catch (error) {
        commit('updateEthPrice', 0)
      }
    },
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
