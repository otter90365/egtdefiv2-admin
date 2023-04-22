<template>
  <div class="order-table">
    <div class="d-none d-md-block">
      <v-data-table
        :headers="headers"
        :items="currOrder"
        :items-per-page="itemPerPage"
        hide-default-footer
        @click:row="clickRow"
        :item-class="(item) => item.settle === 2 || item.settle === 1 ? 'warning--text' : ''"
      >
        <!-- header -->
        <template v-slot:header.status="{}">
          <inputBlock
            mode="select"
            label="狀態"
            :selectItems="['進緩衝', '貸款中']"
            width="67"
          ></inputBlock>
        </template>
        <template v-slot:header.settle="{}">
          <inputBlock
            mode="select"
            label="狀態"
            :selectItems="settleItems"
            :inputText.sync="settleInput"
            width="67"
          ></inputBlock>
        </template>
        <template v-slot:header.settle_day="{}">
          <settleDayInput
            :startTimeText.sync="startTimeInput"
            :endTimeText.sync="endTimeInput"
          ></settleDayInput>
        </template>
        <template v-slot:header.countdown="{}">
          <countdownInput
            :startTimeText="countdownStartTimeInput"
            :endTimeText="countdownEndTimeInput"
            @updateCountdown="updateCountdown"
          ></countdownInput>
        </template>
        <template v-slot:header.lender="{}">
          <inputBlock
            mode="select"
            label="貸方"
            :selectItems="lenderItems"
            width="67"
            :inputText.sync="lenderInput"
          ></inputBlock>
        </template>
        <template v-slot:header.borrower="{}">
          <inputBlock
            mode="select"
            label="借方"
            :selectItems="borrowerItems"
            width="67"
            :inputText.sync="borrowerInput"
          ></inputBlock>
        </template>

        <!-- item -->
        <template v-slot:item.id="{item}">
          <span :class="item.settle === 2 || item.settle === 1 ? 'warning--text' : 'lightPrimary--text'">#{{ item.id }}</span>
        </template>
        <template v-slot:item.settle="{item}">
          <span>{{ item.settle === 2 ? '違約'
                 : item.settle === 5 ? '已還款'
                 : item.settle === 1 ? '緩衝期'
                 : item.settle === 3 ? '貸款中' : '' }}</span>
        </template>
        <template v-slot:item.settle_day="{item}">
          {{ timestampToTime(item.settle_day * 1000) }}
        </template>
        <template v-slot:item.countdown="{item}">
          <div v-if="item.countdown">
            {{ item.settle === 1 ? '-' : '' }}{{ (item.countdown.day * 24 + item.countdown.hour).toString().padStart(2, "0") }}:{{ (item.countdown.min).toString().padStart(2, "0") }}:{{ item.countdown.sec.toString().padStart(2, "0") }}
          </div>
        </template>
        <template v-slot:item.want="{item}">
          {{ item.want }} {{ basicToken.toUpperCase() }}
        </template>
        <template v-slot:item.rate="{item}">
          {{ item.rate * 100 }}%
        </template>
        <template v-slot:item.amount="{item}">
          {{ item.amount }} {{ borrowToken.toUpperCase() }}
        </template>
        <template v-slot:item.mortgageRate="{item}">
          {{ getMortgageRate(item) }}%
        </template>
      </v-data-table>
    </div>

    <template v-if="currOrder.length">
      <v-row
        class="d-block d-md-none mobile-order py-1 px-2 mb-2 can-click"
        v-for="item in currOrder"
        :key="item.id"
        @click="clickRow(item)"
      >
        <v-row class="rem-0 font-weight-bold">
          <v-col cols="2">#{{ item.id }}</v-col>
          <v-col cols="2" :class="{'warning--text': item.settle === 2 || item.settle === 1}">
            {{ item.pendingStatus ? item.pendingStatus
            : item.settle === 2  ? '違約'
            : item.settle === 5  ? '已還款'
            : item.settle === 1 ? '緩衝期'
            : item.settle === 3 ? '貸款中' : ''
            }}
          </v-col>
          <v-col cols="5" class="text-center" :class="{'warning--text': item.settle === 2 || item.settle === 1}">
            {{ item.settle === 1 || item.settle === 3 ? timestampToTime(item.settle_day * 1000) : '-' }}
          </v-col>
          <v-col cols="3" class="text-center" :class="{'warning--text': item.settle === 2 || item.settle === 1}">
            <div v-if="(item.settle === 1 || item.settle === 3) && item.countdown">
              {{ item.settle === 1 ? '-' : '' }}{{ (item.countdown.day * 24 + item.countdown.hour).toString().padStart(2, "0") }}:{{ (item.countdown.min).toString().padStart(2, "0") }}:{{ item.countdown.sec.toString().padStart(2, "0") }}
            </div>
            <div v-else>{{ '-' }}</div>
          </v-col>
        </v-row>
        <v-row no-gutters align="stretch">
          <v-col cols="2" class="rem-0 pa-2" :class="{'warning--text': item.settle === 2 || item.settle === 1}">
            <div>
              <span class="mr-1">{{ item.borrower }}</span>
              <span style="font-size: 8px">借方</span>
            </div>
            <div class="break-all">{{ item.borrower_address }}</div>
          </v-col>
          <v-col cols="4" class="pa-1">
            <div class="px-1 h-100" :class="item.settle === 2 || item.settle === 1 ? 'lightWarning warning--text' : 'lightPrimary'">
              <div><span style="font-size: 8px" class="black--text">借款金額</span>  <span class="rem-2">{{ item.want }}</span> <span style="font-size: 10px;">{{ basicToken.toUpperCase() }}</span></div>
              <div><span style="font-size: 8px" class="black--text">抵押數量</span>  <span class="rem-2">{{ item.amount }}</span> <span style="font-size: 10px;">{{ borrowToken.toUpperCase() }}</span></div>
            </div>
          </v-col>
          <v-col cols="4" class="pa-1">
            <div class="px-1 h-100" :class="item.settle === 2 || item.settle === 1 ? 'lightWarning warning--text' : 'lightPrimary'">
              <div><span style="font-size: 8px" class="black--text">利率</span>  <span class="rem-2">{{ item.rate * 100 }}</span> <span style="font-size: 10px;">%</span></div>
              <div><span style="font-size: 8px" class="black--text">貸款成數</span>  <span class="rem-2">{{ getMortgageRate(item) }}</span> <span style="font-size: 10px;">%</span></div>
            </div>
          </v-col>
          <v-col cols="2" class="rem-0 pa-2">
            <div>
              <span class="mr-1">{{ item.lender || '-' }}</span>
              <span style="font-size: 8px" v-if="item.lender">貸方</span>
            </div>
            <div class="break-all">{{ item.lender_address !== '0x0000000000000000000000000000000000000000' ? item.lender_address : '-' }}</div>
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

    <!-- detailed info -->
    <v-dialog v-model="detailsShow" fullscreen>
      <div class="white detailed-info-card text-center">
        <h2 class="font-weight-bold rem-8">
          {{ currItem.pendingStatus ? currItem.pendingStatus
          : $route.name.includes('Loaning') ? '貸款中' : '已結單'
          }}名單細項
        </h2>

        <div class="py-5 status-block">
          <div>#{{ currItem.id }}</div>
          <div :class="isWarningText">
            {{ currItem.pendingStatus ? currItem.pendingStatus
             : currItem.settle === 2  ? '違約'
             : currItem.settle === 5  ? '已還款'
             : currItem.settle === 1 ? '緩衝期'
             : currItem.settle === 3 ? '貸款中' : '' }}
          </div>
          <div :class="isWarningText">
            {{ currItem.settle === 1 || currItem.settle === 3 ? timestampToTime(currItem.settle_day * 1000) : '-' }}
          </div>
          <div :class="isWarningText">
            <div v-if="(currItem.settle === 1 || currItem.settle === 3) && currItem.countdown">
              {{ currItem.settle === 1 ? '-' : '' }}{{ (currItem.countdown.day * 24 + currItem.countdown.hour).toString().padStart(2, "0") }}:{{ (currItem.countdown.min).toString().padStart(2, "0") }}:{{ currItem.countdown.sec.toString().padStart(2, "0") }}
            </div>
            <div v-else>-</div>
          </div>
        </div>

        <div class="py-5 borrower-block">
          <div>借方</div>
          <div class="rem-20 font-weight-bold" :class="isWarningText">{{ currItem.borrower }}</div>
          <div class="rem-2 break-all" :class="isWarningText">{{ currItem.borrower_address }}</div>
          <div>借款金額  <span :class="isWarningText">{{ currItem.want }} {{ basicToken.toUpperCase() }}</span></div>
          <div>抵押數量  <span :class="isWarningText">{{ currItem.amount }} {{ borrowToken.toUpperCase() }}</span></div>
          <div>利率  <span :class="isWarningText">{{ currItem.rate * 100 }}%</span></div>
          <div>貸款成數  <span :class="isWarningText">{{ getMortgageRate(currItem) }}%</span></div>
        </div>

        <div class="py-5 lender-block">
          <div>貸方</div>
          <div class="rem-20 font-weight-bold">{{ currItem.lender || '-' }}</div>
          <div class="rem-2 break-all">{{ currItem.lender_address !== '0x0000000000000000000000000000000000000000' ? currItem.lender_address : '-' }}</div>
        </div>

        <v-btn class="rounded-lg" color="darkPrimary1" dark depressed width="125" @click="detailsShow = false">關閉</v-btn>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import base from '@/mixin/base'
