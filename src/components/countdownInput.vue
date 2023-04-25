<template>
  <div>
    <!-- desktop -->
    <v-menu offset-y :close-on-content-click="false" v-model="menuShow" v-if="$store.state.nowWidth >= 960">
      <template v-slot:activator="{ on, attrs }">
        <inputBlock
          mode="select"
          placeholder="倒數計時"
          width="130"
          :selectItems="[]"
          :inputText="''"
          readonly
          v-bind="attrs"
          v-on.native="on"
          @click.native="menuShow=true"
        ></inputBlock>
      </template>
      <v-card class="white py-4 px-6 font-weight-bold rem-2 font-weight-bold" width="400">
        快速查詢：
        <v-radio-group
          v-model="currOption"
          class="mt-0"
          hide-details
          @change="updateTime"
        >
          <v-row no-gutters align="center">
            <v-col
              cols="3"
              class="mb-2"
              v-for="item in defaultOptions"
              :key="item.value"
            >
              <v-radio
                :label="item.text"
                :value="item"
                :color="$vuetify.theme.themes.light.primary"
              ></v-radio>
            </v-col>
          </v-row>
        </v-radio-group>
        <div class="d-flex justify-space-between mb-4">
          <v-btn
            v-for="item in lastThreeMonthsOptions"
            :key="item.text"
            depressed
            dark
            color="darkPrimary1"
            @click="updateTime(item); confirm()"
          >
            {{ item.text }}
          </v-btn>
        </div>
        <v-radio-group
          v-model="currSort"
          class="mt-0"
          row
          hide-details
        >
          <v-radio
            v-for="item in ['asc', 'desc']"
            :key="item"
            :label="item === 'asc' ? '由舊至新排序' : '由新至舊排序'"
            :value="item"
            :color="$vuetify.theme.themes.light.primary"
          ></v-radio>
        </v-radio-group>

        <hr class="countdown-line my-3">

        自訂查詢：
        <div class="d-flex justify-space-between align-center mt-2">
          <timeInput class="mt-1" :timeInput.sync="startTime"></timeInput>
          <div class="mx-6">至</div>
          <timeInput class="mt-1" :timeInput.sync="endTime" :min="typeof startTime === 'string' ? startTime : ''" color="darkPrimary1"></timeInput>
        </div>
        
        <div class="d-flex justify-center mt-4">
          <v-btn class="rounded-lg" color="darkPrimary1" depressed dark @click="confirm()">查詢</v-btn>
        </div>
      </v-card>
    </v-menu>

    <!-- mobile -->
    <div v-else class="rem-0">
      快速查詢：
      <v-radio-group
        v-model="currOption"
        class="mt-0"
        hide-details
        @change="updateTime"
      >
        <v-row no-gutters align="center">
          <v-col
            cols="4"
            class="mb-2"
            v-for="item in defaultOptions"
            :key="item.value"
          >
            <v-radio
              :label="item.text"
              :value="item"
              :color="$vuetify.theme.themes.light.primary"
            ></v-radio>
          </v-col>
        </v-row>
      </v-radio-group>
      <div class="d-flex justify-space-between mb-4">
        <v-btn
          v-for="item in lastThreeMonthsOptions"
          :key="item.text"
          class="rem-0 px-2"
          depressed
          dark
          color="darkPrimary1"
          @click="updateTime(item); confirm()"
        >
          {{ item.text }}
        </v-btn>
      </div>
      <v-radio-group
        v-model="currSort"
        class="mt-0"
        row
        hide-details
      >
        <v-radio
          v-for="item in ['asc', 'desc']"
          :key="item"
          :label="item === 'asc' ? '由舊至新排序' : '由新至舊排序'"
          :value="item"
          :color="$vuetify.theme.themes.light.primary"
        ></v-radio>
      </v-radio-group>

      <hr class="countdown-line my-3">

      自訂查詢：
      <div class="d-flex justify-space-between align-center mt-2">
        <timeInput class="mt-1" :timeInput.sync="startTime"></timeInput>
        <div class="mx-2">至</div>
        <timeInput class="mt-1" :timeInput.sync="endTime" :min="typeof startTime === 'string' ? startTime : ''" color="darkPrimary1"></timeInput>
      </div>
      
      <div class="d-flex justify-center mt-4">
        <v-btn class="rounded-lg" color="darkPrimary1" depressed dark @click="confirm()">查詢</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import inputBlock from '@/components/inputBlock'
