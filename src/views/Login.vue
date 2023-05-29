<template>
  <div class="primary admin-login white--text d-flex flex-md-row flex-column justify-center align-center pt-15">
    <div class="logo-block d-flex flex-md-row flex-column align-center">
      <img class="mr-5" src="@/assets/img/logo.png" alt="logo" width="100px">
      <div>
        <div class="rem-8">Absolute DEFI</div>
        <div class="rem-md-20 rem-10">智能合約借貸應用</div>
      </div>
    </div>

    <div class="login-block d-flex flex-column justify-center align-center w-full">
      <textField label="請輸入帳號" :inputText.sync="account" :rules="[dataRules]"></textField>
      <btn :buttonText="'登入'" width="100%" color="lightOrange" @clickBtn="login()"></btn>
    </div>
  </div>
</template>
<script>
import textField from '@/components/textField.vue'
import btn from '@/components/btn.vue'
import base from '@/mixin/base'
export default {
  mixins: [base],
  data() {
    return {
      account: ''
    }
  },
  components:{
    textField,
    btn
  },
  methods: {
    async login(){
      if (this.account) {
        if (window.ethereum) {
          await this.connectMetamask()
          let result = await this.$store.dispatch('login', {
            account: this.account,
            address: (window.ethereum.selectedAddress).toLowerCase()
          })

          if (result.status === 200) {
            await this.$store.dispatch('getUserInfo')
            this.$router.push({name: 'Home'})
          }
        } else {
          window.addEventListener('ethereum#initialized', this.connectMetamask, {
            once: true,
          });

          // If the event is not dispatched by the end of the timeout,
          // the user probably doesn't have MetaMask installed.
          setTimeout(this.connectMetamask, 2000); // 3 seconds
        }
        this.$forceUpdate()
      }
    },
  },
  created() {
    if (this.$store.state.token && this.$store.state.account) {
      this.$router.push({name: 'Home'})
    }
  }
}
</script>
<style lang="scss">
.admin-login {
  min-height: 100vh;
  .logo-block {
    margin-right: 12%;
    @include dai_vuetify_md {
      margin-right: 0;
      margin-bottom: 86px;
    }
  }
  .login-block {
    max-width: 330px;
  }
}
</style>