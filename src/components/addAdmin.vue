<template>
  <v-form class="font-weight-bold rem-4 rem-md-8" ref="addAdminForm" lazy-validation>
    <div class="mb-2">管理員姓名</div>
    <v-text-field
      placeholder="Enter..."
      background-color="white"
      color="darkPrimary1"
      outlined
      dense
      v-model="newAdmin.name"
      :rules="[dataRules]"
    ></v-text-field>

    <div class="mb-2">管理員帳號</div>
    <v-text-field
      placeholder="Enter..."
      background-color="white"
      color="darkPrimary1"
      outlined
      dense
      v-model="newAdmin.account"
      :rules="[dataRules]"
    ></v-text-field>

    <div class="mb-2">管理員地址</div>
    <v-text-field
      placeholder="Enter..."
      background-color="white"
      color="darkPrimary1"
      outlined
      dense
      v-model="newAdmin.address"
      :rules="accountRules"
    ></v-text-field>

    <div class="mb-2">管理員權限</div>
    <v-select
      v-model="newAdmin.permission"
      class="rounded-lg mb-md-5 mb-4"
      solo
      flat
      dense
      dark
      hide-details
      :items="authorityList"
      :item-text="'tag'"
      :item-value="'id'"
      :rules="[dataRules]"
      :background-color="`darkPrimary1`"
      prepend-inner-icon="mdi-filter-variant"
      append-icon=""
    ></v-select>

    <div class="d-flex justify-space-between mx-auto" style="max-width: 363px;">
      <v-btn width="33%" outlined depressed color="darkPrimary1" @click="cancel()">取消</v-btn>
      <v-btn width="33%" depressed dark color="darkPrimary1" @click="addContractAdmin()">確認</v-btn>
    </div>
  </v-form>
</template>

<script>
import base from '@/mixin/base'
export default {
  mixins: [base],
  props: {
    authorityList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      newAdmin: {
        name: '',
        account: '',
        address: '',
        permission: this.authorityList.length ? this.authorityList[0].id : 0,
      },
      timer: null,
    }
  },
  methods: {
    async addContractAdmin() {
      if (this.$refs.addAdminForm.validate()) {
        if (this.newAdmin.permission === 2) {
          // whitelist admin
          if (this.$store.state.chainId){
            await this.addWhiteistAdmin('usdt')
            await this.addWhiteistAdmin('tbt')
          }else{
            this.$toasted.error('請切換到幣安智能鏈')
          }
        } else {
          // other admin
          this.addAdmin()
        }
      }
    },
    async addWhiteistAdmin(token) {
      let isAdmin = await this[`$${token}`].getIsAdmin(this.newAdmin.address)
      if (isAdmin) {
        this.$toasted.error(`該地址已是${token}白名單管理者`)
        return;
      }

      let result = await this[`$${token}`].setAdmin(this.newAdmin.address)
      if (result.txHash){
        this.$store.commit('updateLoading', {isShow: true, text: ''})
        this.timer = window.setInterval(async () => {
          isAdmin = await this[`$${token}`].getIsAdmin(this.newAdmin.address)
          if (isAdmin) {
            window.clearInterval(this.timer)
            await this.addAdmin()
            this.$store.commit('updateLoading', {isShow: false, text: ''})
          }
        }, 1000)
      }else if (result.code === 4001){
        this.$toasted.error('使用者拒絕連線')
      }
    },
    async addAdmin() {
      let result = await this.$store.dispatch('addAdmin', this.newAdmin)

      if (result.status === 230) {
        this.$toasted.show('新增管理員成功')
        this.$emit('getAdminList')
        this.$forceUpdate()
      } else {
        this.$toasted.error('新增管理員失敗')
      }
    },
    cancel() {
      this.newAdmin = {
        name: '',
        account: '',
        address: '',
        permission: this.authorityList.length ? this.authorityList[0].id : 0,
      }
      this.$refs.addAdminForm.resetValidation()
      this.$emit('cancel')
    }
  }
}
</script>