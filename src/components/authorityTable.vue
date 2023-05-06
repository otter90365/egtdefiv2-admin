<template>
  <div class="authority-table">
    <div class="d-none d-md-block">
      <v-data-table
        :headers="headers"
        :items="currList"
        :items-per-page="itemPerPage"
        hide-default-footer
      >
        <!-- item -->
        <template v-slot:item.id="{item}">
          <span class="lightPrimary--text">#{{ item.id }}</span>
        </template>
        <template v-slot:item.permission="{item}">
          <div class="d-flex justify-center align-center">
            <div>
              <div v-for="auth in item.permission" :key="auth">
                {{ authMap.get(auth) }}
              </div>
            </div>
            <v-menu offset-y v-if="$store.state.nowWidth >= 960">
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="darkPrimary1" small v-bind="attrs" v-on="on">mdi-note-edit</v-icon>
              </template>
              <v-list>
                <v-list-item
                  v-for="auth in authorityList"
                  :key="auth.id"
                  link
                  class="can-click"
                  :class="{'lightPrimary': item.permission.includes(auth.id)}"
                  @click="updateContractAuth(item, auth.id)"
                >
                  {{ auth.tag }}
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
        <template v-slot:item.action="{item}">
          <v-icon color="darkPrimary1" @click.stop="currItem = item; deleteAdminDialogShow = true">mdi-trash-can</v-icon>
        </template>
      </v-data-table>
    </div>

    <template v-if="currList.length">
      <v-row
        class="d-block d-md-none mobile-admin py-3 px-2 mb-2 can-click"
        v-for="(item, index) in currList"
        :key="item.id"
      >
        <div class="delete-block px-4 d-flex justify-space-between align-center can-click" @click.stop="currItem = item; deleteAdminDialogShow = true">
          <v-icon color="white">mdi-trash-can</v-icon>
          <v-icon color="white">mdi-trash-can</v-icon>
        </div>
        <v-row
          class="rem-0 mobile-admin-content"
          :class="{'show-right-delete': showRightDelete === index, 'show-left-delete': showLeftDelete === index}"
          align="center"
          @touchmove="moveMobileAdmin($event, index)"
        >
          <v-col cols="2" class="primary--text">#{{ item.id }}</v-col>
          <v-col cols="10" class="rem-0 font-weight-bold">
            <v-row class="break-all">
              <v-col cols="2">{{ item.name }}</v-col>
              <v-col cols="4">{{ item.account }}</v-col>
              <v-col cols="6">
                <div
                  v-for="auth in item.permission"
                  :key="auth"
                  class="pa-1 mr-1 mb-1 darkPrimary2 white--text rounded-lg d-inline-block"
                >
                  {{ authMap.get(auth) }}
                </div>
                <v-icon color="darkPrimary1" small @click.stop="showEditAuth(item)">mdi-note-edit</v-icon>
              </v-col>
            </v-row>
            <div>{{ item.address }}</div>
          </v-col>
        </v-row>
      </v-row>
    </template>
    <v-row v-else class="d-block d-md-none text-center rounded-lg grey--text mb-5" style="border: solid 1px lightgray;">
      <v-col cols="12">
        No data available
      </v-col>
    </v-row>

    <v-pagination v-model="page" circle :length="totalPage" :total-visible="7"></v-pagination>

    <!-- edit auth -->
    <v-dialog v-model="updateAuthDialogShow" :fullscreen="$store.state.nowWidth < 960" width="100%" max-width="585">
      <v-card class="pa-4">
        <div class="d-flex justify-end">
          <v-icon class="ma-4 ma-md-0" @click="updateAuthDialogShow = false">mdi-close</v-icon>
        </div>
        <div class="py-3 px-5">
          <div class="w-100">
            <div class="rem-8 font-weight-bold mb-1 title-text text-center">編輯管理員權限</div>
            <div class="rem-0 grey--text text-right">審核帳號 {{ $store.state.userInfo.account }}</div>
          </div>

          <div class="auth-edit-block font-weight-bold text-center">
            <div class="rem-24 mb-5 mb-md-8">{{ currItem.name }}</div>
            <div class="rem-4 rem-md-8 mb-4">{{ currItem.account }}</div>
            <div class="rem-4 rem-md-8 mb-7 mb-md-8">{{ currItem.address }}</div>
            <div class="rem-4 rem-md-8 mb-2">管理員權限</div>
            <v-card class="rounded-lg mb-6">
              <v-card-title class="darkPrimary1 py-0">
                <v-icon color="darkPrimary2">mdi-filter-variant</v-icon>
              </v-card-title>
              <v-card-text class="lightPrimary px-0 py-2">
                <v-list class="py-0">
                  <v-list-item
                    v-for="auth in authorityList"
                    :key="auth.id"
                    link
                    :class="{'darkPrimary1': currItem.permission.includes(auth.id)}"
                    style="opacity: 0.85;"
                    @click="updateContractAuth(currItem, auth.id); updateAuthDialogShow = false"
                  >
                    {{ auth.tag }}
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </div>

          <div class="d-flex justify-center">
            <v-btn width="160" outlined depressed color="darkPrimary1" @click="updateAuthDialogShow = false">取消</v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- delete admin -->
    <v-dialog v-model="deleteAdminDialogShow" width="100%" max-width="585">
      <v-card class="pa-4">
        <div class="d-flex justify-end">
          <v-icon class="ma-4 ma-md-0" @click="deleteAdminDialogShow = false">mdi-close</v-icon>
        </div>
        <div class="py-3 px-5">
          <div class="d-flex flex-column flex-md-row justify-space-between align-md-end align-stretch">
            <div class="rem-28 font-weight-bold text-center text-md-left">確認刪除管理員</div>
            <div class="rem-0 grey--text mb-2 text-right text-md-left">審核帳號 {{ $store.state.userInfo.account }}</div>
          </div>

          <div class="delete-admin-block font-weight-bold text-center">
            <div class="rem-md-24 rem-20 mb-8">{{ currItem.name }}</div>
            <div class="rem-2 rem-md-8 mb-md-5 mb-4">{{ currItem.account }}</div>
            <div class="rem-2 rem-md-8 mb-md-5 mb-4">{{ currItem.address }}</div>
            <div class="rem-2 rem-md-8 mb-2">
              <div v-for="auth in currItem.permission" :key="auth">
                {{ authMap.get(auth) }}
              </div>
            </div>
          </div>

          <div class="d-flex justify-space-between mx-auto" style="max-width: 363px;">
            <v-btn width="33%" outlined depressed color="darkPrimary1" @click="deleteAdminDialogShow = false">取消</v-btn>
            <v-btn width="33%" depressed dark color="darkPrimary1" @click="deleteAdminConfirmShow = true">確認</v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- delete admin confirm -->
    <v-dialog v-model="deleteAdminConfirmShow" width="90%" max-width="500">
      <v-card class="py-md-8 py-6 px-md-6 px-3 font-weight-bold text-center">
        <div class="rem-md-28 rem-20 warning--text mb-md-3 mb-2">再次確認刪除</div>
        <div class="rem-md-3 rem-0 warning--text mb-md-10 mb-6">刪除將無法復原，您確定要刪除嗎?</div>
        <div class="rem-md-24 rem-20 mb-8 mb-md-4">{{ currItem.name }}</div>
        <div class="rem-2 rem-md-8 mb-md-4">{{ currItem.account }}</div>
        <div class="rem-2 rem-md-8 mb-md-4">{{ currItem.address }}</div>
        <div class="rem-2 rem-md-8 mb-5 mb-md-10">
          <div v-for="auth in currItem.permission" :key="auth">
            {{ authMap.get(auth) }}
          </div>
        </div>

        <div class="d-flex justify-space-between mx-auto" style="max-width: 363px;">
          <v-btn width="33%" outlined depressed color="darkPrimary1" @click="deleteAdminConfirmShow = false">取消</v-btn>
          <v-btn width="33%" depressed dark color="darkPrimary1" @click="deleteContractAuth()">確認</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import base from '@/mixin/base'
