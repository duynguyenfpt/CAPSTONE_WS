<template>
<div v-if="!isDeny">
  <div v-if="detail">
    <b-row>
      <b-col cols="6">
        <h4>Request Detail</h4>
      </b-col>
    </b-row>
    <b-table :fields="requestFields" :items="[requestDetail]">
      <template #cell(status)="row">
          <b-badge :variant="getLastestStatusVariant(row.item.status)">{{ getStatus(row.item.status) }}</b-badge>
        </template>
    </b-table>
    <div v-if="!isETL">
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
    <b-table :fields="jobFields" :items="detail">
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
      <b-row>
        <b-col>
          <h4>Query</h4>
          <p style="margin-left: 10px;">{{ query }}</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-if="isExecuted">
          <h4>Sample Data</h4>
          <b-table
          sm
          responsive
          :items="rows"
          :fields="resultFields">
          <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
          </template>
          </b-table>
        </b-col>
        <b-col v-else>
          <div class="text-center" v-if="isFailed">
            <h5 class="msg-fail">{{ msgErr }}</h5>
          </div>
          <div class="text-center" v-else>
            <b-spinner variant="primary" label="Text Centered"></b-spinner>
            <h5>{{ msg }}</h5>
          </div>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col cols="6">
          <b-button size="sm" variant="success" @click="onDownload" v-if="isExecuted">
            <b-spinner variant="success" v-if="isDownload" small></b-spinner>
            Download
          </b-button>
        </b-col>
      </b-row>
    </div>
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
import { getResultDetail, downloadData } from '@/service/etl'
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
    key: 'status'
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
      detail: [],
      listLogDetail: null,
      requestDetail: [],
      loading: false,
      status: null,
      progress: 0,
      isDeny: false,
      isETL: false,
      isVisibleResult: false,
      idItem: 0,
      isLoading: false,
      resultFields: [],
      rows: [],
      isExecuted: false,
      msg: '',
      isDownload: false,
      isFailed: false,
      msgErr: '',
      query: null
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
        case '0':
          return 'secondary'
        case '1':
          return 'success'
        case '2':
          return 'danger'
        case 'retrying':
          return 'warning'
        default:
          return 'secondary'
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
    async getDetail () {
      try {
        this.loading = true
        const res = await getJobDetail(this.id)
        if (res.statusCode === '403') {
          this.isDeny = true
        } else {
          this.detail = res.data
          this.detail.forEach(item => {
            item.server = item.serverDomain + ' - ' + item.serverHost
            item.createdDate = moment(item.createdDate).format('YYYY-MM-DD')
          })
          const requestId = this.detail[0].requestId
          const resRequest = await getDetailRequest(requestId)
          if (resRequest.statusCode === '403') {
            this.isDeny = true
          } else {
            this.requestDetail = resRequest.data
            resRequest.data.createdDate = moment(this.requestDetail.createdDate).format(
              'YYYY-MM-DD'
            )
            resRequest.data.modifiedDate = moment(this.requestDetail.modifiedDate).format(
              'YYYY-MM-DD'
            )
            if (this.requestDetail.requestType === 'ETLRequest') {
              this.isETL = true
              this.query = this.detail[0].query
              this.idItem = requestId
              this.isVisibleResult = true
              this.isLoading = true
              this.msg = ''
              this.rows = []
              try {
                const res = await getResultDetail(this.idItem)
                if (res.statusCode === '403') {
                  this.$notify({ type: 'error', text: 'Error occurred! - Access Denied' })
                  this.isVisibleResult = false
                } else {
                  if (res.code === '200') {
                    if (res.data.status === 'successed') {
                      const totalArray = res.data.content.split('\n')
                      const header = []
                      header.push({
                        key: 'no'
                      })
                      totalArray.forEach((element, index) => {
                        if (index === 0) {
                          // eslint-disable-next-line array-callback-return
                          element.split(',').map(item => {
                            header.push({
                              key: item
                            })
                          })
                        } else {
                          const tempRow = element.split(',')
                          const objData = {}
                          header.forEach((item, i) => {
                            if (item.key === 'no') {
                              objData[`${item.key}`] = index
                            } else {
                              objData[`${item.key}`] = tempRow[i - 1]
                            }
                          })
                          this.rows.push(objData)
                        }
                      })
                      this.resultFields = header
                      this.isExecuted = true
                    } else {
                      if (res.data.status === 'failed') {
                        this.isExecuted = false
                        this.isFailed = true
                        this.msgErr = 'Query is failed'
                      } else {
                        this.isExecuted = false
                        this.msg = 'Query is executing'
                      }
                    }
                    this.isLoading = false
                  } else {
                    this.isExecuted = true
                    this.msg = 'Query is failed'
                  }
                }
              } catch (e) {
                this.isExecuted = true
                this.msg = e.message
              }
            } else {
              this.isETL = false
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
    },
    async onDownload () {
      try {
        this.isDownload = true
        const res = await downloadData(this.idItem)
        if (res.statusCode === '403') {
          this.$notify({ type: 'error', text: 'Error occurred! - Access Denied' })
          this.isVisibleResult = false
        } else {
          if (res.code === '200') {
            this.$notify({ type: 'success', text: 'Download result succeeded' })
            const fileURL = window.URL.createObjectURL(new Blob([res]))
            const fileLink = document.createElement('a')
            fileLink.href = fileURL
            fileLink.setAttribute('download', 'file.csv')
            document.body.appendChild(fileLink)
            fileLink.click()
          } else {
            this.$notify({ type: 'error', text: 'Download result failed' })
          }
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.isDownload = false
      }
    }
  }
}
</script>

<style>
.msg-fail {
  color: red;
}

.query {
  margin-left: 45px;
  margin-bottom: 10px;
}
</style>
