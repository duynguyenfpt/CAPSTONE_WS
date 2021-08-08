<template>
  <div>
    <b-row>
      <b-col class="text-center">
        <h1>Database Management</h1>
      </b-col>
    </b-row>
    <section name="action">
      <b-row>
        <b-col cols="4" class="text-left">
          <b-input-group>
            <b-input size="sm" placeholder="Search" v-model="textSearch" @keyup.enter="onSearchDB()"/>
            <b-input-group-append>
              <b-btn size="sm" variant="primary" @click="onSearchDB()">
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
            :to="{ name: 'db-id', params: { id: item.item.id } }"
            size="sm"
            variant="success"
          >
            <i class="fa fa-eye" />
          </b-btn>
          <b-btn
            @click="editDb(item.item.id)"
            size="sm"
            variant="info"
          >
            <i class="fa fa-pen" />
          </b-btn>
          <b-btn
            size="sm"
            variant="danger"
            @click="deleteDb(item.item.id)"
          >
            <i class="fa fa-trash" />
          </b-btn>
        </template>
        <template #table-busy>
          <content-placeholders class="article-card-block">
            <content-placeholders-text :lines="2" />
            <content-placeholders-text :lines="6" />
          </content-placeholders>
        </template>
      </b-table>
      <b-pagination
        size="sm"
        v-model="pagination.page"
        :per-page="pagination.limit"
        :total-rows="pagination.total"
        align="right"
        @input="searchDB"
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
    key: 'serverInfor',
    label: 'Host'
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
    key: 'alias'
  },
  {
    key: 'sid'
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
      limit: 10,
      total: 0
    },
    loading: false,
    dbs: [],
    keyword: null
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
        console.log(res.data)
        this.dbs.forEach((e) => {
          if (e.databaseType === 'mysql') {
            e.databaseType = 'My Sql'
          }
          if (e.databaseType === 'postgresql') {
            e.databaseType = 'PostgreSQL'
          }
          if (e.databaseType === 'oracle') {
            e.databaseType = 'Oracle'
          }
        })
        this.dbs.forEach((e) => {
          e.serverInfor = e.serverInfor.serverDomain + ' - ' + e.serverInfor.serverHost
        })
        this.dbs.forEach((e) => {
          if (e.createdDate === null) {
            e.createdDate = 'YYYY-MM-DD'
          } else {
            e.createdDate = moment(e.createdDate).format('YYYY-MM-DD')
          }
        })
        this.pagination.total = res.metaData.totalItem
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
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
        this.textSearch = null
        this.keyword = null
        this.getList()
      }
    },
    countRecord (index) {
      return (this.pagination.page - 1) * this.pagination.limit + index + 1
    },
    onReload () {
      this.textSearch = null
      this.keyword = null
      this.getList()
    },
    async searchDB () {
      this.loading = true
      try {
        const result = await searchDB(
          this.pagination.page,
          this.pagination.limit,
          this.keyword
        )
        this.dbs = result.data
        this.dbs.forEach((e) => {
          e.serverInfor = e.serverInfor.serverDomain + ' - ' + e.serverInfor.serverHost
        })
        this.dbs.forEach((e) => {
          if (e.databaseType === 'mysql') {
            e.databaseType = 'My Sql'
          }
          if (e.databaseType === 'postgresql') {
            e.databaseType = 'PostgreSQL'
          }
          if (e.databaseType === 'oracle') {
            e.databaseType = 'Oracle'
          }
        })
        this.dbs.forEach((e) => {
          e.createdDate = moment(e.created_date).format('YYYY-MM-DD')
        })
        this.pagination.total = result.metaData.totalItem
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loading = false
      }
    },
    onSearchDB () {
      this.pagination.page = 1
      this.keyword = this.textSearch
      this.searchDB()
    }
  }
}
</script>

<style></style>
