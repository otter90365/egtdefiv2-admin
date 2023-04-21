export default {
  data() {
    return {
//       web3: null,
      // 表單驗證
      dataRules: (v) => !!v || 'Required',
//       listRules: (v) => v.length !== 0 || 'Required',
//       TokenAmountRules: [
//         (v) => !!v || 'Required',
//         (v) => /^[0-9]/.test(v) || 'Number Only',
//         (v) => v > 0 || 'Cannot Be Negative',
//       ],
//       accountRules: [
//         (v) => !!v || 'Required',
//         (v) => /0x[\w]{40}/.test(v) || 'Please Enter Correct Address',
//         (v) => v.length === 42 || 'Please Enter Correct Address',
//       ],
//       voteRules: [
//         (v) => v <= 300 || 'No More Than 300',
//         (v) => v >= 10 || 'Must Higher Than 10',
//       ],
//       TokenAmountRulesNoRequired: [
//         (v) => /^[0-9]/.test(v) || 'Number Only',
//         (v) => v > 0 || 'Cannot Be Negative',
//       ],
//       rateRules: [
//         (v) => v >= 0.001 || 'Must Higher Than 0.1%',
//         (v) => v <= 1 || 'No More Than 100%',
//       ],
//       monthMap: {
//         1: 'jan',
//         2: 'feb',
//         3: 'mar',
//         4: 'apr',
//         5: 'may',
//         6: 'jun',
//         7: 'jul',
//         8: 'aug',
//         9: 'sep',
//         10: 'oct',
//         11: 'nov',
//         12: 'dec',
//       },
//       price: {
//         egt: 0
//       },
//       tabItems: [
//         {text: '存本量', value: 0},
//         {text: '提本量', value: 1},
//         {text: '存息量', value: 2},
//         {text: '提息量', value: 3},
//       ],
//       currTab: 0,
//       currData: {
//         0: [],
//         1: [],
//         2: [],
//         3: [],
//       },
    };
  },
//   computed: {
//     totalAmount() {
//       return Object.keys(this.currData).map(item => {
//         return this.currData[item].reduce(
//           (accumulator, currentValue) => accumulator + currentValue.total_balance,
//           0
//         )
//       })
//     }
//   },
  methods: {
//     timestampToDate(timestamp){
//       let time = new Date(timestamp)
//       let year = time.getFullYear()
//       let month = time.getMonth() + 1
//       let date = time.getDate()
//       return `${year}-${month<10?`0${month}`:month}-${date<10?`0${date}`:date}`
//     },
    timestampToTime(timestamp){
      let time = new Date(timestamp)
      let year = time.getFullYear()
      let month = time.getMonth() + 1
      let date = time.getDate()
      let hour = time.getHours()
      let min = time.getMinutes()
      let sec = time.getSeconds()

      return `${year}-${month<10?`0${month}`:month}-${date<10?`0${date}`:date} ${hour<10?`0${hour}`:hour}:${min<10?`0${min}`:min}:${sec<10?`0${sec}`:sec}`
    },
//     timestampToFirstDayofMonth(timestamp){
//       let time = new Date(timestamp)
//       let year = time.getFullYear()
//       let month = time.getMonth() + 1
//       return `${year}-${month<10?`0${month}`:month}-01`
//     },
//     convertShortAddress(address){
//       return `${address.slice(0, 6)}...${address.slice(38)}`
//     },
//     // analyze
//     async updateDepositTokenPrice() {
//       let data = {}
//       await this.$store.state.depositTokens.forEach(async (item) => {
//         data.token = item.token === 'egt' || item.token === 'eth' ? 'ethereum' : item.token
//         data.currency = 'usd'
//         let result = await this.$store.dispatch('getTokenPrice', data)
//         if (item.token === 'egt') {
//           this.price[item.token] = result[data.token][data.currency] / 1000
//         } else {
//           this.price[item.token] = result[data.token][data.currency]
//         }
//       })
//     },
//     async getTokenDetails() {
//       let dateRange = []
//       const startTime = Date.parse(this.startDate) / 1000 / 60
//       const endTime = Date.parse(this.endDate) / 1000 / 60
//       for (let i=startTime; i<=endTime; i+=60*24) {
//         dateRange.push(i);
//       }
      
//       let result

//       // 存本
//       result = await this.$store.dispatch('getTokenDailyDetail', {
//         token: this.$route.params.depositToken,
//         status: true,
//         day: dateRange,
//       })
      
//       if (result.status === 200) {
//         this.currData[0] = result.data
//       } else {
//         this.currData[0] = []
//       }

//       // 提本
//       result = await this.$store.dispatch('getTokenDailyDetail', {
//         token: this.$route.params.depositToken,
//         status: false,
//         day: dateRange,
//       })
      
//       if (result.status === 200) {
//         this.currData[1] = result.data
//       } else {
//         this.currData[1] = []
//       }

//       // 存息
//       result = await this.$store.dispatch('getInterestTokenDailyDetail', {
//         token: this.$route.params.depositToken,
//         status: true,
//         day: dateRange,
//       })
      
//       if (result.status === 200) {
//         this.currData[2] = result.data
//       } else {
//         this.currData[2] = []
//       }
      
//       // 提息
//       result = await this.$store.dispatch('getInterestTokenDailyDetail', {
//         token: this.$route.params.depositToken,
//         status: false,
//         day: dateRange,
//       })
      
//       if (result.status === 200) {
//         this.currData[3] = result.data
//       } else {
//         this.currData[3] = []
//       }
//     },


    // wallet
    async connectMetamask() {
      let _this = this
      if (window.ethereum){
        window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then(_this.handleAccountsChanged)
          .catch((err) => {
            if (err.code === 4001) {
              // EIP-1193 userRejectedRequest error
              // If this happens, the user rejected the connection request.
              this.$toasted.error('Please connect to MetaMask.');
            } else {
              console.error(err);
            }
          });
      }else{
        this.$toasted.error('請安裝 MetaMask')
      }
    },
    async handleAccountsChanged(accounts){
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        this.$toasted.error('Please connect to MetaMask.');
      } else if (accounts[0] !== this.$store.state.account) {
        this.$store.commit('updateAccount', accounts[0]);
        this.$cookies.set('address', accounts[0]);
        // window.location.reload()
      }
    },
    checkChainId(chainId){
      // let isEthereum = chainId === '0x1' || chainId === 1
      // let isEthereum = chainId === '0x4' || chainId === 4

      let isBsc
      // if (this.$store.state.version === 'staging') {
        isBsc = chainId === '0x61' || chainId === 97
      // } else {
      //   isBsc = chainId === '0x38' || chainId === 56
      // }
      // let isPol = chainId === '0x89' || chainId === 137
      // let isPol = chainId === '0x13881' || chainId === 80001
      this.$store.commit('updateChainId', isBsc);
      // this.$store.commit('updateIsEth', isEthereum);
      if (!isBsc){
        this.$toasted.error('請切換到幣安智能鏈');
      }
    },
  },
};