export default {
  mixins: [base],
  props: {
    itemPerPage: {
      type: Number,
      default: 10
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    authorityList: {
      type: Array,
      default: () => {
        return []
      }
    },
    headers: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  data() {
    return {
      page: 1,
      currItem: {
        permission: []
      },
      updateAuthDialogShow: false,
      deleteAdminDialogShow: false,
      deleteAdminConfirmShow: false,
      lastTouch: {
        x: 0,
        index: null
      },
      showLeftDelete: null,
      showRightDelete: null,
      authMap: new Map(),
      timer: null,
    }
  },
  watch: {
    authorityList(newVal) {
      this.authMap = new Map(newVal.map(item => [item.id, item.tag]))
    },
    itemPerPage() {
      this.page = 1
      this.$forceUpdate()
    },
  },
  computed: {
    totalPage() {
      return Math.ceil(this.list.length / this.itemPerPage)
    },
    currList() {
      return this.list.slice(this.itemPerPage * (this.page - 1), this.itemPerPage * this.page)
    },
  },
  methods: {
    showEditAuth(item) {
      this.currItem = item;
      this.updateAuthDialogShow = true;
    },
    async deleteContractAuth() {
      if (this.currItem.permission.includes(2)) {
        if (this.$store.state.chainId){
          await this.deleteWhitelistAdmin('usdt')
          await this.deleteWhitelistAdmin('tbt')
        }else{
          this.$toasted.error('請切換到幣安智能鏈')
        }
      } else {
        this.deleteAdmin()
      }
    },
    async deleteWhitelistAdmin(token) {
      let isAdmin = await this[`$${token}`].getIsAdmin(this.currItem.address)
      if (!isAdmin) {
        this.$toasted.error(`該地址非${token}白名單管理者`)
        return;
      }

      let result = await this[`$${token}`].setAdmin(this.currItem.address)
      if (result.txHash){
        this.$store.commit('updateLoading', {isShow: true, text: ''})
        this.timer = window.setInterval(async () => {
          isAdmin = await this[`$${token}`].getIsAdmin(this.currItem.address)
          if (!isAdmin) {
            window.clearInterval(this.timer)
            await this.deleteAdmin()
            this.$store.commit('updateLoading', {isShow: false, text: ''})
          }
        }, 1000)
      }else if (result.code === 4001){
        this.$toasted.error('使用者拒絕連線')
      }
    },
    // delete admin (only api)
    async deleteAdmin(){
      let result = await this.$store.dispatch('deleteAdmin', {
        address: this.currItem.address,
        id: this.currItem.id,
      })

      if (result.status === 230) {
        this.$toasted.show('刪除管理員成功')
        this.deleteAdminDialogShow = false
        this.deleteAdminConfirmShow = false
        this.$emit('getAdminList')
        this.$forceUpdate()
      } else {
        this.$toasted.error('刪除管理員失敗')
      }
    },
    moveMobileAdmin(event, index) {
      const x = event.touches[0].clientX;
      if (this.lastTouch.index != index) {
        this.showLeftDelete = null
        this.showRightDelete = null
      }
      if (x - this.lastTouch.x > 75) {
        this.showRightDelete = null
        this.showLeftDelete = index
      } else if (x - this.lastTouch.x < -75) {
        this.showRightDelete = index
        this.showLeftDelete = null
      }
      this.lastTouch.x = x
      this.lastTouch.index = index
    },
    async updateContractAuth(item, newAuthId) {
      if (newAuthId === 2) {
        // set contract admin
        if (!item.permission.includes(newAuthId)) {
          await this.addContractAdmin(item, newAuthId, 'usdt', false)
          await this.addContractAdmin(item, newAuthId, 'tbt', true)
        } else {
          await this.deleteContractAdmin(item, newAuthId, 'usdt', false)
          await this.deleteContractAdmin(item, newAuthId, 'tbt', true)
        }
      } else {
        this.updateAuth(item, newAuthId)
      }
    },
    // update auth (only api)
    async updateAuth(item, newAuthId){
      let result = await this.$store.dispatch('updateAdminAuth', {
        address: item.address,
        permission: newAuthId,
        status: !item.permission.includes(newAuthId)
      })

      if (result.status === 278 || result.status === 277) {
        this.$toasted.show('更新權限成功')
        this.$emit('getAdminList')
        this.$forceUpdate()
      } else {
        this.$toasted.error('更新權限失敗')
      }
    },
    async addContractAdmin(item, newAuthId, token, isUpdate) {
      if (this.$store.state.chainId){
        let isAdmin = await this[`$${token}`].getIsAdmin(item.address)
        if (isAdmin) {
          this.$toasted.error(`該地址已是${token}白名單管理者`)
          return;
        }

        let result = await this[`$${token}`].setAdmin(item.address)
        if (result.txHash){
          this.$store.commit('updateLoading', {isShow: true, text: ''})
          this.timer = window.setInterval(async () => {
            isAdmin = await this[`$${token}`].getIsAdmin(item.address)
            if (isAdmin) {
              window.clearInterval(this.timer)
              if (isUpdate) {
                await this.updateAuth(item, newAuthId)
              }
              this.$store.commit('updateLoading', {isShow: false, text: ''})
            }
          }, 1000)
        }else if (result.code === 4001){
          this.$toasted.error('使用者拒絕連線')
        }
      }else{
        this.$toasted.error('請切換到幣安智能鏈')
      }
    },
    async deleteContractAdmin(item, newAuthId, token, isUpdate) {
      if (this.$store.state.chainId){
        let isAdmin = await this[`$${token}`].getIsAdmin(item.address)
        if (!isAdmin) {
          this.$toasted.error(`該地址非${token}白名單管理者`)
          return;
        }

        let result = await this[`$${token}`].setAdmin(item.address)
        if (result.txHash){
          this.$store.commit('updateLoading', {isShow: true, text: ''})
          this.timer = window.setInterval(async () => {
            isAdmin = await this[`$${token}`].getIsAdmin(item.address)
            if (!isAdmin) {
              window.clearInterval(this.timer)
              if (isUpdate) {
                await this.updateAuth(item, newAuthId)
              }
              this.$store.commit('updateLoading', {isShow: false, text: ''})
            }
          }, 1000)
        }else if (result.code === 4001){
          this.$toasted.error('使用者拒絕連線')
        }
      }else{
        this.$toasted.error('請切換到幣安智能鏈')
      }
    }
  },
  mounted() {
    
  },
}
</script>

<style lang="scss">
.authority-table  {
  th, td {
    border-bottom: 2px solid var(--v-lightPrimary-base) !important;
  }
  .mobile-admin {
    position: relative;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    overflow: hidden;
    .delete-block {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--v-warning-base);
    }
    .mobile-admin-content {
      position: relative;
      z-index: 3;
      background: white;
      border-radius: 10px;
      transition: all 1s;
      &.show-left-delete {
        transform: translate(60px);
      }
      &.show-right-delete {
        transform: translate(-60px);
      }
    }
  }
}
.auth-edit-block {
  padding: 96px 0;
}
.delete-admin-block {
  padding: 140px 0;
  @include dai_vuetify_md {
    padding: 56px 0;
  }
}
</style>