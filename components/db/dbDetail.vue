<template>
  <div v-if="detail">
    <h4>Database detail</h4>
    <b-table :fields="dbFields" :items="[detail]"></b-table>
    <h4>Tables</h4>
    <b-table :fields="dbTable" :items="detail.tables" />
    <b-pagination
      :per-page="pagination.limit"
      v-model="pagination.page"
      :total-rows="pagination.total"
      align="right"
      pills
      size="sm"
    />
  </div>
</template>

<script>
import { getDatabaseDetail } from '@/service/db'
import moment from 'moment'

const dbFields = [
  {
    key: 'database_name'
  },
  {
    key: 'port'
  },
  {
    key: 'username'
  },
  {
    key: 'database_type'
  },
  {
    key: 'created_by'
  },
  {
    key: 'created_date'
  },
  {
    key: 'modified_by'
  },
  {
    key: 'modified_date'
  },
  {
    key: 'action'
  }
]

const dbTable = [
  {
    key: 'tableName'
  },
  {
    key: 'created_by'
  },
  {
    key: 'created_date'
  },
  {
    key: 'modified_by'
  },
  {
    key: 'modified_date'
  },
  {
    key: 'action'
  }
]

const fields = [
  {
    key: 'databaseName',
    label: 'Database Name'
  },
  {
    key: 'table',
    label: 'Table'
  }
]
export default {
  props: {
    id: {}
  },

  created () {
    this.getDetail()
  },

  data () {
    return {
      pagination: {
        page: 1,
        limit: 10,
        total: 10
      },
      fields: fields,
      dbFields: dbFields,
      dbTable: dbTable,
      detail: null
    }
  },

  methods: {
    async getDetail () {
      try {
        const res = await getDatabaseDetail(this.id)
        this.detail = res
        this.detail.created_date = moment(this.detail.created_date).format('YYYY-MM-DD')
        this.detail.modified_date = moment(this.detail.modified_date).format('YYYY-MM-DD')
        this.detail.tables.forEach(e => {
          e.created_date = moment(e.created_date).format('YYYY-MM-DD')
        })
        this.detail.tables.forEach(e => {
          e.modified_date = moment(e.modified_date).format('YYYY-MM-DD')
        })
      } catch (e) {}
    }
  }
}
</script>

<style></style>
