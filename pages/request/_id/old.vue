<template>
  <div>
    <Edit v-if="id" :id="id" />
  </div>
</template>

<script>
import Edit from '@/components/merge/edit2.vue'
export default {
  components: {
    Edit
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
