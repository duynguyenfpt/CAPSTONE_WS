<template>
  <div>
    <DatabaseDetail v-if="id" :id="id"/>
  </div>
</template>

<script>
import DatabaseDetail from '@/components/db/dbDetail'
export default {
  components: { DatabaseDetail },
  data: () => ({
    id: null
  }),
  created () {
    this.id = this.$route.params.id
  }
}
</script>

<style>

</style>
