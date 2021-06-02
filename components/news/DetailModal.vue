<template>
  <div class="modal-detail">
    <a-modal v-model="visible" title="Detail new" @ok="handleOk">
      <div v-if="loading" class="spinner">
        <a-spin />
      </div>
      <div v-else>
        <p>ID: {{ data.id }}</p>
        <p>Title: {{ data.title }}</p>
        <p>Content: {{ data.content }}</p>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getNewDetail } from '../../service/news'
export default {
  data () {
    return {
      loading: false,
      visible: false,
      data: {}
    }
  },
  methods: {
    async show (id) {
      this.visible = true
      this.loading = true
      this.data = await getNewDetail(id)
      this.loading = false
    },
    handleOk () {
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.spinner {
  text-align: center;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
}
</style>
