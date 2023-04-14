<template>
  <div class="text-field mb-3 w-full">
    <!-- mode input-->
    <v-text-field
      v-if="mode==='input'"
      v-model="text"
      dense
      flat
      solo
      full-width
      height="43"
      :type="type"
      :label="label"
      :dark="dark"
      :disabled="disabled"
      :readonly="readonly"
      :rules="rules"
      :hide-details="'auto'"
    >
      <!--<template v-slot:prepend-inner>
        <img class="mr-4" src="@/assets/img/icon-lock.svg" alt="lock">
      </template>-->
      <template v-slot:append v-if="textSwitch">
        <img class="can-click" src="@/assets/img/icon-view.svg" alt="view" @click="type = type==='text'? 'password':'text'">
      </template>
    </v-text-field>
  </div>
</template>
<script>
export default {
  name: 'input-block',
  props:{
    mode: {
      type: String,
      default: 'input'
    },
    inputText: [String, Number],
    label: String,
    textSwitch: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default() {
        return []
      }
    },
    selectItems: {
      type: Array,
      default() {
        return []
      }
    },
    isSend: {
      type: Boolean,
      default: false
    },
  },
  data(){
    return {
      text: '',
      type: this.textSwitch ? 'password' : 'text',
      balanceRule: (v) => parseFloat(v) < this.balance || 'Under Balance',
    }
  },
  watch:{
    text(newVal){
      this.$emit('update:inputText', newVal)
    },
    inputText(newVal){
      this.text = newVal
    },
  },
  methods:{
    send(){
      this.$emit('send')
    },
  },
  mounted(){
    this.text = JSON.parse(JSON.stringify(this.inputText))
  }
}
</script>