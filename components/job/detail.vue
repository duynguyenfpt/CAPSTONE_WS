<template>
<div v-if="!isDeny">
  <div v-if="detail">
    <b-row>
      <b-col cols="6">
        <h4>Request Detail</h4>
      </b-col>
    </b-row>
    <b-table :fields="requestFields" :items="[requestDetail]">
    </b-table>
    <b-row>
      <b-col cols="6">
        <h4>Job Detail</h4>
      </b-col>
      <b-col class="text-right">
        <span>Lastest Status</span>
        <b-badge
          :variant="getLastestStatusVariant(status)"
          class="text-center badge-status"
          v-model="status"
          >{{ status }}</b-badge
        >
      </b-col>
    </b-row>
    <b-table :fields="jobFields" :items="[detail]">
      <template #cell(active)>
        <b-btn size="sm" variant="danger" v-if="isDeactive">
          <i class="fa fa-power-off" v-if="isDeactive" />
        </b-btn>
        <b-btn size="sm" variant="success" v-if="isActive">
          <i class="fas fa-check" v-if="isActive" />
        </b-btn>
      </template>
    </b-table>
    <b-row>
      <b-col cols="6">
        <div class="d-flex align-items-center">
          <h4>Job Log</h4>
          <b-progress
            class="min-width-300"
            :value="progress"
            v-model="progress"
            :max="100"
            show-progress
            animated
          ></b-progress>
        </div>
      </b-col>
      <b-col class="text-right">
        <b-btn @click="onRefresh" size="sm" class="ml-2" variant="success">
          <i class="fa fa-sync pr-1" />
          Refresh
        </b-btn>
      </b-col>
    </b-row>
    <section name="action">
      <b-row>
        <b-col cols="6"></b-col>
        <b-col cols="6" class="text-right">
          <b-input-group>
            <b-input
              size="sm"
              placeholder="Search"
              v-model="textSearch"
              @keyup.enter="searchDB(textSearch)"
            />
            <b-input-group-append>
              <b-btn size="sm" variant="primary" @click="searchDB(textSearch)">
                <i class="fas fa-search" />
              </b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
    </section>
    <section name="view" class="pt-3">
      <b-table
        responsive
        hover
        striped
        :items="listLogDetail"
        :fields="logFields"
        :busy="loading"
      >
        <template #cell(no)="item">
          {{ countRecord(item.index) }}
        </template>
        <template #cell(status)="row">
          <b-badge :variant="getLastestStatusVariant(row.item.status)">{{
            row.item.status
          }}</b-badge>
        </template>
      </b-table>
      <b-pagination
        :per-page="pagination.limit"
        v-model="pagination.page"
        :total-rows="pagination.total"
        align="right"
        size="sm"
        @input="getDetail"
      />
    </section>
  </div>
  <div v-else>
    <content-placeholders class="article-card-block">
      <content-placeholders-text :lines="3" />
      <content-placeholders-text :lines="18" />
    </content-placeholders>
  </div>
  </div>
  <div v-else>
    <common-deny/>
  </div>
</template>

<script>
import { getJobDetail, getLogByJob, getLastJobLog } from '@/service/job'
import { getDetailRequest } from '@/service/request'
import moment from 'moment'

const jobFields = [
  {
    key: 'server'
  },
  {
    key: 'port'
  },
  {
    key: 'port'
  },
  {
    key: 'database'
  },
  {
    key: 'table'
  },
  {
    key: 'createdDate'
  },
  {
    key: 'maxRetries'
  },
  {
    key: 'numberRetries'
  },
  {
    key: 'executedBy',
    label: 'Executed By'
  },
  {
    key: 'active'
  }
]
const requestFields = [
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
  }
]
const logFields = [
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
    key: 'createdAt'
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
        total: 0
      },
      jobFields: jobFields,
      logFields: logFields,
      requestFields: requestFields,
      detail: null,
      listLogDetail: null,
      requestDetail: [],
      loading: false,
      status: null,
      isActive: false,
      isDeactive: false,
      progress: 0,
      isDeny: false
    }
  },
  methods: {
    getLastestStatusVariant (status) {
      switch (status) {
        case 'success':
          return 'success'
        case 'failed':
          return 'danger'
        case 'fail':
          return 'danger'
        case 'processing':
          return 'primary'
        case 'pending':
          return 'secondary'
        case 'retrying':
          return 'warning'
        default:
          return 'secondary'
      }
    },
    async getDetail () {
      try {
        this.loading = true
        const res = await getJobDetail(this.id)
        if (res.statusCode === '403') {
          this.isDeny = true
        } else {
          this.detail = res.data
          if (this.detail.active === true) {
            this.isActive = true
            this.isDeactive = false
          } else {
            this.isActive = false
            this.isDeactive = true
          }
          this.detail.server =
          res.data.serverDomain + ' - ' + res.data.serverHost
          this.detail.createdDate = moment(this.detail.createdDate).format(
            'YYYY-MM-DD'
          )
          const requestId = this.detail.requestId
          const resRequest = await getDetailRequest(requestId)
          if (resRequest.statusCode === '403') {
            this.isDeny = true
          } else {
            resRequest.data.createdDate = moment(this.requestDetail.createdDate).format(
              'YYYY-MM-DD'
            )
            resRequest.data.modifiedDate = moment(this.requestDetail.modifiedDate).format(
              'YYYY-MM-DD'
            )
            this.requestDetail = resRequest.data
            if (this.listLogDetail) {
              this.listLogDetail.forEach((e) => {
                e.createdAt = moment(e.createdAt).format('YYYY-MM-DD hh:mm:ss')
              })
            }
            const resList = await getLogByJob(
              this.id,
              this.pagination.page,
              this.pagination.limit
            )
            if (resList.statusCode === '403') {
              this.isDeny = true
            } else {
              this.pagination.total = resList.metaData.totalItem
              this.listLogDetail = resList.data
              const resLast = await getLastJobLog(this.id)
              if (resLast.statusCode === '403') {
                this.isDeny = true
              } else {
                if (resLast.data !== null) {
                  if (resLast.data.step !== null && resLast.data.numberStep !== null) {
                    this.progress = (resLast.data.step * 100) / resLast.data.numberStep
                  }
                  this.status = resLast.data.status
                }
              }
            }
          }
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loading = false
      }
    },
    onRefresh () {
      this.getDetail()
    },
    countRecord (index) {
      return (this.pagination.page - 1) * this.pagination.limit + index + 1
    }
  }
}
</script>

<style></style>
