<template>
 <div v-if="table">
     <h4 class="text-center">Table Detail</h4>
     <b-table :fields="fields" :items="[table]"></b-table>
     <h4 class="text-center">Table Schema</h4>
 </div>
</template>

<script>
import { getTableDetail } from '@/service/table.service'
import moment from 'moment'

const fields = [
  {
    key: 'table_name'
  },
  {
    key: 'create_by'
  },
  {
    key: 'create_date'
  },
  {
    key: 'modified_by'
  },
  {
    key: 'modified_date'
  }
]

export default {
  props: {
    id: {}
  },
  data: () => ({
    table: null,
    fields: fields
  }),
  created () {
    this.getDetail()
  },
  methods: {
    async getDetail () {
      try {
        const res = await getTableDetail(this.id)
        this.table = res
        this.table.created_date = moment(this.table.created_date).format('YYYY-MM-DD')
        this.table.modified_date = moment(this.table.modified_date).format('YYYY-MM-DD')
      } catch (e) {
        this.$message.error(e)
      }
    }
  }
}
</script>

<style>

</style>
