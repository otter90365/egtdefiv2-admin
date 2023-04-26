<template>
  <div class="loaning-page">
    <div class="header-block d-flex justify-space-between align-center">
      <div class="d-flex align-center">
        <div
          class="icon-expand lightPrimary rounded-circle d-md-none d-flex justify-center align-center can-click mr-3"
          @click="$store.commit('updateSidebarClose', !$store.state.sidebarClose)"
        >
          <v-icon color="black">{{ $store.state.sidebarClose ? 'mdi-chevron-right' : 'mdi-chevron-left'}}</v-icon>
        </div>
        <h1 class="rem-md-24 rem-14 font-weight-bold mr-1">貸款中名單</h1>
        <tokenPairInput :isMobile="false"></tokenPairInput>
      </div>

      <div class="d-flex align-center">
        <searchInput :searchText.sync="search"></searchInput>
        <accountBlock></accountBlock>
        <filterBlock
          isStatus :statusItems="settleItems" :statusText.sync="settleText"
          isSettleDay :startTimeText.sync="startTimeText" :endTimeText.sync="endTimeText"
          isCountdown :countdownStartTimeText="countdownStartTimeText" :countdownEndTimeText="countdownEndTimeText"
          isBorrower :borrowerItems="borrowerItems" :borrowerText.sync="borrowerText"
          isLender :lenderItems="lenderItems" :lenderText.sync="lenderText"
          @updateCountdown="updateCountdown"
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
        class="loaning-order"
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
        :startTimeText.sync="startTimeText"
        :endTimeText.sync="endTimeText"
        :countdownStartTimeText="countdownStartTimeText"
        :countdownEndTimeText="countdownEndTimeText"
        :settleItems="settleItems"
        @updateCountdown="updateCountdown"
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
        { text: '狀態', value: 'settle', align: 'center', width: '90px', sortable: false },
        { text: '到期日/時間', value: 'settle_day', align: 'center', width: '150px', sortable: false },
        { text: '倒數計時', value: 'countdown', align: 'center', width: '50px', sortable: false },
        { text: '貸方', value: 'lender', align: 'center', width: '90px', sortable: false },
        { text: '貸方地址', value: 'lender_address', align: 'center', sortable: false },
        { text: '借款金額', value: 'want', align: 'center', sortable: false },
        { text: '利率', value: 'rate', align: 'center', sortable: false },
        { text: '抵押數量', value: 'amount', align: 'center', sortable: false },
        { text: '貸款成數', value: 'mortgageRate', align: 'center', sortable: false },
        { text: '借方', value: 'borrower', align: 'center', width: '90px', sortable: false },
        { text: '借方地址', value: 'borrower_address', align: 'center', sortable: false },
      ],
      borrowerText: '',
      borrowerItems: [],
      lenderText: '',
      lenderItems: [],
      settleText: 0,
      settleItems: [],
      startTimeText: null,
      endTimeText: null,
      countdownStartTimeText: null,
      countdownEndTimeText: null,
      sortText: 'desc',
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
      await this.getLoaningOrder()
    },
    async borrowerText() {
      await this.getLoaningOrder()
    },
    async lenderText() {
      await this.getLoaningOrder()
    },
    async settleText() {
      await this.getLoaningOrder()
    },
    async startTimeText() {
      await this.getLoaningOrder()
    },
    async endTimeText() {
      await this.getLoaningOrder()
    },
    search(newVal){
      this.filterOrders = this.orders.filter(item => item.borrower.includes(newVal) || item.lender.includes(this.search))
    }
  },
  methods: {
    async getLoaningOrder() {
      this.orders = []
      this.filterOrders = []
      this.borrowerItems = []
      this.lenderItems = []
      let result = await this.$store.dispatch('getLoaningOrder', {
        basicToken: this.$store.getters.basicToken,
        borrowToken: this.$store.getters.borrowToken,
        borrower: this.borrowerText,
        lender: this.lenderText,
        settle: this.settleText,
        startTime: Date.parse(this.startTimeText) / 1000 - 8 * 60 * 60,
        endTime: Date.parse(this.endTimeText) / 1000 + 16 * 60 * 60 - 1,
        countdownStartTime: this.countdownStartTimeText,
        countdownEndTime: this.countdownEndTimeText,
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
        this.settleItems = [null, {name: '緩衝期', value: 1}, {name: '貸款中', value: 3}]

        // sort order
        const now = Math.ceil(Date.now() / 1000)
        this.orders.sort((a, b) => {
          if (this.sortText === 'asc') {
            return (a.settle_day - now) - (b.settle_day - now)
          } else {
            return (b.settle_day - now) - (a.settle_day - now)
          }
        })

        this.filterOrders = this.orders.filter(item => item.borrower.includes(this.search) || item.lender.includes(this.search))
        this.$forceUpdate()
      }
    },
    async updateCountdown(data) {
      this.countdownStartTimeText = data.startTime
      this.countdownEndTimeText = data.endTime
      this.sortText = data.sort
      await this.getLoaningOrder()
    }
  },
  async mounted() {
    await this.getLoaningOrder()
  }
}
</script>

<style lang="scss">
.loaning-order {
  th {
    padding: 0 6px !important;
  }
}
</style>