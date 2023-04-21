<template>
  <div>
    <!-- desktop -->
    <v-menu offset-y v-model="menuShow" v-if="$store.state.nowWidth >= 960">
      <template v-slot:activator="{ on, attrs }">
        <inputBlock
          mode="select"
          placeholder="幣值選項"
          width="130"
          :selectItems="$store.state.tokenPairs"
          :inputText="$store.state.currTokenPair"
          readonly
          v-bind="attrs"
          v-on.native="on"
          @click.native="menuShow=true"
        ></inputBlock>
      </template>
      <v-radio-group v-model="$store.state.currTokenPair" class="px-5 white" @change="updateCurrTokenPair">
        <v-radio
          v-for="pair in $store.state.tokenPairs"
          :key="pair"
          :label="pair"
          :value="pair"
          :color="$vuetify.theme.themes.light.primary"
        ></v-radio>
      </v-radio-group>
    </v-menu>
  
    <!-- mobile -->
    <inputBlock
      v-else-if="isMobile"
      style="width: 130px;"
      mode="select"
      placeholder="幣值選項"
      width="130"
      :selectItems="$store.state.tokenPairs"
      :inputText="$store.state.currTokenPair"
      readonly
      @click.native="tokenDrawer = true"
    ></inputBlock>

    <v-navigation-drawer
      v-if="$route.name !== 'Login'"
      class="token-drawer"
      v-model="tokenDrawer"
      fixed
      right
      width="336"
      temporary
    >
      <div class="pa-3">
        <div class="d-flex justify-end">
          <v-icon large @click="tokenDrawer = false">mdi-close</v-icon>
        </div>

        <div class="px-7 py-2">
          <div class="rem-8 font-weight-bold mb-6 title-text text-center">幣值選項</div>

          <v-card class="rounded-lg">
            <v-card-title class="darkPrimary1 white--text py-0 font-weight-bold rem-2">幣值選項</v-card-title>
            <v-card-text class="lightPrimary">
              <v-radio-group v-model="$store.state.currTokenPair" class="mt-0 pt-5" @change="updateCurrTokenPair">
                <v-radio
                  v-for="pair in $store.state.tokenPairs"
                  :key="pair"
                  :label="pair"
                  :value="pair"
                  :color="$vuetify.theme.themes.light.primary"
                ></v-radio>
              </v-radio-group>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import inputBlock from '@/components/inputBlock'
export default {
  props: {
    isMobile: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tokenDrawer: false,
      menuShow: false,
    }
  },
  components: {
    inputBlock
  },
  methods: {
    updateCurrTokenPair(value) {
      this.$store.commit('updateCurrTokenPair', value)
    }
  }
}
</script>