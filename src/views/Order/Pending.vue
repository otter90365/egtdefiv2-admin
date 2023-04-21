<template>
  <div class="pending-page">
    <div class="header-block d-flex justify-space-between align-center">
      <div class="d-flex align-center">
        <div
          class="icon-expand lightPrimary rounded-circle d-md-none d-flex justify-center align-center can-click mr-3"
          @click="$store.commit('updateSidebarClose', !$store.state.sidebarClose)"
        >
          <v-icon color="black">{{ $store.state.sidebarClose ? 'mdi-chevron-right' : 'mdi-chevron-left'}}</v-icon>
        </div>
        <h1 class="rem-md-24 rem-14 font-weight-bold mr-1">未媒合名單</h1>
        <tokenPairInput :isMobile="false"></tokenPairInput>
      </div>

      <div class="d-flex align-center">
        <searchInput :searchText.sync="search"></searchInput>
        <accountBlock></accountBlock>
        <filterBlock isBorrower :borrowerItems="borrowerItems" :borrowerText.sync="borrowerText"></filterBlock>
      </div>

    </div>

    <section class="mt-10">
      <div class="d-md-none d-flex justify-space-between align-center mb-7">
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <div class="d-flex align-center">
          顯示
          <inputBlock
            mode="select"
            style="margin: 0 10px; width: 75px;"
            placeholder="幣值選項"
            width="75"
            :selectItems="$store.state.pageItems"
            :inputText.sync="itemPerPage"
          ></inputBlock>
          頁面
        </div>
        <v-spacer></v-spacer>
        <tokenPairInput></tokenPairInput>
      </div>

      <orderTable
        :itemPerPage="itemPerPage"
        :headers="headers"
        :orders="filterOrders"
        :basicToken="$store.getters.basicToken"
        :borrowToken="$store.getters.borrowToken"
        :borrowerText.sync="borrowerText"
        :borrowerItems="borrowerItems"
      ></orderTable>
    </section>
  </div>
</template>

<script>
import inputBlock from '@/components/inputBlock'
import searchInput from '@/components/searchInput'
import tokenPairInput from '@/components/tokenPairInput'
import accountBlock from '@/components/accountBlock'
import orderTable from '@/components/orderTable'
import filterBlock from '@/components/filterBlock'
export default {
  data() {
    return {
      itemPerPage: 10,
      search: '',
      orders: [],
      filterOrders: [],
      headers: [
        { text: '編號', value: 'id', align: 'center', sortable: false },
        { text: '狀態', value: 'pendingStatus', align: 'center', sortable: false },
        { text: '借方', value: 'borrower', align: 'center', sortable: false },
        { text: '借方地址', value: 'borrower_address', align: 'center', sortable: false },
        { text: '借款金額', value: 'want', align: 'center', sortable: false },
        { text: '利率', value: 'rate', align: 'center', sortable: false },
        { text: '抵押數量', value: 'amount', align: 'center', sortable: false },
        { text: '貸款成數', value: 'mortgageRate', align: 'center', sortable: false },
      ],
      borrowerText: '',
      borrowerItems: [],
    }
  },
  components: {
    inputBlock,
    searchInput,
    tokenPairInput,
    accountBlock,
    orderTable,
    filterBlock
  },
  watch: {
    async "$store.state.currTokenPair"() {
      await this.getPendingOrder()
    },
    async borrowerText() {
      await this.getPendingOrder()
    },
    search(newVal){
      this.filterOrders = this.orders.filter(item => item.borrower.includes(newVal))
    }
  },
  methods: {
    async getPendingOrder() {
      this.orders = []
      this.filterOrders = []
      this.borrowerItems = []
      let result = await this.$store.dispatch('getPendingOrder', {
        basicToken: this.$store.getters.basicToken,
        borrowToken: this.$store.getters.borrowToken,
        borrower: this.borrowerText,
      })
      if (result.status === 231 && result.data) {
        this.orders = result.data.orders.map(item => ({pendingStatus: '未媒合', ...item}))
        this.borrowerItems = [null, ...result.data.borrower]
        this.filterOrders = this.orders.filter(item => item.borrower.includes(this.search))
      }
    }
  },
  async mounted() {
    await this.getPendingOrder()
  }
}
</script>

<style lang="scss">

</style>