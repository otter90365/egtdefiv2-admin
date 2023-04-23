<template>
  <div class="order-table">
    <div class="d-none d-md-block">
      <v-data-table
        :headers="headers"
        :items="currList"
        :items-per-page="itemPerPage"
        hide-default-footer
        @click:row="clickRow"
      >
        <!-- header -->
        <template v-slot:header.tag="{}">
          <div class="d-flex align-center">
            分類
            <v-icon class="ml-1" color="darkPrimary2" small @click="tagDialogShow = true">mdi-note-edit</v-icon>
          </div>
        </template>

        <!-- item -->
        <template v-slot:item.id="{item}">
          <span class="lightPrimary--text">#{{ item.id }}</span>
        </template>
        <template v-slot:item.create_time="{item}">
          {{ timestampToTime(item.create_time * 1000) }}
        </template>
        <template v-slot:item.memo="{item}">
          <div class="d-flex align-center">
            {{ item.memo }}
            <v-icon class="ml-2" color="darkPrimary2" small @click.stop="showEditMemo(item)">mdi-note-edit</v-icon>
          </div>
        </template>
        <template v-slot:item.action="{}">
          <v-icon color="darkPrimary2">mdi-trash-can</v-icon>
        </template>
      </v-data-table>
    </div>

    <template v-if="currList.length">
      <v-row
        class="d-block d-md-none mobile-order py-3 px-2 mb-2 can-click"
        v-for="item in currList"
        :key="item.id"
        @click="clickRow(item)"
      >
        <v-row class="rem-0" align="center">
          <v-col cols="2" class="lightPrimary--text">#{{ item.id }}</v-col>
          <v-col cols="10">
            <div class="d-flex justify-space-between font-weight-bold">
              <div>{{ item.name }}</div>
              <div>{{ `${item.address.slice(0, 4)}...${item.address.slice(36)}` }}</div>
              <div>{{ timestampToTime(item.create_time * 1000) }}</div>
            </div>
            <div class="d-flex align-center">
              <div class="pa-1 primary rounded-lg">{{ item.tag }}</div>
              <div class="mx-2">{{ item.memo }}</div>
              <v-icon color="darkPrimary2" small @click.stop="showEditMemo(item)">mdi-note-edit</v-icon>
            </div>
          </v-col>
        </v-row>
      </v-row>
    </template>
    <v-row v-else class="d-block d-md-none text-center rounded-lg grey--text mb-5" style="border: solid 1px lightgray;">
      <v-col cols="12">
        No data available
      </v-col>
    </v-row>

    <v-pagination v-model="page" circle :length="totalPage" :total-visible="7"></v-pagination>

    <!-- detailed info -->
    <v-dialog v-model="detailsShow" fullscreen>
      <div class="white detailed-info-card text-center">
        <h2 class="font-weight-bold rem-8">白名單細項</h2>

        <div class="font-weight-bold" style="padding: 96px 0;">
          <div class="rem-20 mb-7">{{ currItem.name }}</div>
          <div class="rem-2 mb-5">{{ currItem.tag }}</div>
          <div class="rem-2 mb-5">{{ currItem.address }}</div>
          <div class="rem-2 mb-5">{{ timestampToTime(currItem.create_time * 1000) }}</div>
          <div class="rem-2 mb-5">{{ currItem.memo }}</div>
        </div>

        <v-btn class="rounded-lg" color="darkPrimary1" dark depressed width="125" @click="detailsShow = false">關閉</v-btn>
      </div>
    </v-dialog>

    <!-- edit tag list -->
    <v-dialog v-model="tagDialogShow" width="420">
      <v-card class="pa-4">
        <div class="d-flex justify-end">
          <v-icon @click="tagDialogShow = false" small>mdi-close</v-icon>
        </div>
        <div class="py-3 px-5">
          <div class="rem-28 font-weight-bold">編輯白名單分類</div>
          <div class="rem-0 grey--text mb-8">審核帳號 {{ $store.state.userInfo.account }}</div>

          <tagList
            :tagList="tagList"
            :currTag.sync="tag"
            @getTagList="$emit('getTagList')"
          ></tagList>
        </div>
      </v-card>
    </v-dialog>

    <!-- edit memo -->
    <v-dialog v-model="memoDialogShow" :fullscreen="$store.state.nowWidth < 960" width="100%" max-width="585">
      <v-card class="pa-4">
        <div class="d-flex justify-end">
          <v-icon class="ma-4 ma-md-0" @click="memoDialogShow = false">mdi-close</v-icon>
        </div>
        <div class="py-3 px-5">
          <div class="d-flex flex-column flex-md-row justify-space-between align-md-end align-start">
            <div class="rem-28 font-weight-bold">編輯白名單備註</div>
            <div class="rem-0 grey--text mb-2">審核帳號 {{ $store.state.userInfo.account }}</div>
          </div>

          <div class="memo-edit-block font-weight-bold">
            <div class="rem-24 mb-5 mb-md-8">{{ currItem.name }}</div>
            <div class="rem-4 rem-md-8 mb-3">{{ currItem.tag }}</div>
            <div class="rem-4 rem-md-8 mb-3">{{ currItem.address }}</div>
            <div class="rem-4 rem-md-8 mb-7 mb-md-8">{{ timestampToTime(currItem.create_time * 1000) }}</div>
            <div class="rem-4 rem-md-8 mb-2">白名單備註</div>
            <v-form ref="memoForm" lazy-validation>
              <v-text-field
                placeholder="Enter..."
                color="darkPrimary1"
                outlined
                v-model="newMemo"
                :rules="[dataRules, (v) => (v && v.length <= 8) || '字數超過限制']"
              ></v-text-field>
            </v-form>
          </div>

          <div class="d-flex justify-space-between mx-auto" style="max-width: 363px;">
            <v-btn width="33%" outlined depressed color="darkPrimary1" @click="memoDialogShow = false">取消</v-btn>
            <v-btn width="33%" depressed dark color="darkPrimary1" @click="updateMemo()">確認</v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import base from '@/mixin/base'
