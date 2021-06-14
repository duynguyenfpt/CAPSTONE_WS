<template>
  <div>
    <section name="action">
      <b-row>
        <b-col cols="4" class="text-left">
          <b-input-group>
            <b-input size="sm" placeholder="Search" v-model="textSearch" @keyup.enter="searchDB(textSearch)"/>
            <b-input-group-append>
              <b-btn size="sm" variant="primary" @click="searchDB(textSearch)">
                <i class="fas fa-search" />
              </b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-col>
        <b-col class="text-right">
          <b-btn @click="addDb()" size="sm" variant="primary">
            <i class="fa fa-database pr-1" />
            Create Database
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
        :items="dbs"
        :fields="fields"
        :busy="loading"
      >
        <template #cell(no)="item">
          {{ countRecord(item.index) }}
        </template>

        <template #cell(action)="item">
          <b-btn
            v-b-tooltip="`Detail database config`"
            :to="{ name: 'db-id', params: { id: item.item.id } }"
            size="sm"
            variant="success"
          >
            <i class="fa fa-eye" />
          </b-btn>
          <b-btn
            @click="editDb(item.item.id)"
            v-b-tooltip="`Edit database config`"
            size="sm"
            variant="info"
          >
            <i class="fa fa-pen" />
          </b-btn>
          <b-btn
            v-b-tooltip="`Delete database config`"
            size="sm"
            variant="danger"
            @click="deleteDb(item.item.id)"
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
      <db-add ref="add" @onAdded="onReload"/>
    </section>
    <section name="popup">
      <db-edit ref="edit" @onUpdated="refreshData" />
    </section>
    <section name="detail">
      <b-modal id="detail">
        <DatabaseDetail />
      </b-modal>
    </section>
    <section name="popup">
      <db-delete ref="delete" @onDeleted="onReload"/>
    </section>
  </div>
</template>

<script>
import DatabaseDetail from '~/components/db/detail.vue'
import { getListDatabase } from '@/service/db'
import moment from 'moment'
import { searchDB } from '@/service/shemaChangeHistory'

const TableFields = [
  {
    key: 'no'
  },
  {
    key: 'databaseName'
  },
  {
    key: 'port'
  },
  {
    key: 'username'
  },
  {
    key: 'databaseType'
  },
  {
    key: 'createdDate'
  },
  {
    key: 'action'
  }
]

export default {
  components: { DatabaseDetail },
  props: {
    id: {}
  },
  data: () => ({
    fields: TableFields,
    textSearch: null,
    pagination: {
      page: 1,
      limit: 5,
      total: 0
    },
    loading: false,
    dbs: []
  }),

  created () {
    this.getList()
  },

  methods: {
    async getList () {
      this.loading = true
      try {
        const res = await getListDatabase(
          this.pagination.page,
          this.pagination.limit
        )
        this.dbs = res.data

        this.dbs.forEach((e) => {
          e.createdDate = moment(e.createdDate).format('YYYY-MM-DD')
        })
        this.pagination.total = res.metaData.totalItem
      } catch (e) {

      } finally {
        this.loading = false
      }
    },
    addDb () {
      this.$refs.add.show()
    },
    editDb (id) {
      this.$refs.edit.show(id)
    },
    deleteDb (id) {
      this.$refs.delete.show(id)
    },
    refreshData (data) {
      if (data) {
        this.getList()
      }
    },
    countRecord (index) {
      return (this.pagination.page - 1) * this.pagination.limit + index + 1
    },
    onReload () {
      this.getList()
    },
    async searchDB (page, limit, textSearch) {
      this.loading = true
      try {
        const result = await searchDB(
          this.pagination.page,
          this.pagination.limit,
          this.textSearch
        )
        this.dbs = result.data

        this.dbs.forEach((e) => {
          e.createdDate = moment(e.created_date).format('YYYY-MM-DD')
        })
        this.pagination.total = result.metaData.totalItem
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
