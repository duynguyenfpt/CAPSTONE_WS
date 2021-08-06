<template>
  <div>
    <b-row>
      <b-col class="text-center">
        <h1>Server Management</h1>
      </b-col>
    </b-row>
    <section name="action">
      <b-row>
        <b-col cols="4" class="text-left">
          <b-input-group>
            <b-input
              size="sm"
              placeholder="Search"
              v-model="textSearch"
              @keyup.enter="onSearchServer()"
            />
            <b-input-group-append>
              <b-btn
                size="sm"
                variant="primary"
                @click="onSearchServer()"
              >
                <i class="fas fa-search" />
              </b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-col>
        <b-col class="text-right">
          <b-btn @click="addServer()" size="sm" variant="primary">
            <i class="fa fa-plus pr-1" />
            Create Server
          </b-btn>
        </b-col>
      </b-row>
    </section>
    <section name="view" class="pt-3">
      <b-table
        responsive
        hover
        striped
        :items="servers"
        :fields="fields"
        :busy="loading"
      >
        <template #cell(no)="item">
          {{ countRecord(item.index) }}
        </template>

        <template #cell(action)="item">
          <b-btn
            @click="detailServer(item.item.id)"
            size="sm"
            variant="success"
          >
            <i class="fa fa-eye" />
          </b-btn>
           <b-btn
            @click="editServer(item.item.id)"
            size="sm"
            variant="info"
          >
            <i class="fa fa-pen" />
          </b-btn>
          <b-btn
            size="sm"
            variant="danger"
            @click="deleteServer(item.item.id)"
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
        @input="searchServer"
      />
    </section>
    <section name="popup">
      <server-add ref="add" @onAdded="onReload" />
    </section>
    <section name="popup">
      <server-detail ref="detail" @onDetailed="onReload" />
    </section>
    <section name="popup">
      <server-edit ref="edit" @onUpdated="refreshData" />
    </section>
    <section name="popup">
      <server-delete ref="delete" @onDeleted="onReload" />
    </section>
  </div>
</template>

<script>
import { getListServer, searchServer } from '@/service/server'
import moment from 'moment'

const serverFields = [
  {
    key: 'no'
  },
  {
    key: 'serverHost'
  },
  {
    key: 'serverDomain'
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
    fields: serverFields,
    textSearch: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    },
    loading: false,
    servers: [],
    keySearch: null
  }),

  created () {
    this.getList()
  },

  methods: {
    async getList () {
      this.loading = true
      try {
        const res = await getListServer(
          this.pagination.page,
          this.pagination.limit
        )
        this.servers = res.data
        this.servers.forEach((e) => {
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
    addServer () {
      this.$refs.add.show()
    },
    detailServer (id) {
      this.$refs.detail.show(id)
    },
    editServer (id) {
      this.$refs.edit.show(id)
    },
    deleteServer (id) {
      this.$refs.delete.show(id)
    },
    async searchServer () {
      this.loading = true
      try {
        const res = await searchServer(
          this.pagination.page,
          this.pagination.limit,
          this.keySearch
        )
        this.servers = res.data
        this.servers.forEach((e) => {
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
    onSearchServer () {
      this.pagination.page = 1
      this.keySearch = this.textSearch
      this.searchServer()
    }
  }
}
</script>

<style></style>
