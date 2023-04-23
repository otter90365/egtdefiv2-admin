<template>
  <div class="whitelist-page">
    <div class="header-block d-flex justify-space-between align-center">
      <div class="d-flex align-center">
        <div
          class="icon-expand lightPrimary rounded-circle d-md-none d-flex justify-center align-center can-click mr-3"
          @click="$store.commit('updateSidebarClose', !$store.state.sidebarClose)"
        >
          <v-icon color="black">{{ $store.state.sidebarClose ? 'mdi-chevron-right' : 'mdi-chevron-left'}}</v-icon>
        </div>
        <h1 class="rem-md-24 rem-14 font-weight-bold mr-1">白名單管理</h1>
        <v-btn color="darkPrimary1" depressed dark class="rounded-lg d-none d-md-block">新增白名單+</v-btn>
      </div>

      <div class="d-flex align-center">
        <v-menu offset-y v-model="tagMenuShow" v-if="$store.state.nowWidth >= 960">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="darkPrimary1"
              depressed
              dark
              class="rounded-lg d-none d-md-block mr-6"
              v-bind="attrs"
              v-on="on"
            >
              分類
              <v-icon class="ml-5">mdi-filter-variant</v-icon>
            </v-btn>
          </template>
          <v-card class="white py-4 font-weight-bold">
            <v-list>
              <v-list-item
                v-for="item in [{tag: null, id: -1, amount: null}, ...tagList]"
                :key="item.id"
                class="px-5"
                :class="{'darkPrimary1': currTag === item.tag}"
                dense
                @click="currTag = item.tag"
              >
                {{ item.tag || '全部' }}{{ item.amount === null ? '' : `(${item.amount})` }}
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
      <div class="d-md-none d-flex justify-space-between align-center mb-7">
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <div class="d-flex align-center">
          顯示
          <inputBlock
            mode="select"
            style="margin: 0 10px; width: 75px;"
            placeholder="幣值選項"
            width="75"
            :selectItems="$store.state.pageItems"
            :inputText.sync="itemPerPage"
          ></inputBlock>
          頁面
        </div>
        <v-spacer></v-spacer>
      </div>

      <whitelistTable
        :itemPerPage="itemPerPage"
        :headers="headers"
        :list="filterList"
        :tagList="[{tag: null, id: -1, amount: null}, ...tagList]"
        :currTag.sync="currTag"
        @getTagList="getWhitelistTagList()"
        @getWhitelistList="getWhitelistList()"
      ></whitelistTable>
    </section>

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

          <!-- 分類 -->
          <v-card class="rounded-lg mb-6">
            <v-card-title class="darkPrimary1 white--text py-0 font-weight-bold rem-2 d-flex justify-space-between align-center">
              新增分類
              <v-icon color="white" @click="tagShow = !tagShow">mdi-plus</v-icon>
            </v-card-title>
            <v-card-text class="lightPrimary px-3 py-2" v-if="tagShow">
              <tagList
                :tagList="tagList"
                :currTag.sync="currTag"
                @getTagList="getWhitelistTagList"
              ></tagList>
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
import whitelistTable from '@/components/whitelistTable'
import tagList from '@/components/tagList'
export default {
  data() {
    return {
      itemPerPage: 10,
      search: '',
      list: [],
      filterList: [],
      tagList: [],
      currTag: '',
      headers: [
        { text: '', value: 'id', align: 'center', sortable: false },
        { text: '姓名', value: 'name', align: 'center', sortable: false },
        { text: '分類', value: 'tag', align: 'center', sortable: false },
        { text: '地址', value: 'address', align: 'center', sortable: false },
        { text: '通過時間', value: 'create_time', align: 'center', sortable: false },
        { text: '備註', value: 'memo', align: 'center', sortable: false },
        { text: '', value: 'action', align: 'center', sortable: false },
      ],
      mobileDrawer: false,
      tagShow: true,
      tagMenuShow: false,
    }
  },
  components: {
    inputBlock,
    searchInput,
    accountBlock,
    whitelistTable,
    tagList
  },
  watch: {
    async currTag() {
      await this.getWhitelistList()
    },
    search(newVal){
      this.filterList = this.list.filter(item => item.name.includes(newVal) || item.address.includes(newVal))
    }
  },
  methods: {
    async getWhitelistList() {
      this.list = []
      this.filterList = []
      let result = await this.$store.dispatch('getWhitelistList', {
        tag: this.currTag
      })
      if (result.status === 231 && result.data) {
        this.list = result.data
        this.filterList = this.list.filter(item => item.name.includes(this.search) || item.address.includes(this.search))
      }
    },
    async getWhitelistTagList() {
      let result = await this.$store.dispatch('getWhitelistTagList')
      if (result.status === 231 && result.data) {
        this.tagList = result.data
      }
    },
  },
  async mounted() {
    await this.getWhitelistList()
    await this.getWhitelistTagList()
  }
}
</script>

<style lang="scss">

</style>