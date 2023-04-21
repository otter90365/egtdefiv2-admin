<template>
  <v-text-field
    :style="{width: width}"
    class="white rounded-lg mr-md-6 mr-3"
    append-icon="mdi-magnify"
    outlined
    dense
    hide-details
    color="darkPrimary1"
    placeholder="Search..."
    v-model="search"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '200px'
    },
    searchText: String
  },
  data() {
    return {
      search: ''
    }
  },
  watch: {
    search(newVal) {
      this.$emit('update:searchText', newVal)
    }
  },
  mounted() {
    this.search = this.searchText
  }
}
</script>