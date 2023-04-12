<template>
  <v-app class="app" dark>
    <!-- <v-app-bar v-if="$route.name !== 'Login'"
      class="app-bar px-2"
      app
      dark
      color="darkGrey"
      height="60"
    >
      desktop
      <template v-if="$store.state.nowWidth > 960">
        <div class="d-flex align-center can-click" @click="isDrawer = !isDrawer">
          <v-img
            class="mr-2"
            src="@/assets/img/icon-menu.svg"
          />
        </div>

        <v-spacer></v-spacer>

        <div class="d-flex align-center">
          <template v-if="$store.state.userInfo">
            <div class="mr-10">管理者帳號 {{ $store.state.userInfo.account }}</div>
          </template>
          <btn class="no-padding-btn" isText :buttonText="$store.state.account? `${$store.state.nowWidth>960?`${shortAddress} 登出`:`登出`}` : `登入`" :color="'lightPrimary2'" @clickBtn="log()"></btn>
        </div>
      </template> -->

      <!-- mobile
      <template v-else>
        <v-icon @click="$router.go(-1)">mdi-chevron-left</v-icon>

        <v-spacer></v-spacer>

        {{ currPageTitle }}

        <v-spacer></v-spacer>

        <div class="d-flex align-center can-click" @click="isDrawer = !isDrawer">
          <v-img
            class="mr-2"
            src="@/assets/img/icon-menu.svg"
          />
        </div>
      </template>
    </v-app-bar>

    <v-navigation-drawer
      class="side-bar"
      v-model="isDrawer"
      fixed
      temporary
      width="200"
    >
      <div class="py-10 d-flex align-center">
        <img class="mr-3 ml-6" src="@/assets/img/logo.png" alt="logo" width="33px">
        <img src="@/assets/img/text-vault.svg">
      </div>
      <v-list nav class="pa-0">
        <v-btn
          v-for="nav in navList"
          :key="nav.link"
          color="transparent"
          depressed
          tile
          width="100%"
          height="48"
          class="white--text"
          :to="`/${nav.link}`"
        >
          {{ nav.text }}
        </v-btn>
        <v-list-item prepend-icon="mdi-email" title="Inbox" value="inbox"></v-list-item>
        <v-list-item prepend-icon="mdi-account-supervisor-circle" title="Supervisors" value="supervisors"></v-list-item>
        <v-list-item prepend-icon="mdi-clock-start" title="Clock-in" value="clockin"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main
      id="main"
      :class="{'mt-15 pb-md-16 px-md-3 py-md-2 pa-0': $route.name !== 'Login',
               'img-bg': $route.name !== 'Whitelist' && $route.name !== 'Authority'}"
    >
      <router-view />
    </v-main>

    <loading :loadingShow="$store.state.loading.isShow" :content="$store.state.loading.text"></loading> -->
  </v-app>
</template>

