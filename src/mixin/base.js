export default {
  data() {
    return {
      // 表單驗證
      dataRules: (v) => !!v || 'Required',
      // listRules: (v) => v.length !== 0 || 'Required',
      // TokenAmountRules: [
      //   (v) => !!v || 'Required',
      //   (v) => /^[0-9]/.test(v) || 'Number Only',
      //   (v) => v > 0 || 'Cannot Be Negative',
      // ],
      accountRules: [
        (v) => !!v || 'Required',
        (v) => /0x[\w]{40}/.test(v) || 'Please Enter Correct Address',
        (v) => v.length === 42 || 'Please Enter Correct Address',
      ],
      // TokenAmountRulesNoRequired: [
      //   (v) => /^[0-9]/.test(v) || 'Number Only',
      //   (v) => v > 0 || 'Cannot Be Negative',
      // ],
      // rateRules: [
      //   (v) => v >= 0.001 || 'Must Higher Than 0.1%',
      //   (v) => v <= 1 || 'No More Than 100%',
      // ],
    };
  },
  methods: {
    // timestampToDate(timestamp){
    //   let time = new Date(timestamp)
    //   let year = time.getFullYear()
    //   let month = time.getMonth() + 1
    //   let date = time.getDate()
    //   return `${year}-${month<10?`0${month}`:month}-${date<10?`0${date}`:date}`
    // },
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
    // timestampToFirstDayofMonth(timestamp){
    //   let time = new Date(timestamp)
    //   let year = time.getFullYear()
    //   let month = time.getMonth() + 1
    //   return `${year}-${month<10?`0${month}`:month}-01`
    // },
    // convertShortAddress(address){
    //   return `${address.slice(0, 6)}...${address.slice(38)}`
    // },
    
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
      let isBsc
      // if (this.$store.state.version === 'staging') {
        // isBsc = chainId === '0x61' || chainId === 97
      // } else {
        isBsc = chainId === '0x38' || chainId === 56
      // }
      this.$store.commit('updateChainId', isBsc);
      if (!isBsc){
        this.$toasted.error('請切換到幣安智能鏈');
      }
    },
  },
};
