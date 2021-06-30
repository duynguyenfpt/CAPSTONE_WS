<template>
  <div>
    <JobDetail v-if="id" :id="id"/>
  </div>
</template>

<script>
import JobDetail from '@/components/job/detail'
export default {
  components: { JobDetail },
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
