<template>
 <div v-if="table">
     <h4 class="text-center">Table Detail</h4>
     <b-table :fields="fields" :items="[table]"></b-table>
     <h4 class="text-center">Table Schema</h4>
     <b-table :fields="schemaFields" :items="table.currentTableSchemas"></b-table>
     <b-pagination
        size="sm"
        v-model="pagination.page"
        :per-page="pagination.limit"
        :total-rows="pagination.total"
        align="right"
        @input="table.currentTableSchemas"
      />
 </div>
</template>

<script>
import { getTableDetail } from '@/service/table.service'

import moment from 'moment'

const fields = [
  {
    key: 'tableName'
  },
  {
    key: 'createdBy'
  },
  {
    key: 'createdDate'
  },
  {
    key: 'modifiedBy'
  },
  {
    key: 'modifiedDate'
  }
]
const schemaFields = [
  {
    key: 'rowName'
  },
  {
    key: 'rowType'
  },
  {
    key: 'typeSize'
  },
  {
    key: 'defaultValue'
  },
  {
    key: 'possibleValue'
  },
  {
    key: 'createdBy'
  },
  {
    key: 'createdDate'
  },
  {
    key: 'modifiedBy'
  },
  {
    key: 'modifiedDate'
  }
]

export default {
  props: {
    id: {}
  },
  data: () => ({
    table: null,
    fields: fields,
    schemaFields: schemaFields,
    pagination: {
      page: 1,
      limit: 5,
      total: 5
    }
  }),
  created () {
    this.getDetail()
  },
  methods: {
    async getDetail () {
      try {
        const res = await getTableDetail(this.id)
        this.table = res.data
        this.table.currentTableSchemas = res.data.currentTableSchemas
        this.table.createdDate = moment(this.table.createdDate).format('YYYY-MM-DD')
        this.table.modifiedDate = moment(this.table.modifiedDate).format('YYYY-MM-DD')
        if (this.table.currentTableSchemas) {
          this.table.currentTableSchemas.forEach((e) => {
            e.createdDate = moment(e.createdDate).format('YYYY-MM-DD')
          })
          this.table.currentTableSchemas.forEach((e) => {
            e.modifiedDate = moment(e.modifiedDate).format('YYYY-MM-DD')
          })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      }
    }
  }
}
</script>

<style>

</style>
