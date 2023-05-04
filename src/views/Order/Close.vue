<template>
  <div class="close-page">
    <div class="header-block d-flex justify-space-between align-center">
      <div class="d-flex align-center">
        <div
          class="icon-expand lightPrimary rounded-circle d-md-none d-flex justify-center align-center can-click mr-3"
          @click="$store.commit('updateSidebarClose', !$store.state.sidebarClose)"
        >
          <v-icon color="black">{{ $store.state.sidebarClose ? 'mdi-chevron-right' : 'mdi-chevron-left'}}</v-icon>
        </div>
        <h1 class="rem-md-24 rem-14 font-weight-bold mr-1">已結單名單</h1>
        <tokenPairInput :isMobile="false"></tokenPairInput>
      </div>

      <div class="d-flex align-center">
        <searchInput :searchText.sync="search"></searchInput>
        <accountBlock></accountBlock>
        <filterBlock
          isStatus :statusItems="settleItems" :statusText.sync="settleText"
          isBorrower :borrowerItems="borrowerItems" :borrowerText.sync="borrowerText"
          isLender :lenderItems="lenderItems" :lenderText.sync="lenderText"
        ></filterBlock>
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
        :lenderText.sync="lenderText"
        :lenderItems="lenderItems"
        :borrowerText.sync="borrowerText"
        :borrowerItems="borrowerItems"
        :settleText.sync="settleText"
        :settleItems="settleItems"
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
        { text: '狀態', value: 'settle', align: 'center', sortable: false },
        { text: '貸方', value: 'lender', align: 'center', sortable: false },
        { text: '貸方地址', value: 'lender_address', align: 'center', sortable: false },
        { text: '借款金額', value: 'want', align: 'center', sortable: false },
        { text: '利率', value: 'rate', align: 'center', sortable: false },
        { text: '抵押數量', value: 'amount', align: 'center', sortable: false },
        { text: '貸款成數', value: 'mortgageRate', align: 'center', sortable: false },
        { text: '借方', value: 'borrower', align: 'center', sortable: false },
        { text: '借方地址', value: 'borrower_address', align: 'center', sortable: false },
      ],
      borrowerText: '',
      borrowerItems: [],
      lenderText: '',
      lenderItems: [],
      settleText: 0,
      settleItems: [],
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
      await this.getCloseOrder()
    },
    async borrowerText() {
      await this.getCloseOrder()
    },
    async lenderText() {
      await this.getCloseOrder()
    },
    async settleText() {
      await this.getCloseOrder()
    },
    search(newVal){
      this.filterOrders = this.orders.filter(item => item.borrower.includes(newVal) || item.lender.includes(this.search))
    }
  },
  methods: {
    async getCloseOrder() {
      this.orders = []
      this.filterOrders = []
      this.borrowerItems = []
      this.lenderItems = []
      let result = await this.$store.dispatch('getCloseOrder', {
        basicToken: this.$store.getters.basicToken,
        borrowToken: this.$store.getters.borrowToken,
        borrower: this.borrowerText,
        lender: this.lenderText,
        settle: this.settleText,
      })
      if (result.status === 231 && result.data) {
        this.orders = result.data.orders.map(item => {
          return {
            ...item,
            lender_address: `${item.lender_address.slice(0, 4)}...${item.lender_address.slice(36)}`,
            borrower_address: `${item.borrower_address.slice(0, 4)}...${item.borrower_address.slice(36)}  `,
          }
        })
        this.borrowerItems = [null, ...result.data.borrower]
        this.lenderItems = [null, ...result.data.lender]
        this.settleItems = [null, {name: '違約', value: 2}, {name: '已還款', value: 5}]
        this.filterOrders = this.orders.filter(item => item.borrower.includes(this.search) || item.lender.includes(this.search))
      }
    }
  },
  async mounted() {
    await this.getCloseOrder()
  }
}
</script>