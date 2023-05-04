<template>
  <div class="authority-page">
    <div class="header-block d-flex justify-space-between align-center">
      <div class="d-flex align-center">
        <div
          class="icon-expand lightPrimary rounded-circle d-md-none d-flex justify-center align-center can-click mr-3"
          @click="$store.commit('updateSidebarClose', !$store.state.sidebarClose)"
        >
          <v-icon color="black">{{ $store.state.sidebarClose ? 'mdi-chevron-right' : 'mdi-chevron-left'}}</v-icon>
        </div>
        <h1 class="rem-md-24 rem-14 font-weight-bold mr-1">權限名單管理</h1>
        <v-btn color="darkPrimary1" depressed dark class="rounded-lg d-none d-md-block" @click="addAdminDialogShow = true">新增管理員+</v-btn>
      </div>

      <div class="d-flex align-center">
        <v-menu offset-y v-model="authMenuShow" v-if="$store.state.nowWidth >= 960">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="darkPrimary1"
              depressed
              dark
              class="rounded-lg d-none d-md-block mr-6"
              v-bind="attrs"
              v-on="on"
            >
              權限
              <v-icon class="ml-5">mdi-filter-variant</v-icon>
            </v-btn>
          </template>
          <v-card class="white py-4 font-weight-bold">
            <v-list>
              <v-list-item
                v-for="item in [{tag: null, id: 0}, ...authorityList]"
                :key="item.id"
                class="px-5"
                :class="{'darkPrimary1': currAuth === item.id}"
                dense
                @click="currAuth = item.id"
              >
                {{ item.tag || '全部' }}
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        
        <searchInput :searchText.sync="search"></searchInput>
        <accountBlock></accountBlock>
        <div class="d-md-none d-block filter-block">
          <v-icon color="lightPrimary" @click="mobileDrawer = true">mdi-filter</v-icon>
        </div>
      </div>
    </div>

    <section class="mt-10">
      <div class="d-md-none d-flex justify-center mb-7">
        <div class="d-flex align-center">
          顯示
          <inputBlock
            mode="select"
            style="margin: 0 10px; width: 75px;"
            width="75"
            :selectItems="$store.state.pageItems"
            :inputText.sync="itemPerPage"
          ></inputBlock>
          頁面
        </div>
      </div>

      <authorityTable
        :itemPerPage="itemPerPage"
        :headers="headers"
        :list="filterList"
        :authorityList="authorityList"
        @getAdminList="getAdminList()"
      ></authorityTable>
    </section>

    <!-- add admin dialog -->
    <v-dialog v-model="addAdminDialogShow" width="100%" max-width="585">
      <v-card class="pa-4">
        <div class="d-flex justify-end">
          <v-icon class="ma-4 ma-md-0" @click="addAdminDialogShow = false">mdi-close</v-icon>
        </div>
        <div class="py-3 px-5">
          <div class="d-flex flex-column flex-md-row justify-space-between align-md-end align-start mb-10">
            <div class="rem-28 font-weight-bold">新增管理員名單</div>
            <div class="rem-0 grey--text mb-2">審核帳號 {{ $store.state.userInfo.account }}</div>
          </div>

          <addAdmin
            :authorityList="authorityList"
            @getAdminList="addAdminDialogShow = false; getAdminList()"
            @cancel="addAdminDialogShow = false"
          ></addAdmin>
        </div>
      </v-card>
    </v-dialog>

    <v-navigation-drawer
      v-model="mobileDrawer"
      fixed
      right
      width="336"
      temporary
    >
      <div class="pa-3">
        <div class="d-flex justify-end">
          <v-icon large @click="mobileDrawer = false">mdi-close</v-icon>
        </div>

        <div class="px-7 py-2">
          <div class="rem-8 font-weight-bold mb-6 title-text text-center">篩選條件</div>

          <!-- 管理員 -->
          <v-card class="rounded-lg mb-6">
            <v-card-title class="darkPrimary1 white--text py-0 font-weight-bold rem-2 d-flex justify-space-between align-center">
              新增管理員
              <v-icon color="white" @click="adminShow = !adminShow">mdi-plus</v-icon>
            </v-card-title>
            <v-card-text class="lightPrimary px-3 py-2" v-if="adminShow">
              <addAdmin
                :authorityList="authorityList"
                @getAdminList="mobileDrawer = false; getAdminList()"
                @cancel="mobileDrawer = false"
              ></addAdmin>
            </v-card-text>
          </v-card>

          <!-- 權限 -->
          <v-card class="rounded-lg mb-6">
            <v-card-title class="darkPrimary1 white--text py-0 font-weight-bold rem-2 d-flex justify-space-between align-center">
              權限分類
              <v-icon color="white" @click="authTagShow = !authTagShow">mdi-plus</v-icon>
            </v-card-title>
            <v-card-text class="lightPrimary px-0 py-2" v-if="authTagShow">
              <v-list>
                <v-list-item
                  v-for="item in [{tag: null, id: 0}, ...authorityList]"
                  :key="item.id"
                  class="px-5"
                  :class="{'darkPrimary1 white--text': currAuth === item.id}"
                  dense
                  @click="currAuth = item.id; mobileDrawer = false"
                >
                  {{ item.tag || '全部' }}
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import inputBlock from '@/components/inputBlock'
import searchInput from '@/components/searchInput'
import accountBlock from '@/components/accountBlock'
import authorityTable from '@/components/authorityTable'
import addAdmin from '@/components/addAdmin'
export default {
  data() {
    return {
      itemPerPage: 10,
      search: '',
      list: [],
      filterList: [],
      authorityList: [],
      currAuth: 0,
      headers: [
        { text: '', value: 'id', align: 'center', sortable: false },
        { text: '姓名', value: 'name', align: 'center', sortable: false },
        { text: '帳號', value: 'account', align: 'center', sortable: false },
        { text: '地址', value: 'address', align: 'center', sortable: false },
        { text: '權限', value: 'permission', align: 'center', sortable: false },
        { text: '', value: 'action', align: 'center', sortable: false },
      ],
      mobileDrawer: false,
      authTagShow: true,
      adminShow: true,
      authMenuShow: false,
      addAdminDialogShow: false,
    }
  },
  components: {
    inputBlock,
    searchInput,
    accountBlock,
    authorityTable,
    addAdmin,
  },
  watch: {
    async currAuth() {
      await this.getAdminList()
    },
    search(newVal){
      this.filterList = this.list.filter(item => item.name.includes(newVal) || item.address.includes(newVal))
    }
  },
  methods: {
    async getAdminList() {
      this.list = []
      this.filterList = []
      let result = await this.$store.dispatch('getAdminList', {
        auth: this.currAuth
      })
      if (result.status === 231 && result.data) {
        this.list = result.data
        this.filterList = this.list.filter(item => item.name.includes(this.search) || item.address.includes(this.search))
      }
    },
    async getAuthorityList() {
      let result = await this.$store.dispatch('getAuthorityList')
      if (result.status === 231 && result.data) {
        this.authorityList = result.data
      }
    },
  },
  async mounted() {
    await this.getAdminList()
    await this.getAuthorityList()
  }
}
</script>

<style lang="scss">

</style>