<template>
  <div v-if="!isDeny">
    <b-row>
      <b-col class="text-center">
        <h1>Request Management</h1>
      </b-col>
    </b-row>
    <section name="action">
      <b-row>
        <b-col cols="4" class="text-left">
          <b-input-group>
            <b-input size="sm" placeholder="Search" v-model="textSearch" @keyup.enter="searchRequest()"/>
            <b-input-group-append>
              <b-btn size="sm" variant="primary" @click="searchRequest()">
                <i class="fas fa-search" />
              </b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-col>
        <b-col class="text-right">
          <b-btn @click="onReload" size="sm" class="ml-2" variant="success">
            <i class="fa fa-sync pr-1" />
            Reload
          </b-btn>
        </b-col>
      </b-row>
    </section>
    <section name="view" class="pt-3">
      <b-table
      responsive
      hover
      striped
      :fields="tableFields"
      :items="request"
      :busy="loading">
        <template #cell(action)="item">
          <b-btn @click="edit(item.item.id)" size="sm" variant="info">
            <i class="fa fa-pen" />
          </b-btn>
          <b-btn size="sm" @click="reset(item.item.id)" variant="danger">
            <i class="fa fa-power-off" aria-hidden="true"></i>
          </b-btn>
        </template>
        <template #cell(viewLog)="item">
          <b-btn @click="log(item.item.id)" size="sm" variant="primary">
            View Log
          </b-btn>
        </template>
        <template #cell(no)="item">
          {{ countRecord(item.index) }}
        </template>
        <template #cell(status)="row">
          <b-badge :variant="getStatusVariant(row.item.status)">
            {{ getStatus(row.item.status) }}
          </b-badge>
        </template>
        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
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
    <section name="popup">
      <request-edit ref="edit" @onUpdated="refreshData" />
      <request-assign ref="assign" />
    </section>
    <section name="popup">
      <request-log ref="log" @onUpdated="refreshData"/>
    </section>
  </div>
  <div v-else>
    <common-deny/>
  </div>
</template>

<script>
import { getRequest, searchRequest } from '@/service/request'
import moment from 'moment'
const tableFields = [
  {
    key: 'no'
  },
  {
    key: 'requestType'
  },
  {
    key: 'createdBy',
    label: 'Creator'
  },
  {
    key: 'approvedBy',
    label: 'Approver'
  },
  {
    key: 'status',
    variant: 'denger'
  },
  {
    key: 'createdDate'
  },
  {
    key: 'modifiedDate'
  },
  {
    key: 'action'
  },
  {
    key: 'viewLog'
  }
]

export default {
  data: () => ({
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    },
    tableFields: tableFields,
    request: null,
    loading: false,
    textSearch: null,
    isDeny: false
  }),
  created () {
    this.getList()
  },
  methods: {
    getStatusVariant (status) {
      switch (status) {
        case '0':
          return 'secondary'
        case '1':
          return 'success'
        case '2':
          return 'danger'
        default:
          return null
      }
    },
    async getList () {
      this.loading = true
      try {
        const res = await getRequest(
          this.pagination.page,
          this.pagination.limit
        )
        if (res.statusCode === '403') {
          this.isDeny = true
        } else {
          this.request = res.data
          this.pagination.total = res.metaData.totalItem
          this.request.forEach((e) => {
            e.createdDate = moment(this.request.createdDate).format('YYYY-MM-DD')
            e.modifiedDate = moment(this.request.modifiedDate).format(
              'YYYY-MM-DD'
            )
          })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loading = false
      }
    },
    edit (id) {
      this.$refs.edit.show(id)
    },
    onAssign () {
      this.$refs.assign.onShow()
    },
    log (id) {
      this.$refs.log.show(id)
    },
    countRecord (index) {
      return (this.pagination.page - 1) * this.pagination.limit + index + 1
    },
    refreshData (data) {
      if (data) {
        this.getList()
      }
    },
    getStatus (status) {
      if (status === '0') {
        return 'Pending'
      } else if (status === '1') {
        return 'Approved'
      } else if (status === '2') {
        return 'Rejected'
      } return null
    },
    async searchRequest () {
      this.loading = true
      try {
        this.pagination.page = 1
        const res = await searchRequest(
          this.pagination.page,
          this.pagination.limit,
          this.textSearch
        )
        this.request = res.data
        this.pagination.total = res.metaData.totalItem
        this.request.forEach((e) => {
          e.createdDate = moment(this.request.createdDate).format('YYYY-MM-DD')
          e.modifiedDate = moment(this.request.modifiedDate).format(
            'YYYY-MM-DD'
          )
        })
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style></style>
