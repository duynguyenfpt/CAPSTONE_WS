<template>
  <div v-if="!isDeny">
    <b-row>
      <b-col class="text-center">
        <h1>Request Management</h1>
      </b-col>
    </b-row>
    <section name="action">
      <b-row>
        <b-col sm="3">
          <label>Request Type</label>
          <b-form-select
            v-model="requestType"
            :options="opsRequestType"
            size="sm"
          ></b-form-select>
        </b-col>
        <b-col sm="3">
          <label>Status</label>
          <b-form-select
            v-model="status"
            :options="opsStatus"
            size="sm"
          ></b-form-select>
        </b-col>
        <b-col sm="3">
          <label>Approved By</label>
          <b-input v-model="approvedBy" size="sm"></b-input>
        </b-col>
        <b-col class="text-right" style="margin-top: 32px;">
          <b-btn
            @click="onSearchRequest"
            size="sm"
            class="ml-2"
            variant="primary"
          >
            <i class="fas fa-search" />
            Search
          </b-btn>
          <b-btn @click="onSearchRequest" size="sm" class="ml-2" variant="success">
            <i class="fa fa-sync pr-1" />
            Reload
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
        :fields="tableFields"
        :items="request"
        :busy="loading"
      >
        <template #cell(action)="item">
          <b-btn
            @click="edit(item.item.id, item.item.requestType)"
            size="sm"
            variant="info"
          >
            <i class="fa fa-pen" />
          </b-btn>
          <b-btn size="sm" @click="reset(item.item.id)" variant="danger">
            <i class="fa fa-power-off" aria-hidden="true"></i>
          </b-btn>
        </template>
        <template #cell(viewLog)="item">
          <b-btn @click="log(item.item.id)" size="sm" variant="primary">
            View Note
          </b-btn>
        </template>
        <template #cell(no)="item">
          {{ countRecord(item.index) }}
        </template>
        <template #cell(status)="row">
          <b-badge class="w-100" :variant="getStatusVariant(row.item.status)">
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
        @input="searchRequest"
      />
    </section>
    <section name="popup">
      <request-log ref="log" @onUpdated="refreshData" />
    </section>
    <section name="popup">
      <request-edit ref="edit" @onUpdated="refreshData" />
    </section>
  </div>
  <div v-else>
    <common-deny />
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
    key: 'description',
    tdClass: 'max-width-250'
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
    key: 'action',
    tdClass: 'text-center',
    thClass: 'text-center'
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
    isDeny: false,
    requestType: null,
    status: null,
    approvedBy: null,
    keyType: null,
    keyStatus: null,
    keyApproved: null,
    opsRequestType: [
      { value: null, text: 'Please select an option' },
      { value: 'SyncTable', text: 'SyncTable' },
      { value: 'ETLRequest', text: 'ETLRequest' },
      { value: 'MergeRequest', text: 'MergeRequest' }
    ],
    opsStatus: [
      { value: null, text: 'Please select an option' },
      { value: '0', text: 'Pending' },
      { value: '1', text: 'Approved' },
      { value: '2', text: 'Rejected' }
    ]
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
          return 'secondary'
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
            e.createdDate = moment(this.request.createdDate).format(
              'YYYY-MM-DD'
            )
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
    edit (id, requestType) {
      if (requestType === 'MergeRequest') {
        this.$router.push(`request/${id}`)
      } else {
        this.$refs.edit.show(id)
      }
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
      }
      return 'Pending'
    },
    async searchRequest () {
      this.loading = true
      try {
        const res = await searchRequest(
          this.pagination.page,
          this.pagination.limit,
          this.keyType,
          this.keyStatus,
          this.keyApproved
        )
        if (res.statusCode === '403') {
          this.isDeny = true
        } else {
          this.request = res.data
          this.pagination.total = res.metaData.totalItem
          this.request.forEach((e) => {
            e.createdDate = moment(this.request.createdDate).format(
              'YYYY-MM-DD'
            )
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
    onSearchRequest () {
      this.pagination.page = 1
      this.keyType = this.requestType
      this.keyStatus = this.status
      this.keyApproved = this.approvedBy
      this.searchRequest()
    }
  }
}
</script>

<style>
.max-width-250 {
  max-width: 250px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>