import inputBlock from '@/components/inputBlock'
import settleDayInput from '@/components/settleDayInput'
import countdownInput from '@/components/countdownInput'
export default {
  mixins: [base],
  props: {
    itemPerPage: {
      type: Number,
      default: 10
    },
    orders: {
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
    basicToken: String,
    borrowToken: String,
    // input items
    lenderText: String,
    lenderItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    borrowerText: String,
    borrowerItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    settleText: Number,
    settleItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    startTimeText: String,
    endTimeText: String,
    countdownStartTimeText: [String, Number],
    countdownEndTimeText: [String, Number],
  },
  data() {
    return {
      lenderInput: '',
      borrowerInput: '',
      settleInput: '',
      startTimeInput: null,
      endTimeInput: null,
      countdownStartTimeInput: null,
      countdownEndTimeInput: null,
      page: 1,
      detailsShow: false,
      currItem: {},
      countdownList: [],
      timer: null,
    }
  },
  watch: {
    lenderInput(newVal) {
      this.$emit('update:lenderText', newVal)
    },
    lenderText(newVal) {
      this.lenderInput = newVal
    },
    borrowerInput(newVal) {
      this.$emit('update:borrowerText', newVal)
    },
    borrowerText(newVal) {
      this.borrowerInput = newVal
    },
    settleInput(newVal) {
      this.$emit('update:settleText', newVal)
    },
    settleText(newVal) {
      this.settleInput = newVal
    },
    startTimeInput(newVal) {
      this.$emit('update:startTimeText', newVal)
    },
    startTimeText(newVal) {
      this.startTimeInput = newVal
    },
    endTimeInput(newVal) {
      this.$emit('update:endTimeText', newVal)
    },
    endTimeText(newVal) {
      this.endTimeInput = newVal
    },
    countdownStartTimeText(newVal) {
      this.countdownStartTimeInput = newVal
    },
    countdownEndTimeText(newVal) {
      this.countdownEndTimeInput = newVal
    },
    itemPerPage() {
      this.page = 1
      this.$forceUpdate()
    },
    currOrder: {
      handler: function() {
        if (this.$route.name === 'Order-Loaning' && !this.timer) {
          this.timer = window.setInterval(() => {
            this.getCountdownList()
          }, 1000)
        }
      },
      deep: true
    }
  },
  components: {
    inputBlock,
    settleDayInput,
    countdownInput
  },
  computed: {
    totalPage() {
      return Math.ceil(this.orders.length / this.itemPerPage)
    },
    currOrder() {
      return this.orders.slice(this.itemPerPage * (this.page - 1), this.itemPerPage * this.page)
    },
    isWarningText() {
      return this.currItem && (this.currItem.settle === 2 || this.currItem.settle === 1) ? 'warning--text' : ''
    }
  },
  methods: {
    clickRow(item) {
      this.detailsShow = true
      this.currItem = item
    },
    getMortgageRate(item) {
      let wantUsd
      if (this.basicToken.toLowerCase() === 'tbt') {
        wantUsd = item.want / 31.04
      } else {
        wantUsd = item.want
      }

      return (wantUsd / (item.amount * this.$store.state.ethPrice / 1200) * 100).toFixed(2)
    },
    getCountdownList() {
      let now = Math.floor(Date.now())
      let sec, min, hour, day
      this.currOrder.forEach(item => {
        let dueTime = item.settle_day * 1000
        let offsetTIme = Math.abs((dueTime - now) / 1000)

        sec = parseInt(offsetTIme % 60)
        min = parseInt((offsetTIme / 60) % 60)
        hour = parseInt((offsetTIme / 60 / 60) % 24)
        day = parseInt(offsetTIme / 60 / 60 / 24)
        item.countdown = { day, hour, min, sec }
      })
      this.$forceUpdate()
    },
    updateCountdown(data) {
      this.countdownStartTimeInput = data.startTime
      this.countdownEndTimeInput = data.endTime
      this.$emit('updateCountdown', data)
    }
  },
  mounted() {
    this.lenderInput = this.lenderText
    this.borrowerInput = this.borrowerText
    this.settleInput = this.settleText
    this.startTimeInput = this.startTimeText
    this.endTimeInput = this.endTimeText
    this.countdownStartTimeInput = this.countdownStartTimeText
    this.countdownEndTimeInput = this.countdownEndTimeText
  },
  destroyed() {
    if (this.timer) {
      window.clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>

<style lang="scss">
.order-table  {
  th, td {
    border-bottom: 2px solid var(--v-lightPrimary-base) !important;
  }
  .mobile-order {
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
  }
}
.detailed-info-card {
  padding: 40px 80px;
  h2 {
    padding-bottom: 12px;
    border-bottom: 2px solid var(--v-lightPrimary-base);
  }
  .status-block, .borrower-block, .lender-block {
    div {
      margin-bottom: 14px;
    }
    &:not(.lender-block){
      border-bottom: 2px dashed var(--v-lightPrimary-base);
    }
  }
}
</style>