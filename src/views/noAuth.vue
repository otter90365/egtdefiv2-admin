<template>
  <div class="no-auth-page">
    <div class="header-block d-flex justify-space-between align-center">
      <div class="d-flex align-center">
        <div
          class="icon-expand lightPrimary rounded-circle d-md-none d-flex justify-center align-center can-click mr-3"
          @click="$store.commit('updateSidebarClose', !$store.state.sidebarClose)"
        >
          <v-icon color="black">{{ $store.state.sidebarClose ? 'mdi-chevron-right' : 'mdi-chevron-left'}}</v-icon>
        </div>
        <h1 class="rem-md-24 rem-14 font-weight-bold mr-1">暫無權限</h1>
      </div>

      <accountBlock></accountBlock>
    </div>
    <div class="d-flex flex-column align-center" style="margin-top: 100px;">
      <div class="font-w-4 rem-12 lightGrey2--text text-center">不好意思<br>您尚未權限使用此功能</div>
    </div>
  </div>
</template>
<script>
import accountBlock from '@/components/accountBlock'
export default {
  name: 'noAuth',
  components: {
    accountBlock
  }
}
</script>