<template>
  <v-dialog persistent fullscreen v-model="loadingShow" style="height: 100vh;">
    <div class="d-flex flex-column justify-center align-center" :class="`white--text`" style="height: 100%; background-color: rgba(0, 0, 0, .7);">
      <img src="@/assets/img/icon-loading.svg" alt="loading">
      <h2>{{ content }}</h2>
    </div>
  </v-dialog>
</template>
<script>
export default {
  name: 'loading',
  props:{
    loadingShow: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: '',
    },
  }
}
</script>

<style>
img[alt="loading"] {
  animation: spin 2s infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>