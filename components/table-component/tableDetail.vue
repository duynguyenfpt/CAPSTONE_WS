<template>
 <div v-if="table">
     <h4 class="text-center">Table Detail</h4>
     <b-table :fields="fields" :items="[table]"></b-table>
     <h4 class="text-center">Table Schema</h4>
     <b-table :fields="schemaFields" :items="table.current_table_schemas"></b-table>
     <b-pagination
        size="sm"
        v-model="pagination.page"
        :per-page="pagination.limit"
        :total-rows="pagination.total"
        align="right"
        @input="table.current_table_schemas"
      />
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
const schemaFields = [
  {
    key: 'row_name'
  },
  {
    key: 'row_type'
  },
  {
    key: 'type_size'
  },
  {
    key: 'default_value'
  },
  {
    key: 'possible_value'
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
        this.table = res
        this.table.current_table_schemas = res.current_table_schemas
        this.table.created_date = moment(this.table.created_date).format('YYYY-MM-DD')
        this.table.modified_date = moment(this.table.modified_date).format('YYYY-MM-DD')
        this.table.current_table_schemas.forEach((e) => {
          e.created_date = moment(e.created_date).format('YYYY-MM-DD')
        })
        this.table.current_table_schemas.forEach((e) => {
          e.modified_date = moment(e.modified_date).format('YYYY-MM-DD')
        })
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  }
}
</script>

<style>

</style>
