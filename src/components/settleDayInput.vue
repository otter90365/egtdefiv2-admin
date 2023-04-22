<template>
  <div>
    <!-- desktop -->
    <v-menu offset-y v-model="menuShow" v-if="$store.state.nowWidth >= 960">
      <template v-slot:activator="{ on, attrs }">
        <inputBlock
          mode="select"
          placeholder="到期日/時間"
          width="130"
          :selectItems="[]"
          :inputText="''"
          readonly
          v-bind="attrs"
          v-on.native="on"
          @click.native="menuShow=true"
        ></inputBlock>
      </template>
      <v-card class="white py-4 px-6 font-weight-bold d-flex justify-space-between align-center" width="400">
        <div class="d-flex flex-column">
          開始時間
          <timeInput class="mt-1" :timeInput.sync="startTime"></timeInput>
        </div>
        <div class="mx-5 mt-6">至</div>
        <div class="d-flex flex-column">
          結束時間
          <timeInput class="mt-1" :timeInput.sync="endTime" :min="startTime" color="darkPrimary1"></timeInput>
        </div>
      </v-card>
    </v-menu>

    <!-- mobile -->
    <div v-else class="d-flex flex-column rem-0">
      <div class="d-flex align-center">
        <div style="width: 100px;" class="mr-2">開始時間</div>
        <timeInput class="mt-1" :timeInput.sync="startTime"></timeInput>
      </div>
      <div class="mx-4">至</div>
      <div class="d-flex align-center">
        <div style="width: 100px;" class="mr-2">結束時間</div>
        <timeInput class="mt-1" :timeInput.sync="endTime" :min="startTime" color="darkPrimary1"></timeInput>
      </div>
    </div>
  </div>
</template>

<script>
import inputBlock from '@/components/inputBlock'
import timeInput from '@/components/timeInput'
export default {
  props: {
    isMobile: {
      type: Boolean,
      default: true
    },
    startTimeText: String,
    endTimeText: String,
  },
  data() {
    return {
      tokenDrawer: false,
      menuShow: false,
      startTime: null,
      endTime: null,
    }
  },
  watch: {
    startTime(newVal) {
      this.$emit('update:startTimeText', newVal)
    },
    startTimeText(newVal) {
      this.startTime = newVal
    },
    endTime(newVal) {
      this.$emit('update:endTimeText', newVal)
    },
    endTimeText(newVal) {
      this.endTime = newVal
    }
  },
  components: {
    inputBlock,
    timeInput
  },
  methods: {
    updateCurrTokenPair(value) {
      this.$store.commit('updateCurrTokenPair', value)
    },
  },
  mounted() {
    this.startTime = this.startTimeText
    this.endTime = this.endTimeText
  }
}
</script>