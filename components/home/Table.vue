<template>
  <div>
    <b-table
      responsive
      hover
      striped
      :items="logs"
      :fields="fields"
      :busy="loading"
    >
      <template #cell(no)="item">
        {{ countRecord(item.index) }}
      </template>
      <template #cell(status)="row">
        <b-badge :variant="getLastestStatusVariant(row.item.status)">{{row.item.status}}</b-badge>
      </template>
    </b-table>
  </div>
</template>

<script>
import { getAllJobLog } from '@/service/job'
import moment from 'moment'

const TableFields = [
  {
    key: 'no'
  },
  {
    key: 'host'
  },
  {
    key: 'port'
  },
  {
    key: 'databaseName',
    label: 'Database'
  },
  {
    key: 'tableName',
    label: 'Table'
  },
  {
    key: 'step'
  },
  {
    key: 'requestType',
    label: 'Request'
  },
  {
    key: 'numberStep'
  },
  {
    key: 'message'
  },
  {
    key: 'status'
  },
  {
    key: 'createdTime'
  }
]

export default {
  created () {
    this.getAllJobLog()
  },
  data () {
    return {
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      fields: TableFields,
      loading: false,
      status: null,
      logs: []
    }
  },
  methods: {
    getLastestStatusVariant (status) {
      switch (status) {
        case 'success':
          return 'success'
        case 'fail':
          return 'danger'
        case 'processing':
          return 'primary'
        case 'pending':
          return 'secondary'
        default:
          return 'secondary'
      }
    },
    async getAllJobLog () {
      try {
        this.loading = true
        const res = await getAllJobLog(this.pagination.page, this.pagination.limit)
        this.logs = res.data
        this.logs.forEach((e) => {
          e.createdTime = moment(e.createdTime).format('YYYY-MM-DD hh:mm:ss')
        })
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loading = false
      }
    },
    countRecord (index) {
      return (this.pagination.page - 1) * this.pagination.limit + index + 1
    }
  }
}
</script>
