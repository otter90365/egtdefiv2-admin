<template>
  <div class="btn" :class="{'d-flex justify-center':isCenter}" :style="{width: width? width:''}">
    <!--'white--text': !isOutlined-->
    <!--:style="{ background: gradientColor }"-->
    <v-btn
      class="btn-text"
      :class="{ 'font-weight-bold': isRounded }"
      :color="color"
      :width="width"
      :height="height"
      :block="isBlock"
      :disabled="isDisabled"
      :dark="isDark"
      :rounded="isRounded"
      :text="isText"
      depressed
      @click.stop="clickBtn()"
      :outlined="isOutlined"
    >
      <template v-if="!isCustom">
        <span :class="{'rem-20':height>=60}">
          {{ buttonText }}
        </span>
      </template>
      <slot v-else name="custom"></slot>
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    buttonText: String,
    width: [Number, String],
    height: Number,
    isBlock: {
      type: Boolean,
      default: false,
    },
    isOutlined: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'primary'
    },
    gradientColor: {
      type: String,
      default: ''
    },
    isRounded: {
      type: Boolean,
      default: false,
    },
    isText: {
      type: Boolean,
      default: false,
    },
    isCenter:{
      type: Boolean,
      default: false
    },
    isDark:{
      type: Boolean,
      default: false
    },
    isCustom:{
      type: Boolean,
      default: false
    }
  },
  methods: {
    clickBtn() {
      this.$emit("clickBtn");
    },
  },
};
</script>