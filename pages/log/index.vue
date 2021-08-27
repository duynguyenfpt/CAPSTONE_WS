<template>
  <div v-if="!isDeny">
    <b-row>
      <b-col class="text-center">
        <h1>Log Management</h1>
      </b-col>
    </b-row>
    <section name="action">
      <b-row class="pt-2">
        <b-col sm="3">
          <label>Username</label>
          <b-input v-model="userName" size="sm"></b-input>
        </b-col>
        <b-col sm="3">
          <label for="example-datepicker">From date</label>
          <b-form-datepicker
            id="date-from"
            :date-format-options="{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }"
            v-model="fromDate"
            class="mb-2"
            size="sm"
          ></b-form-datepicker>
        </b-col>
        <b-col sm="3">
          <label for="example-datepicker">To date</label>
          <b-form-datepicker
            id="date-to"
            :date-format-options="{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }"
            :date-disabled-fn="dateDisabled"
            :min="min"
            v-model="toDate"
            class="mb-2"
            size="sm"
          ></b-form-datepicker>
        </b-col>
        <b-col class="text-right">
          <label></label>
          <b-btn @click="onSearchLog()" variant="primary" size="sm" style="margin-top: 32px; width: 75px">
            Fillter
          </b-btn>
        </b-col>
      </b-row>
    </section>
    <section name="view" class="pt-3">
      <b-table
        small
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
        <template #table-busy>
          <content-placeholders class="article-card-block">
            <content-placeholders-text :lines="2" />
            <content-placeholders-text :lines="6" />
          </content-placeholders>
        </template>
      </b-table>
      <b-pagination
        size="sm"
        v-model="pagination.page"
        :per-page="pagination.limit"
        :total-rows="pagination.total"
        align="right"
        @input="searchLog"
      />
    </section>
  </div>
  <div v-else>
    <common-deny/>
  </div>
</template>

<script>
import { getAllLog, searchLog } from '@/service/log'
import moment from 'moment'

const TableFields = [
  {
    key: 'no'
  },
  {
    key: 'userName'
  },
  {
    key: 'path'
  },
  {
    key: 'requestMethod'
  },
  {
    key: 'bodyRequest',
    tdClass: 'max-width-300'
  },
  {
    key: 'statusCode'
  },
  {
    key: 'createdAt'
  }
]

export default {
  props: {
    id: {}
  },
  data: () => ({
    fields: TableFields,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    },
    loading: false,
    userName: null,
    fromDate: null,
    toDate: null,
    keyName: null,
    keyFrom: null,
    keyTo: null,
    min: null,
    logs: [],
    isDeny: false
  }),

  created () {
    this.getList()
  },

  methods: {
    dateDisabled () {
      this.min = this.fromDate
    },
    async getList () {
      this.loading = true
      try {
        const res = await getAllLog(
          this.pagination.page,
          this.pagination.limit
        )
        if (res.statusCode === '403') {
          this.isDeny = true
        } else {
          this.logs = res.data
          this.logs.forEach((e) => {
            e.createdAt = moment(e.createdAt).format('YYYY-MM-DD hh:mm:ss')
          })
          this.pagination.total = res.metaData.totalItem
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loading = false
      }
    },
    countRecord (index) {
      return (this.pagination.page - 1) * this.pagination.limit + index + 1
    },
    onReload () {
      this.getList()
    },
    async searchLog () {
      this.loading = true
      try {
        const res = await searchLog(
          this.pagination.page,
          this.pagination.limit,
          this.keyName,
          this.keyFrom,
          this.keyTo
        )
        if (res.statusCode === '403') {
          this.isDeny = true
        } else {
          this.logs = res.data
          this.logs.forEach((e) => {
            e.createdAt = moment(e.createdAt).format('YYYY-MM-DD hh:mm:ss')
          })
          this.pagination.total = res.metaData.totalItem
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loading = false
      }
    },
    onSearchLog () {
      this.pagination.page = 1
      this.keyName = this.userName
      this.keyFrom = this.fromDate
      this.keyTo = this.toDate
      this.searchLog()
    }
  }
}
</script>

<style>
.max-width-300 {
  max-width: 300px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>
