<template>
  <div v-if="detail">
    <b-row>
      <b-col cols="6">
        <h4>Job Detail</h4>
      </b-col>
      <b-col class="text-right">
          <span>Lastest Status</span>
          <b-badge :variant="getLastestStatusVariant(status)" class="text-center badge-status" v-model="status">{{ status }}</b-badge>
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
      <b-col cols="5" class="inline">
        <h4>Job Log</h4>
        <b-progress :value="progress" v-model="progress" :max="100" show-progress animated></b-progress>
      </b-col>
      <b-col class="text-right">
        <b-btn @click="onRefresh" size="sm" class="ml-2" variant="success">
            <i class="fa fa-sync pr-1" />
            Refresh
          </b-btn>
      </b-col>
    </b-row>

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
</template>

<script>
import { getDetailJob, getLogByJob, getLastJobLog } from '@/service/job'
import moment from 'moment'

const jobFields = [
  {
    key: 'jobName'
  },
  {
    key: 'createdBy'
  },
  {
    key: 'createdDate'
  },
  {
    key: 'jobSchedule'
  },
  {
    key: 'maxRetries'
  },
  {
    key: 'numberRetries'
  },
  {
    key: 'excutedBy.username',
    label: 'Excuted By'
  },
  {
    key: 'active'
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
    key: 'databaseName'
  },
  {
    key: 'tableName'
  },
  {
    key: 'step'
  },
  {
    key: 'requestType'
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
        limit: 5,
        total: 0
      },
      jobFields: jobFields,
      logFields: logFields,
      detail: null,
      listLogDetail: null,
      loading: false,
      status: null,
      isActive: false,
      isDeactive: false,
      progress: 0
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
    async getDetail () {
      try {
        this.loading = true
        const res = await getDetailJob(this.id)
        const resList = await getLogByJob(this.id, this.pagination.page, this.pagination.limit)
        const resLast = await getLastJobLog(this.id)
        this.progress = resLast.data.step * 100 / resLast.data.numberStep
        this.listLogDetail = resList.data
        this.pagination.total = resList.metaData.totalItem
        this.detail = res.data
        this.status = res.data.status
        this.detail.createdDate = moment(this.detail.createdDate).format(
          'YYYY-MM-DD'
        )
        if (this.detail.request.all === true) {
          this.detail.jobName = this.detail.request.requestType + ' - ' + resLast.data.tableName + ' - All'
        } else {
          this.detail.jobName = this.detail.request.requestType + ' - ' + resLast.data.tableName + ' - Not All'
        }
        if (this.detail.active === true) {
          this.isActive = true
          this.isDeactive = false
        } else {
          this.isActive = false
          this.isDeactive = true
        }
        if (this.listLogDetail) {
          this.listLogDetail.forEach((e) => {
            e.createdAt = moment(e.createdAt).format('YYYY-MM-DD hh:mm:ss')
          })
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
