<template>
  <div>
    <section name="action">
      <b-row class="pt-2">
        <b-col sm="4">
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
            @context="chooseDateFrom"
          ></b-form-datepicker>
        </b-col>
        <b-col sm="4">
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
            @context="chooseDateTo"
          ></b-form-datepicker>
        </b-col>
        <b-col class="text-right">
          <label></label>
          <b-btn @click="fillLog()" variant="primary" class="btn-fliter" style="margin-top: 32px">
            Fillter
          </b-btn>
        </b-col>
      </b-row>
    </section>
    <section name="view" class="pt-3">
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
        @input="getList"
      />
    </section>
  </div>
</template>

<script>
import { getAllLog } from '@/service/log'
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
    key: 'bodyRequest'
  },
  {
    key: 'response'
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
    fromDate: null,
    toDate: null,
    min: null,
    logs: []
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
        this.logs = res.data
        this.logs.forEach((e) => {
          e.createdAt = moment(e.createdAt).format('YYYY-MM-DD hh:mm:ss')
        })
        this.pagination.total = res.metaData.totalItem
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
    }
  }
}
</script>

<style></style>
