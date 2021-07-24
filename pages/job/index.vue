<template>
  <div>
    <section name="action">
      <b-row>
        <b-col cols="4" class="text-left">
          <b-input-group>
            <b-input
              size="sm"
              placeholder="Search"
              v-model="textSearch"
              @keyup.enter="searchJob(textSearch)"
            />
            <b-input-group-append>
              <b-btn size="sm" variant="primary" @click="searchJob(textSearch)">
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
          <b-btn size="sm" variant="danger" v-if="isDeactive">
            <i class="fa fa-power-off" v-if="isDeactive" />
          </b-btn>
          <b-btn size="sm" variant="success" v-if="isActive">
            <i class="fas fa-check" v-if="isActive" />
          </b-btn>
        </template>

        <template #cell(status)="row">
          <b-badge :variant="getLastestStatusVariant(row.item.status)">{{
            row.item.status
          }}</b-badge>
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
      <job-add ref="add" @onAdded="refreshData" />
    </section>
    <section name="popup">
      <job-edit ref="edit" @onUpdated="refreshData" />
    </section>
    <section name="detail">
      <b-modal id="detail">
        <JobDetail />
      </b-modal>
    </section>
  </div>
</template>

<script>
import { getListJob } from '@/service/job'
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
    key: 'active'
  },
  {
    key: 'action'
  }
]

export default {
  props: {
    id: {}
  },
  data: () => ({
    fields: jobFields,
    textSearch: null,
    pagination: {
      page: 1,
      limit: 5,
      total: 0
    },
    loading: false,
    jobs: [],
    isActive: false,
    isDeactive: false
  }),

  created () {
    this.getList()
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
    async getList () {
      this.loading = true
      try {
        const res = await getListJob(
          this.pagination.page,
          this.pagination.limit
        )
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
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loading = false
      }
    },
    countRecord (index) {
      return (this.pagination.page - 1) * this.pagination.limit + index + 1
    },
    getRequestName (index) {
      let isAll = 'Not All'
      if (this.jobs[index].request.all) {
        isAll = 'All'
      }
      return (
        this.jobs[index].request.requestType +
        ' - ' +
        this.jobs[index].request.id +
        ' - ' +
        isAll
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
    onReload () {
      this.getList()
    }
  }
}
</script>

<style></style>
