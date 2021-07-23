<template>
  <div>
    <section name="action">
      <b-row>
        <b-col class="text-right">
          <b-btn @click="addRight()" size="sm" variant="primary">
            <i class="fa fa-plus pr-1" />
            Create Right
          </b-btn>
        </b-col>
      </b-row>
    </section>
    <section name="view" class="pt-3">
      <b-table
        responsive
        hover
        striped
        :items="accounts"
        :fields="fields"
        :busy="loading"
      >
        <template #cell(no)="item">
          {{ countRecord(item.index) }}
        </template>

        <template #cell(action)="item">
          <b-btn
            @click="detailRight(item.item.id)"
            size="sm"
            variant="success"
          >
            <i class="fa fa-eye" />
          </b-btn>
          <b-btn @click="editRight(item.item.id)" size="sm" variant="info">
            <i class="fa fa-pen" />
          </b-btn>
          <b-btn
            size="sm"
            variant="danger"
            @click="deleteRight(item.item.id)"
          >
            <i class="fa fa-trash" />
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
      <right-add ref="add" @onAdded="onReload" />
    </section>
    <section name="popup">
      <right-detail ref="detail" @onDetailed="onReload" />
    </section>
    <section name="popup">
      <right-edit ref="edit" @onUpdated="refreshData" />
    </section>
    <section name="popup">
      <right-delete ref="delete" @onDeleted="onReload" />
    </section>
  </div>
</template>

<script>
import { getList } from '@/service/right'
import moment from 'moment'

const rightFields = [
  {
    key: 'no'
  },
  {
    key: 'rightName'
  },
  {
    key: 'code'
  },
  {
    key: 'createdBy'
  },
  {
    key: 'createdDate'
  },
  {
    key: 'modifiedBy'
  },
  {
    key: 'modifiedDate'
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
    fields: rightFields,
    pagination: {
      page: 1,
      limit: 5,
      total: 0
    },
    loading: false
  }),

  created () {
    this.getList()
  },

  methods: {
    async getList () {
      this.loading = true
      try {
        const res = await getList(
          this.pagination.page,
          this.pagination.limit
        )
        this.accounts = res.data
        this.accounts.forEach((e) => {
          e.createdDate = moment(e.createdDate).format('YYYY-MM-DD')
          e.modifiedDate = moment(e.modifiedDate).format('YYYY-MM-DD')
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
    },
    refreshData (data) {
      if (data) {
        this.getList()
      }
    },
    addRight () {
      this.$refs.add.show()
    },
    detailRight (id) {
      this.$refs.detail.show(id)
    },
    editRight (id) {
      this.$refs.edit.show(id)
    },
    deleteRight (id) {
      this.$refs.delete.show(id)
    }
  }
}
</script>

<style></style>
