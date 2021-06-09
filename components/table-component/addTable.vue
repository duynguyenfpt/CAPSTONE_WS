<template>
  <div>
    ADD TABLE
  </div>
</template>

<script>
import { addTable } from '~/service/table'

export default {
  data: () => ({
    loading: false,
    table: {
      table_name: null,
      database_infor_id: null
    }
  }),

  methods: {
    async addTable () {
      this.loading = true
      try {
        const res = await addTable(this.table)
        const tableID = res.table_id
        if (tableID) {
          // thong bao thanh cong
        } else {
          // thong bao loi
        }
      } catch (e) {
        // thong bao loi
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>
