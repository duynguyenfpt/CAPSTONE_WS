<template>
  <div class="modal-detail">
    <a-modal v-model="visible" title="Basic Modal" @ok="handleOk">
      <p>ID: {{ data_detail.id }}</p>
      <p>Title: {{ data_detail.title }}</p>
      <p>Content: {{ data_detail.content }}</p>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    data_detail: {
      typeof: Object,
      require: true
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    handleOk () {
      this.visibleDetail = false
    }
  }
}
</script>
