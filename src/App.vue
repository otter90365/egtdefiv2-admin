<template>
  <v-app class="app" :class="$route.name">
    <v-navigation-drawer
      v-if="$route.name !== 'Login'"
      class="side-bar"
      v-model="isDrawer"
      dark
      fixed
      :mini-variant.sync="sidebarClose"
      width="245"
      :permanent="$store.state.nowWidth >= 960"
      :temporary="$store.state.nowWidth < 960"
      :color="$vuetify.theme.themes.light.primary"
    >
      <v-list>
        <v-list-item class="logo mx-2">
          <v-list-item-icon>
            <img src="@/assets/img/logo.png" alt="logo" width="35px">
          </v-list-item-icon>
          <v-list-item-title>
            <div class="rem-0">Absolute DEFI</div>
            <div class="rem-4">智能合約借貸應用</div>
          </v-list-item-title>
        </v-list-item>
        <div
          class="icon-expand lightPrimary rounded-circle d-none d-md-flex justify-center align-center can-click"
          @click="sidebarClose = !sidebarClose"
        >
          <v-icon color="black">{{ sidebarClose ? 'mdi-chevron-right' : 'mdi-chevron-left'}}</v-icon>
        </div>
      </v-list>

      <v-list
        nav
        dense
        class="mt-md-8 mt-5"
      >
        <v-list-item
          link
          v-for="nav in navList"
          :key="nav.link"
          :style="{opacity: nav.link === $route.name ? 1 : 0.3}"
          @click="$router.push({name: nav.link})"
        >
          <v-list-item-icon>
            <img :src="`${require(`@/assets/img/${nav.img}.svg`)}`" :alt="nav.text">
          </v-list-item-icon>
          <v-list-item-title class="rem-4 font-weight-bold">{{ nav.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <div class="account-block white--text w-100 text-center d-md-none d-block" v-if="!sidebarClose">
        <div class="font-weight-bold rem-12">{{ $store.state.userInfo.name }}</div>
        <div class="font-weight-bold rem-2">管理員 {{ $store.state.userInfo.account }}</div>
        
        <v-btn class="rounded-lg mt-8" outlined color="lightOrange" height="25" @click="log()">登出</v-btn>
      </div>
    </v-navigation-drawer>

    <v-main
      id="main"
      :class="{'pb-md-16 px-md-15 py-5 px-5': $route.name !== 'Login', 
               'ml-14': $route.name !== 'Login' && $store.state.nowWidth >= 960}"
    >
      <router-view />
    </v-main>

    <!--<loading :loadingShow="$store.state.loading.isShow" :content="$store.state.loading.text"></loading> -->
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
    sidebarClose: true,
    navList: [
      {
        text: '白名單管理',
        link: 'whitelist',
        img: 'icon-nav-whitelist'
      },
      {
        text: '貸款中名單',
        link: 'Order-Loaning',
        img: 'icon-nav-loaning',
      },
      {
        text: '未媒合名單',
        link: 'Order-Pending',
        img: 'icon-nav-pending'
      },
      {
        text: '已結單名單',
        // link: '',
        img: 'icon-nav-finished'
      },
      {
        text: '權限名單管理',
        // link: 'authority',
        img: 'icon-nav-authority'
      },
    ]
  }),
  components:{
    // btn,
    // loading
  },
  watch: {
    isDrawer(newVal) {
      this.$store.commit('updateSidebarClose', !newVal)
    },
    "$store.state.sidebarClose"(newVal) {
      this.isDrawer = !newVal
    },
  },
  computed:{
    shortAddress(){
      return `${this.$store.state.account.slice(0, 6)}...${this.$store.state.account.slice(38)}`
    },
    currPage() {
      let page = this.navList.find(item => this.$route.name === item.link)
      if (page) {
        return page
      } else {
        return {}
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

    if (!this.$store.state.ethPrice) {
      await this.$store.dispatch('getEthPrice')
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
#main{}

.side-bar {
  position: fixed;
  overflow: visible;
  .logo {
    padding: 30px 0;
    border-bottom: #D9D9D9 solid 1px;
    @include dai_vuetify_md {
      padding: 20px 0;
    }
  }
  .icon-expand {
    position: absolute;
    width: 30px;
    height: 30px;
    right: -15px;
  }
  .account-block {
    position: absolute;
    bottom: 50px;
    @include dai_vuetify_sm {
      bottom: 100px;
    }
  }
}

.header-block {
  padding-bottom: 28px;
  border-bottom: var(--v-darkPrimary1-base) solid 2px;
}

.title-text {
  padding-bottom: 12px;
  border-bottom: var(--v-lightPrimary-base) solid 2px;
}

.v-navigation-drawer__border {
  width: 0 !important;
}

// page color
.Order-Loaning {
  --v-primary-base: #86AE15 !important;
  --v-lightPrimary-base: #B5B68B !important;
  --v-darkPrimary1-base: #7D7F2D !important;
  --v-darkPrimary2-base: #454915 !important;
}
.Order-Pending {
  --v-primary-base: #718AD2 !important;
  --v-lightPrimary-base: #C0C7DB !important;
  --v-darkPrimary1-base: #164986 !important;
  --v-darkPrimary2-base: #0C1829 !important;
}

// .app-bar{
//   background: linear-gradient(117.82deg, #535353 1.27%, #000000 74.01%);
//   box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
//   @include dai_vuetify_sm {
//     margin-left: 0;
//   }
//   .no-padding-btn{
//     .v-btn:not(.v-btn--round).v-size--default{
//       @include dai_vuetify_sm{
//         min-width: 40px;
//         padding: 0 10px;
//       }
//     }
//   }
// }

// .side-bar {
//   background-color: var(--v-darkGrey-base) !important;
//   z-index: 9;
// }

// #footer {
//   min-height: 60px;
//   border-radius: 6px;
//   border: #F0CD8F 1px solid;
//   width: 95%;
//   margin: 0 auto 20px;
//   img.footer-pointer {
//     position: absolute;
//     bottom: -1px;
//   }
// }

// .v-input.grey--text {
//   input, .v-icon {
//     color: var(--v-grey-base) !important;
//     caret-color: var(--v-grey-base) !important;
//   }
// }

// // analyze
// .analyze-details, .analyze-token, .analyze-index {
//   @include dai_vuetify_sm_min {
//     max-width: 420px;
//     background: radial-gradient(188.38% 188.38% at 50% -88.38%, rgba(99, 99, 99, 0.8) 0%, rgba(71, 71, 71, 0.8) 40.12%, rgba(49, 49, 49, 0.8) 100%);
//     border-radius: 11px;
//     margin: 40px auto;
//   }

//   .analyze-card {
//     background: #151515;
//     box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
//     backdrop-filter: blur(3px);
//     border-radius: 5px;
//   }

//   .v-tab {
//     min-width: 80px !important;
//   }
//   .v-tabs-items {
//     background-color: transparent !important;
//   }

//   .date-select-wrap {
//     .v-input__prepend-outer {
//       margin-right: 0px;
//       margin-top: 15px;
//     }
//     .v-input__icon {
//       width: 18px;
//       height: 18px;
//       min-width: 18px;
//       .v-icon {
//         font-size: 18px;
//         color: var(--v-lightPrimary2-base);
//       }
//     }
//   }

//   .analyze-table .row {
//     border-bottom: #EBEBEB 1px solid !important;
//   }
// }

// common style
// .font-tauri {
//   font-family: 'Tauri' !important;
// }
// .font-share-tech {
//   font-family: 'Share Tech' !important;
// }
.pre-wrap {
  white-space: pre-wrap;
}
.break-all {
  word-break: break-all;
}
.can-click {
  cursor: pointer;
}
.w-100 {
  width: 100%;
}
.h-100 {
  height: 100%;
}
// .bg-grey-radial-gradient {
//   background: radial-gradient(86.09% 216.62% at 8.7% 11.02%, #636363 0%, #232324 100%);
// }
// .bg-primary-radial-gradient {
//   background: radial-gradient(78.7% 198.02% at 8.7% 11.02%, #F0CD8F 0%, #C0914E 87.86%);
// }
// .border-radius-3{
//   border-radius: 3px;
// }
.toasted.toasted-primary.error{
  background-color: var(--v-error-base) !important;
}
.toasted.toasted-primary.default{
  background-color: var(--v-primary-base) !important;
}
</style>