<template>
  <div class="d-md-flex d-none align-center">
    <div class="font-weight-bold mr-6">管理員 {{ $store.state.userInfo.account }}</div>
    <div class="font-weight-bold mr-6">{{ $store.state.userInfo.name }}</div>
    <v-btn class="rounded-lg" outlined color="darkPrimary1" height="25" @click="logout()">登出</v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.commit('clearInfo')
      this.$cookies.remove('address')
      this.$cookies.remove('token')
      this.$router.push({name: 'Login'})
    }
  }
}
</script>