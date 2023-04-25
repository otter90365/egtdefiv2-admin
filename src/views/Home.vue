<template>
  <div class="admin-index">
    <v-container>
      index
    </v-container>
  </div>
</template>
<script>
export default {
  async created(){
    this.$router.push('/order/loaning')
  }
}
</script>
<style lang="scss">
.admin-index {
  
}
</style>