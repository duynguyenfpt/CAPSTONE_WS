<template>
  <div v-if="detail">
    <h4>Database detail</h4>
    <b-table :fields="dbFields" :items="[detail]"></b-table>
    <h4>Tables</h4>
    <b-table :items="detail.tables" />
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

const dbFields = [
  {
    key: 'database_name'
  },
  {
    key: 'port'
  },
  {
    key: 'database_type'
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
      detail: null
    }
  },

  methods: {
    async getDetail () {
      try {
        const res = await getDatabaseDetail(this.id)
        this.detail = res
      } catch (e) {}
    }
  }
}
</script>

<style></style>
