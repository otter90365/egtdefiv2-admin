<template>
  <div class="tag-list">
    <v-form ref="addTagForm" lazy-validation>
      <v-text-field
        class="mb-2"
        placeholder="Enter..."
        color="darkPrimary1"
        outlined
        dense
        hide-details="auto"
        v-model="newTag"
        :rules="[dataRules]"
      ></v-text-field>
    </v-form>
    <v-btn
      class="d-flex justify-space-between rounded-lg mb-5"
      depressed
      dark
      width="160"
      color="darkPrimary1"
      @click="addTag()"
    >
      <div>新增分類</div>
      <div>+</div>
    </v-btn>
    
    <v-list>
      <v-list-item
        v-for="item in tagList"
        :key="item.id"
        class="px-0 d-flex justify-space-between align-center"
        :class="{'darkPrimary1': currTag === item.tag}"
        style="border-bottom: solid 1px var(--v-darkPrimary1-base);"
        dense
        @click="$emit('update:currTag', item.tag)"
      >
        <div class="d-flex align-center w-100">
          <v-icon color="darkPrimary1" class="mr-3">mdi-dots-vertical</v-icon>
          <div>{{ item.tag || '全部' }} {{ item.amount === null ? '' : `(${item.amount})` }}</div>
        </div>
        <v-icon v-if="item.tag" @click.stop="deleteTag(item.id)">mdi-close</v-icon>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import base from '@/mixin/base'
export default {
  mixins: [base],
  props: {
    currTag: {
      type: String,
      default: ''
    },
    tagList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      newTag: '',
    }
  },
  methods: {
    async addTag() {
      if (this.$refs.addTagForm.validate()) {
        let result = await this.$store.dispatch('addWhitelistTag', {
          tag: this.newTag
        })

        if (result.status === 230) {
          this.$toasted.show('新增分類成功')
          this.$refs.addTagForm.reset()
          this.$emit('getTagList')
          this.$forceUpdate()
        } else {
          this.$toasted.error('新增分類失敗')
        }
      }
    },
    async deleteTag(id) {
      let result = await this.$store.dispatch('deleteWhitelistTag', {
        id: id
      })
      console.log('result', result)

      if (result.status === 230) {
        this.$toasted.show('刪除分類成功')
        this.$emit('getTagList')
        this.$forceUpdate()
      } else {
        this.$toasted.error('刪除分類失敗')
      }
    }
  }
}
</script>