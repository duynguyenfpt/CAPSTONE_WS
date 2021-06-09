<template>
  <div>
    <TableDetail v-if="id" :id="id" />
  </div>
</template>

<script>
import TableDetail from '@/components/table-component/tableDetail.vue'
export default {
  components: {
    TableDetail
  },
  data: () => ({
    id: null
  }),
  created () {
    this.id = this.$route.params.id
  }
}
</script>

<style></style>
