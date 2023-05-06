<template>
  <v-form class="font-weight-bold rem-4 rem-md-8" ref="addWhitelistForm" lazy-validation>
    <div class="mb-2">白名單姓名</div>
    <v-text-field
      placeholder="Enter..."
      background-color="white"
      color="darkPrimary1"
      outlined
      dense
      v-model="newWhitelist.name"
      :rules="[dataRules]"
    ></v-text-field>

    <div class="mb-2">白名單錢包地址</div>
    <v-text-field
      placeholder="Enter..."
      background-color="white"
      color="darkPrimary1"
      outlined
      dense
      v-model="newWhitelist.address"
      :rules="accountRules"
    ></v-text-field>

    <div class="mb-2">白名單分類</div>
    <v-select
      v-model="newWhitelist.tag"
      class="rounded-lg mb-md-5 mb-4"
      solo
      flat
      dense
      dark
      hide-details
      :items="tagList"
      :item-text="'tag'"
      :item-value="'id'"
      :rules="[dataRules]"
      :background-color="`darkPrimary1`"
      prepend-inner-icon="mdi-filter-variant"
      append-icon=""
    ></v-select>

    <div class="mb-2">白名單備註</div>
    <v-text-field
      class="mb-md-10 mb-8"
      placeholder="Enter..."
      background-color="white"
      color="darkPrimary1"
      outlined
      dense
      v-model="newWhitelist.memo"
      :rules="[dataRules, (v) => (v && v.length <= 8) || '字數超過限制']"
    ></v-text-field>

    <div class="d-flex justify-space-between mx-auto" style="max-width: 363px;">
      <v-btn width="33%" outlined depressed color="darkPrimary1" @click="cancel()">取消</v-btn>
      <v-btn width="33%" depressed dark color="darkPrimary1" @click="addWhitelist()">確認</v-btn>
    </div>
  </v-form>
</template>

<script>
import base from '@/mixin/base'
export default {
  mixins: [base],
  props: {
    tagList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      newWhitelist: {
        name: '',
        address: '',
        tag: this.tagList.length ? this.tagList[0].id : 0,
        memo: '',
      },
      timer: null,
    }
  },
  computed: {
    currToken() {
      return this.$store.getters.basicToken.toLowerCase()
    }
  },
  methods: {
    async addWhitelist() {
      if (this.$refs.addWhitelistForm.validate()) {
        if (this.$store.state.chainId){
          let isWhitelist = await this[`$${this.currToken}`].getIsWhitelist(this.newWhitelist.address)
          if (isWhitelist) {
            this.$toasted.error('該地址已是白名單')
            return;
          }

          let result = await this[`$${this.currToken}`].setWhitelist(this.newWhitelist.address)
          if (result.txHash){
            this.$store.commit('updateLoading', {isShow: true, text: ''})
            this.timer = window.setInterval(async () => {
              isWhitelist = await this[`$${this.currToken}`].getIsWhitelist(this.newWhitelist.address)
              if (isWhitelist) {
                window.clearInterval(this.timer)

                result = await this.$store.dispatch('addWhitelist', this.newWhitelist)
                if (result.status === 230) {
                  this.$toasted.show('新增成功')
                  this.newWhitelist = {
                    name: '',
                    address: '',
                    tag: this.tagList[0].id,
                    memo: '',
                  }
                  this.$refs.addWhitelistForm.resetValidation()
                  this.$emit('getWhitelistList')
                } else {
                  this.$toasted.error('新增失敗')
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
    cancel() {
      this.newWhitelist = {
        name: '',
        address: '',
        tag: this.tagList[0].id,
        memo: '',
      }
      this.$refs.addWhitelistForm.resetValidation()
      this.$emit('cancel')
    }
  }
}
</script>