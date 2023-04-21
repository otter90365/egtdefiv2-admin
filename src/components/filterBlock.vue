<template>
  <div class="d-md-none d-block">
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

          <v-card class="rounded-lg" v-if="isBorrower">
            <v-card-title class="darkPrimary1 white--text py-0 font-weight-bold rem-2">借方</v-card-title>
            <v-card-text class="lightPrimary pa-0">
              <div class="py-1 px-3">
                <searchInput :searchText.sync="searchBorrower" width="100%"></searchInput>
              </div>
              <v-list>
                <v-btn
                  width="50%"
                  tile
                  depressed
                  :color="currBorrower === item ? 'darkPrimary1' : 'white'"
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
export default {
  props: {
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
  },
  data() {
    return {
      filterDrawer: false,
      // borrower
      searchBorrower: '',
      currBorrower: '',
    }
  },
  watch: {
    currBorrower(newVal) {
      this.$emit('update:borrowerText', newVal)
    },
    borrowerText(newVal) {
      this.currBorrower = newVal
    }
  },
  components: {
    searchInput
  },
  methods: {
    
  },
  mounted() {
    this.currBorrower = this.borrowerText
  }
}
</script>