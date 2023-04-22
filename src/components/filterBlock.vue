<template>
  <div class="d-md-none d-block filter-block">
    <v-icon color="lightPrimary" @click="filterDrawer = true">mdi-filter</v-icon>

    <v-navigation-drawer
      v-if="$route.name !== 'Login'"
      class="token-drawer"
      v-model="filterDrawer"
      fixed
      right
      width="336"
      temporary
    >
      <div class="pa-3">
        <div class="d-flex justify-end">
          <v-icon large @click="filterDrawer = false">mdi-close</v-icon>
        </div>

        <div class="px-7 py-2">
          <div class="rem-8 font-weight-bold mb-6 title-text text-center">篩選條件</div>

          <!-- 狀態 -->
          <v-card class="rounded-lg mb-6" v-if="isStatus">
            <v-card-title class="darkPrimary1 white--text py-0 font-weight-bold rem-2 d-flex justify-space-between align-center">
              合約狀態
              <v-icon color="white" @click="statusShow = !statusShow">{{ statusShow ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-card-title>
            <v-card-text class="lightPrimary pa-0" v-if="statusShow">
              <v-list class="rounded-lg">
                <v-btn
                  class="justify-start"
                  width="100%"
                  tile
                  depressed
                  :color="currStatus === (item ? item.value : item) ? 'darkPrimary1' : 'transparent'"
                  :dark="currStatus === (item ? item.value : item)"
                  v-for="item in statusItems"
                  :key="item ? item.value : item"
                  @click="currStatus = (item ? item.value : item)"
                >
                  {{ item ? item.name : '全部' }}
                </v-btn>
              </v-list>
            </v-card-text>
          </v-card>

          <!-- 到期日/時間 -->
          <v-card class="rounded-lg mb-6" v-if="isSettleDay">
            <v-card-title class="darkPrimary1 white--text py-0 font-weight-bold rem-2 d-flex justify-space-between align-center">
              到期日/時間
              <v-icon color="white" @click="settleDayShow = !settleDayShow">{{ settleDayShow ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-card-title>
            <v-card-text class="lightPrimary pa-0" v-if="settleDayShow">
              <v-list class="rounded-lg py-3 px-7">
                <settleDayInput
                  :startTimeText.sync="currStartTime"
                  :endTimeText.sync="currEndTime"
                ></settleDayInput>
              </v-list>
            </v-card-text>
          </v-card>

          <!-- 倒數計時 -->
          <v-card class="rounded-lg mb-6" v-if="isCountdown">
            <v-card-title class="darkPrimary1 white--text py-0 font-weight-bold rem-2 d-flex justify-space-between align-center">
              倒數計時
              <v-icon color="white" @click="countdownShow = !countdownShow">{{ countdownShow ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-card-title>
            <v-card-text class="lightPrimary pa-0" v-if="countdownShow">
              <v-list class="rounded-lg py-4 px-3">
                <countdownInput
                  :startTimeText="currCountdownStartTime"
                  :endTimeText="currCountdownEndTime"
                  @updateCountdown="updateCountdown"
                ></countdownInput>
              </v-list>
            </v-card-text>
          </v-card>

          <!-- 貸方 -->
          <v-card class="rounded-lg mb-6" v-if="isLender">
            <v-card-title class="darkPrimary1 white--text py-0 font-weight-bold rem-2 d-flex justify-space-between align-center">
              貸方
              <v-icon color="white" @click="lenderShow = !lenderShow">{{ lenderShow ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-card-title>
            <v-card-text class="lightPrimary pa-0" v-if="lenderShow">
              <div class="py-1 px-3">
                <searchInput :searchText.sync="searchLender" width="100%"></searchInput>
              </div>
              <v-list class="rounded-lg">
                <v-btn
                  width="50%"
                  tile
                  depressed
                  :color="currLender === item ? 'darkPrimary1' : 'transparent'"
                  :dark="currLender === item"
                  v-for="item in lenderItems.filter(item => item === null || item.includes(searchLender))"
                  :key="item"
                  @click="currLender = item"
                >
                  {{ item || '全部' }}
                </v-btn>
              </v-list>
            </v-card-text>
          </v-card>

          <!-- 借方 -->
          <v-card class="rounded-lg mb-6" v-if="isBorrower">
            <v-card-title class="darkPrimary1 white--text py-0 font-weight-bold rem-2 d-flex justify-space-between align-center">
              借方
              <v-icon color="white" @click="borrowerShow = !borrowerShow">{{ borrowerShow ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-card-title>
            <v-card-text class="lightPrimary pa-0" v-if="borrowerShow">
              <div class="py-1 px-3">
                <searchInput :searchText.sync="searchBorrower" width="100%"></searchInput>
              </div>
              <v-list class="rounded-lg">
                <v-btn
                  width="50%"
                  tile
                  depressed
                  :color="currBorrower === item ? 'darkPrimary1' : 'transparent'"
                  :dark="currBorrower === item"
                  v-for="item in borrowerItems.filter(item => item === null || item.includes(searchBorrower))"
                  :key="item"
                  @click="currBorrower = item"
                >
                  {{ item || '全部' }}
                </v-btn>
              </v-list>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import searchInput from '@/components/searchInput'
import settleDayInput from '@/components/settleDayInput'
import countdownInput from '@/components/countdownInput'
export default {
  props: {
    // status
    isStatus: {
      type: Boolean,
      default: false
    },
    statusItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    statusText: {
      type: Number,
      default: 0
    },
    // borrower
    isBorrower: {
      type: Boolean,
      default: false
    },
    borrowerItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    borrowerText: {
      type: String,
      default: ''
    },
    // lender
    isLender: {
      type: Boolean,
      default: false
    },
    lenderItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    lenderText: {
      type: String,
      default: ''
    },
    // settle day
    isSettleDay: {
      type: Boolean,
      default: false
    },
    startTimeText: String,
    endTimeText: String,
    // countdown
    isCountdown: {
      type: Boolean,
      default: false
    },
    countdownStartTimeText: [String, Number],
    countdownEndTimeText: [String, Number],
  },
  data() {
    return {
      filterDrawer: false,
      // status
      currStatus: '',
      statusShow: true,
      // borrower
      searchBorrower: '',
      currBorrower: '',
      borrowerShow: true,
      // lender
      searchLender: '',
      currLender: '',
      lenderShow: true,
      // settle day
      settleDayShow: true,
      currStartTime: null,
      currEndTime: null,
      // countdown
      countdownShow: true,
      currCountdownStartTime: null,
      currCountdownEndTime: null,
    }
  },
  watch: {
    // status
    currStatus(newVal) {
      this.$emit('update:statusText', newVal)
    },
    statusText(newVal) {
      this.currStatus = newVal
    },
    // borrow
    currBorrower(newVal) {
      this.$emit('update:borrowerText', newVal)
    },
    borrowerText(newVal) {
      this.currBorrower = newVal
    },
    // lender
    currLender(newVal) {
      this.$emit('update:lenderText', newVal)
    },
    lenderText(newVal) {
      this.currLender = newVal
    },
    // settle day
    currStartTime(newVal) {
      this.$emit('update:startTimeText', newVal)
    },
    startTimeText(newVal) {
      this.currStartTime = newVal
    },
    currEndTime(newVal) {
      this.$emit('update:endTimeText', newVal)
    },
    endTimeText(newVal) {
      this.currEndTime = newVal
    },
    // countdown
    countdownStartTimeText(newVal) {
      this.currCountdownStartTime = newVal
    },
    countdownEndTimeText(newVal) {
      this.currCountdownEndTime = newVal
    },
  },
  components: {
    searchInput,
    settleDayInput,
    countdownInput
  },
  methods: {
    updateCountdown(data) {
      this.currCountdownStartTime = data.startTime
      this.currCountdownEndTime = data.endTime
      this.$emit('updateCountdown', data)
      this.filterDrawer = false
    }
  },
  mounted() {
    this.currBorrower = this.borrowerText
    this.currLender = this.lenderText
    this.currStatus = this.statusText
    this.currStartTime = this.startTimeText
    this.currEndTime = this.endTimeText
    this.currCountdownStartTime = this.countdownStartTimeText
    this.currCountdownEndTime = this.countdownEndTimeText
  }
}
</script>