<script>
// import btn from '@/components/btn.vue';
// import loading from '@/components/loading.vue'
import base from '@/mixin/base'
export default {
  name: 'App',
  mixins: [base],
  data: () => ({
    isDrawer: false,
    navList: [
      {
        text: '白名單管理',
        link: 'whitelist'
      },
      {
        text: '戰情分析',
        link: 'analyze'
      },
      {
        text: '權限名單管理',
        link: 'authority'
      },
      {
        text: '利率參數設定',
        link: 'rate-setting'
      }
    ]
  }),
  components:{
    // btn,
    // loading
  },
  computed:{
    shortAddress(){
      return `${this.$store.state.account.slice(0, 6)}...${this.$store.state.account.slice(38)}`
    },
    currPageTitle() {
      let page = this.navList.find(item => (this.$route.path).includes(item.link))
      if (page) {
        return page.text
      } else {
        return ''
      }
    }
  },
  methods:{
    async log(){
      if (this.$store.state.token){
        this.$store.commit('clearInfo')
        this.$cookies.remove('address')
        this.$cookies.remove('token')
        this.$router.push({name: 'Login'})
      }else{
        if (window.ethereum) {
          await this.connectMetamask()
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
    // changeLang(lang){
    //   this.$store.commit('updateLang', lang)
    //   this.$i18n.locale = lang
    //   this.$router.push({ name: this.$route.name, params: {lang: lang, token: this.$route.params.token} });
    // },
  },
  async mounted(){
    // console.log('==========default==========')
    let _this = this

    this.$store.commit('updateNowWidth', document.body.clientWidth)
    window.onresize = () => {
      this.$store.commit('updateNowWidth', document.body.clientWidth)
    }

    if (window.ethereum){
      // metamask disconnect
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0){
          this.$store.commit('clearInfo')
          this.$cookies.remove('address')
          this.$cookies.remove('token')
          this.$router.push({name: 'Login'})

          this.$toasted.error('MetaMask 連接中斷，請重新登入')
        }else{
          if (this.$store.state.account) {
            this.$store.commit('clearInfo')
            this.$cookies.remove('address')
            this.$cookies.remove('token')
            this.$router.push({name: 'Login'})
          } else {
            this.$store.commit('updateAccount', accounts[0]);
            this.$cookies.set('address', accounts[0]);
            this.$toasted.show('已切換連接錢包');
            window.location.reload()
          }
        }
      });

      // get chain id
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      this.checkChainId(chainId)
      window.ethereum.on('chainChanged', _this.checkChainId);

      if (!window.ethereum.selectedAddress){
        let address = this.$cookies.get('address')
        if (address){
          this.$cookies.remove('address')
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import '../src/assets/scss/font.scss';
@import url('https://fonts.googleapis.com/css2?family=Share+Tech&family=Tauri&display=swap');
// layout
.app{
  cursor: default;
}
#main{
  &.img-bg {
    background: url('../src/assets/img/img-bg.svg') right 60px/cover no-repeat,
                radial-gradient(circle at 90%, #888 0%, #444 20%, #333 50%, #000 80%);
    background-blend-mode: multiply;
    @include dai_vuetify_sm {
      background: #313131;
    }
  }
}
.app-bar{
  background: linear-gradient(117.82deg, #535353 1.27%, #000000 74.01%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  @include dai_vuetify_sm {
    margin-left: 0;
  }
  .no-padding-btn{
    .v-btn:not(.v-btn--round).v-size--default{
      @include dai_vuetify_sm{
        min-width: 40px;
        padding: 0 10px;
      }
    }
  }
}

.side-bar {
  background-color: var(--v-darkGrey-base) !important;
  z-index: 9;
}

#footer {
  min-height: 60px;
  border-radius: 6px;
  border: #F0CD8F 1px solid;
  width: 95%;
  margin: 0 auto 20px;
  img.footer-pointer {
    position: absolute;
    bottom: -1px;
  }
}

.v-input.grey--text {
  input, .v-icon {
    color: var(--v-grey-base) !important;
    caret-color: var(--v-grey-base) !important;
  }
}

// analyze
.analyze-details, .analyze-token, .analyze-index {
  @include dai_vuetify_sm_min {
    max-width: 420px;
    background: radial-gradient(188.38% 188.38% at 50% -88.38%, rgba(99, 99, 99, 0.8) 0%, rgba(71, 71, 71, 0.8) 40.12%, rgba(49, 49, 49, 0.8) 100%);
    border-radius: 11px;
    margin: 40px auto;
  }

  .analyze-card {
    background: #151515;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(3px);
    border-radius: 5px;
  }

  .v-tab {
    min-width: 80px !important;
  }
  .v-tabs-items {
    background-color: transparent !important;
  }

  .date-select-wrap {
    .v-input__prepend-outer {
      margin-right: 0px;
      margin-top: 15px;
    }
    .v-input__icon {
      width: 18px;
      height: 18px;
      min-width: 18px;
      .v-icon {
        font-size: 18px;
        color: var(--v-lightPrimary2-base);
      }
    }
  }

  .analyze-table .row {
    border-bottom: #EBEBEB 1px solid !important;
  }
}

// common style
.font-tauri {
  font-family: 'Tauri' !important;
}
.font-share-tech {
  font-family: 'Share Tech' !important;
}
.pre-wrap {
  white-space: pre-wrap;
}
.break-all {
  word-break: break-all;
}
.can-click{
  cursor: pointer;
}
.bg-grey-radial-gradient {
  background: radial-gradient(86.09% 216.62% at 8.7% 11.02%, #636363 0%, #232324 100%);
}
.bg-primary-radial-gradient {
  background: radial-gradient(78.7% 198.02% at 8.7% 11.02%, #F0CD8F 0%, #C0914E 87.86%);
}
.border-radius-3{
  border-radius: 3px;
}
.toasted.toasted-primary.error{
  background-color: var(--v-error-base) !important;
}
.toasted.toasted-primary.default{
  background-color: var(--v-primary-base) !important;
}
</style>