import tagList from '@/components/tagList'
export default {
  mixins: [base],
  props: {
    itemPerPage: {
      type: Number,
      default: 10
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    tagList: {
      type: Array,
      default: () => {
        return []
      }
    },
    headers: {
      type: Array,
      default: () => {
        return []
      }
    },
    // input items
    currTag: String,
  },
  data() {
    return {
      page: 1,
      detailsShow: false,
      currItem: {},
      tagDialogShow: false,
      tag: '',
      memoDialogShow: false,
      newMemo: '',
    }
  },
  watch: {
    tag(newVal) {
      this.$emit('update:currTag', newVal)
    },
    currTag(newVal) {
      this.tag = newVal
    },
    itemPerPage() {
      this.page = 1
      this.$forceUpdate()
    },
  },
  components: {
    tagList
  },
  computed: {
    totalPage() {
      return Math.ceil(this.list.length / this.itemPerPage)
    },
    currList() {
      return this.list.slice(this.itemPerPage * (this.page - 1), this.itemPerPage * this.page)
    },
  },
  methods: {
    clickRow(item) {
      this.detailsShow = true
      this.currItem = item
    },
    showEditMemo(item) {
      this.currItem = item;
      this.newMemo = this.currItem.memo
      this.memoDialogShow = true;
    },
    async updateMemo() {
      if (this.$refs.memoForm.validate()) {
        let result = await this.$store.dispatch('updateWhitelistInfo', {
          id: this.currItem.id,
          memo: this.newMemo
        })

        if (result.status === 230) {
          this.$toasted.show('更新成功')
          this.memoDialogShow = false;
          this.$refs.memoForm.reset()
          this.$emit('getWhitelistList')
        } else {
          this.$toasted.error('更新失敗')
        }
      }
    }
  },
  mounted() {
    this.tag = this.currTag
  },
}
</script>

<style lang="scss">
.order-table  {
  th, td {
    border-bottom: 2px solid var(--v-lightPrimary-base) !important;
  }
  .mobile-order {
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
  }
}
.detailed-info-card {
  padding: 40px 80px;
  h2 {
    padding-bottom: 12px;
    border-bottom: 2px solid var(--v-lightPrimary-base);
  }
}
.memo-edit-block {
  padding: 96px 0;
  @include dai_vuetify_md {
    padding: 56px 0;
  }
}
</style>