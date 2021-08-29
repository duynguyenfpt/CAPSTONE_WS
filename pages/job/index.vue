<template>
  <div v-if="!isDeny">
    <b-row>
      <b-col class="text-center">
        <h1>Job Management</h1>
      </b-col>
    </b-row>
    <section name="action">
      <b-row>
        <b-col cols="4" class="text-left">
          <b-input-group>
            <b-form-select
              v-model="textSearch"
              :options="opsStatus"
              size="sm"
              @change="onSearchJob()"
            ></b-form-select>
            <b-input-group-append>
              <b-btn size="sm" variant="primary" @click="onSearchJob()">
                <i class="fas fa-search" />
              </b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-col>
        <b-col class="text-right">
          <b-btn @click="addJob" size="sm" variant="primary">
            <i class="fa fa-plus pr-1" />
            Create Job
          </b-btn>
          <b-btn @click="onReload" size="sm" class="ml-2" variant="success">
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
        :items="jobs"
        :fields="fields"
        :busy="loading"
      >
        <template #cell(no)="item">
          {{ countRecord(item.index) }}
        </template>
        <template #cell(request)="item">
          {{ getRequestName(item.index) }}
        </template>

        <template #cell(active)>
          <div class="w-100 text-center">
            <b-badge size="sm" variant="danger" v-if="isDeactive">
              <i class="fa fa-power-off" v-if="isDeactive" />
            </b-badge>
            <b-badge size="sm" variant="success" v-if="isActive">
              <i class="fas fa-check" v-if="isActive" />
            </b-badge>
          </div>
        </template>

        <template #cell(status)="row">
          <b-badge
            class="w-100"
            :variant="getLastestStatusVariant(row.item.status)"
            >{{ row.item.status }}</b-badge
          >
        </template>

        <template #cell(action)="item">
          <b-btn
            :to="{ name: 'job-id', params: { id: item.item.id } }"
            size="sm"
            variant="success"
          >
            <i class="fa fa-eye" />
          </b-btn>
          <b-btn @click="editJob(item.item.id)" size="sm" variant="info">
            <i class="fa fa-pen" />
          </b-btn>
          <b-btn
            @click="resetJob(item.item.id)"
            size="sm"
            variant="warning"
            v-b-tooltip="`Reset counter`"
          >
            <i class="fa fa-retweet"></i>
          </b-btn>
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
        @input="searchJob"
      />
    </section>
    <section name="popup">
      <job-add ref="add" @onAdded="refreshData" />
    </section>
    <section name="popup">
      <job-edit ref="edit" @onUpdated="refreshData" />
    </section>
    <section name="popup">
      <job-reset ref="reset" @onReseted="refreshData" />
    </section>
    <section name="detail">
      <b-modal id="detail">
        <JobDetail />
      </b-modal>
    </section>
  </div>
  <div v-else>
    <common-deny />
  </div>
</template>

<script>
import { getListJob, searchJob } from '@/service/job'
import { checkPermission } from '~/service/right'
const jobFields = [
  {
    key: 'no'
  },
  {
    key: 'request'
  },
  {
    key: 'createdBy'
  },
  {
    key: 'excutedBy'
  },
  {
    key: 'jobSchedule'
  },
  {
    key: 'maxRetries'
  },
  {
    key: 'status'
  },
  {
    key: 'active',
    thClass: 'text-center'
  },
  {
    key: 'action',
    thClass: 'text-center',
    tdClass: 'text-center'
  }
]

export default {
  props: {
    id: {}
  },
  data: () => ({
    fields: jobFields,
    textSearch: null,
    keyword: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    },
    loading: false,
    jobs: [],
    isActive: false,
    isDeactive: false,
    isDeny: false,
    opsStatus: [
      { value: null, text: 'Please select an option' },
      { value: 'success', text: 'Success' },
      { value: 'pending', text: 'Pending' },
      { value: 'fail', text: 'Fail' }
    ]
  }),

  async created () {
    await this.checkPermission()
    if (!this.isDeny) {
      await this.getList()
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
    async checkPermission () {
      const data = {
        method: 'GET',
        path: 'job'
      }
      const res = await checkPermission(data)
      if (!res.data.success) {
        this.isDeny = true
      }
    },
    async getList () {
      this.loading = true
      try {
        const res = await getListJob(
          this.pagination.page,
          this.pagination.limit
        )
        if (res.code === '200') {
          this.jobs = res.data
          this.jobs.forEach((e) => {
            e.excutedBy = e.excutedBy.username
          })
          this.jobs.forEach((e) => {
            if (e.active === true) {
              this.isActive = true
              this.isDeactive = false
            } else {
              this.isActive = false
              this.isDeactive = true
            }
          })
          this.pagination.total = res.metaData.totalItem
        } else {
          this.$notify({ type: 'error', text: 'Error occurred!' })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: 'Error occurred!' })
      } finally {
        this.loading = false
      }
    },
    countRecord (index) {
      return (this.pagination.page - 1) * this.pagination.limit + index + 1
    },
    getRequestName (index) {
      return (
        this.jobs[index].request.requestType +
        ' - ' +
        this.jobs[index].request.id
      )
    },
    refreshData (data) {
      if (data) {
        this.getList()
      }
    },
    addJob () {
      this.$refs.add.show()
    },
    editJob (id) {
      this.$refs.edit.show(id)
    },
    resetJob (id) {
      this.$refs.reset.show(id)
    },
    onReload () {
      this.getList()
    },
    async searchJob () {
      this.loading = true
      try {
        const res = await searchJob(
          this.pagination.page,
          this.pagination.limit,
          this.keyword
        )
        if (res.code === '200') {
          this.jobs = res.data
          this.jobs.forEach((e) => {
            e.excutedBy = e.excutedBy.username
          })
          this.jobs.forEach((e) => {
            if (e.active === true) {
              this.isActive = true
              this.isDeactive = false
            } else {
              this.isActive = false
              this.isDeactive = true
            }
          })
          this.pagination.total = res.metaData.totalItem
        } else {
          this.$notify({ type: 'error', text: 'Error occurred!' })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: 'Error occurred!' })
      } finally {
        this.loading = false
      }
    },
    onSearchJob () {
      this.pagination.page = 1
      this.keyword = this.textSearch
      this.searchJob()
    }
  }
}
</script>

<style></style>
