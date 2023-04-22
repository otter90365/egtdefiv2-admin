<template>
  <v-menu
    ref="dateMenu"
    v-model="dateMenu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="timeFormatted"
        append-icon="mdi-calendar"
        readonly
        solo
        flat
        hide-details
        color="white"
        :background-color="color"
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="time"
      :active-picker.sync="activePicker"
      :min="min"
      @change="save"
    ></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: {
    timeInput: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'primary'
    },
    min: String,
  },
  data() {
    return {
      time: null,
      dateMenu: null,
      activePicker: null,
    }
  },
  watch: {
    time(newVal) {
      this.$emit('update:timeInput', newVal)
    },
    timeInput(newVal) {
      this.time = newVal
    }
  },
  computed: {
    monthList() {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    },
    timeFormatted () {
      if (!this.time) return null

      const [year, month, day] = this.time.split('-')
      return `${day} ${this.monthList[month-1]}. ${year}`
    },
  },
  methods: {
    save(date) {
      this.$refs.dateMenu.save(date)
    },
  },
  mounted() {
    this.time = this.timeInput
  }
}
</script>