import timeInput from '@/components/timeInput'
export default {
  props: {
    startTimeText: [String, Number],
    endTimeText: [String, Number],
  },
  data() {
    return {
      menuShow: false,
      startTime: null,
      endTime: null,
      currOption: null,
      currSort: null,
    }
  },
  watch: {
    startTimeText(newVal) {
      this.startTime = newVal
    },
    endTimeText(newVal) {
      this.endTime = newVal
    }
  },
  components: {
    inputBlock,
    timeInput
  },
  computed: {
    todayTimeStart() {
      return (Date.parse(new Date().toISOString().substr(0, 10))) / 1000 - 8 * 3600
    },
    defaultOptions(){
      return [
        {
          text: '當天',
          type: 'end',
          value: this.todayTimeStart + 24 * 3600 - 1
        },
        {
          text: '7天內',
          type: 'end',
          value: this.todayTimeStart + 7 * 24 * 3600 - 1
        },
        {
          text: '30天內',
          type: 'end',
          value: this.todayTimeStart + 30 * 24 * 3600 - 1
        },
        {
          text: '60天內',
          type: 'end',
          value: this.todayTimeStart + 60 * 24 * 3600 - 1
        },
        {
          text: '90天內',
          type: 'end',
          value: this.todayTimeStart + 90 * 24 * 3600 - 1
        },
        {
          text: '120天內',
          type: 'end',
          value: this.todayTimeStart + 120 * 24 * 3600 - 1
        },
        {
          text: '120天以上',
          type: 'start',
          value: this.todayTimeStart + 120 * 24 * 3600
        },
      ]
    },
    lastThreeMonthsOptions() {
      const currMonth = new Date(Date.now()).getMonth() + 1
      const currYear = new Date(Date.now()).getFullYear()
      return [
        {
          text: `${currYear}/${currMonth.toString().padStart(2, "0")}`,
          type: 'full',
          value: this.getTimeOfMonth(currYear, currMonth)
        },
        {
          text: currMonth - 1 <= 0 ? `${currYear - 1}/${(currMonth - 1 + 12).toString().padStart(2, "0")}` : `${currYear}/${(currMonth - 1).toString().padStart(2, "0")}`,
          type: 'full',
          value: currMonth - 1 <= 0 ? this.getTimeOfMonth(currYear - 1, currMonth - 1 + 12) : this.getTimeOfMonth(currYear, currMonth - 1)
        },
        {
          text: currMonth - 2 <= 0 ? `${currYear - 1}/${(currMonth - 2 + 12).toString().padStart(2, "0")}` : `${currYear}/${(currMonth - 2).toString().padStart(2, "0")}`,
          type: 'full',
          value: currMonth - 2 <= 0 ? this.getTimeOfMonth(currYear - 1, currMonth - 2 + 12) : this.getTimeOfMonth(currYear, currMonth - 2)
        },
      ]
    }
  },
  methods: {
    updateTime(item) {
      if (item.type === 'start') {
        this.startTime = item.value
        this.endTime = null
      } else if (item.type === 'end') {
        this.endTime = item.value
        this.startTime = this.todayTimeStart
      } else {
        this.startTime = parseInt(item.value.split('-')[0])
        this.endTime = parseInt(item.value.split('-')[1])
      }
    },
    getTimeOfMonth(year, month) {
      if (month === 12) {
        return `${Date.parse(`${year}-${month}-01`) / 1000}-${Date.parse(`${year + 1}-01-01`) / 1000 - 1}`
      } else {
        return `${Date.parse(`${year}-${month}-01`) / 1000}-${Date.parse(`${year}-${month+1}-01`) / 1000 - 1}`
      }
    },
    confirm() {
      if (typeof this.startTime === 'string' || typeof this.endTime === 'string') {
        this.currOption = null
      }
      this.$emit('updateCountdown', {
        startTime: typeof this.startTime === 'string' ? Math.ceil(Date.parse(this.startTime) / 1000) : this.startTime,
        endTime: typeof this.endTime === 'string' ? Math.ceil(Date.parse(this.endTime) / 1000) : this.endTime,
        sort: this.currSort
      })
      this.menuShow = false
    }
  },
  mounted() {
    this.startTime = this.startTimeText
    this.endTime = this.endTimeText
  }
}
</script>

<style lang="scss">
.countdown-line {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: dotted 2px var(--v-darkPrimary1-base);
}
</style>