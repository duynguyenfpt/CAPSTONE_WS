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
              <b-btn
                size="sm"
                variant="primary"
                @click="searchJob(textSearch)"
              >
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

        <template #cell(cancel)="row">
          <b-badge :variant="getCancelVariant(row.item.cancel)">{{
            row.item.cancel
          }}</b-badge>
        </template>

        <template #cell(lastestStatus)="row">
          <b-badge :variant="getLastestStatusVariant(row.item.lastestStatus)">{{
            row.item.lastestStatus
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
const jobFields = [
  {
    key: 'no'
  },
  {
    key: 'request'
  },
  {
    key: 'creator'
  },
  {
    key: 'executedBy'
  },
  {
    key: 'jobSchedule'
  },
  {
    key: 'lastestStatus'
  },
  {
    key: 'cancel',
    variant: 'denger'
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
    jobs: []
  }),

  created () {
    this.getList()
  },

  methods: {
    getCancelVariant (cancel) {
      switch (cancel) {
        case 'Activate':
          return 'success'
        case 'Deactivate':
          return 'danger'
        default:
          return 'secondary'
      }
    },
    getLastestStatusVariant (lastestStatus) {
      switch (lastestStatus) {
        case 'Success':
          return 'success'
        case 'Fail':
          return 'danger'
        default:
          return 'secondary'
      }
    },
    async getList () {
      this.loading = true
      try {
        const res = {
          code: '200',
          message: null,
          data: [
            {
              id: 1,
              request: 'request1212',
              creator: 'huongdlq',
              executedBy: 'linhntt',
              jobSchedule: '00**0',
              lastestStatus: 'Fail',
              cancel: 'Deactivate'
            },
            {
              id: 2,
              request: 'request1213',
              creator: 'longvt',
              executedBy: 'cuongnx',
              jobSchedule: '00**0',
              lastestStatus: 'Success',
              cancel: 'Activate'
            }
          ],
          metaData: {
            totalPage: 1,
            totalItem: 2
          }
        }
        this.jobs = res.data
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
    }
  }
}
</script>

<style></style>
