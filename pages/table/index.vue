<template>
  <div>
    <b-row>
      <b-col class="text-center">
        <h1>Table Management</h1>
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
              @keyup.enter="onSearchTable(textSearch)"
            />
            <b-input-group-append>
              <b-btn
                size="sm"
                variant="primary"
                @click="onSearchTable(textSearch)"
              >
                <i class="fas fa-search" />
              </b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-col>
        <b-col class="text-right">
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
        :fields="tableFields"
        :items="tableList"
        :busy="loading"
      >
        <template #cell(no)="item">
          {{ countRecord(item.index) }}
        </template>
        <template #cell(action)="item">
          <b-btn
            :to="{ name: 'table-id', params: { id: item.item.id } }"
            size="sm"
            variant="success"
          >
            <i class="fa fa-eye" />
          </b-btn>
          <b-btn @click="editTb(item.item.id)" size="sm" variant="info">
            <i class="fa fa-pen" />
          </b-btn>
          <b-btn size="sm" variant="danger" @click="deleteTb(item.item.id)">
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
        @input="searchTable"
      />
    </section>
    <section name="popup">
      <table-component-deleteTable ref="delete" @onDeleted="onReload" />
    </section>
    <section name="popup">
      <table-component-editTable ref="edit" @onUpdated="onReload" />
    </section>
  </div>
</template>

<script>
import { getListTable, searchTable } from '@/service/table.service'
import moment from 'moment'
const tableFields = [
  {
    key: 'no'
  },
  {
    key: 'tableName'
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
  data () {
    return {
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      tableFields: tableFields,
      tableList: null,
      loading: false,
      textSearch: null,
      keyword: null
    }
  },
  created () {
    this.getListTable()
  },
  methods: {
    async getListTable () {
      this.loading = true
      try {
        const res = await getListTable(
          this.pagination.page,
          this.pagination.limit
        )
        this.tableList = res.data
        this.pagination.total = res.metaData.totalItem
        this.tableList.forEach((e) => {
          e.createdDate = moment(this.tableList.createdDate).format(
            'YYYY-MM-DD'
          )
          e.modifiedDate = moment(this.tableList.modifiedDate).format(
            'YYYY-MM-DD'
          )
        })
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loading = false
      }
    },
    deleteTb (id) {
      this.$refs.delete.show(id)
    },
    editTb (id) {
      this.$refs.edit.show(id)
    },
    onReload () {
      this.textSearch = null
      this.keyword = null
      this.getListTable()
    },
    countRecord (index) {
      return (this.pagination.page - 1) * this.pagination.limit + index + 1
    },
    async searchTable () {
      this.loading = true
      try {
        const res = await searchTable(
          this.pagination.page,
          this.pagination.limit,
          this.keyword
        )
        this.tableList = res.data
        this.pagination.total = res.metaData.totalItem
        this.tableList.forEach((e) => {
          e.createdDate = moment(this.tableList.createdDate).format(
            'YYYY-MM-DD'
          )
          e.modifiedDate = moment(this.tableList.modifiedDate).format(
            'YYYY-MM-DD'
          )
        })
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loading = false
      }
    },
    onSearchTable () {
      this.pagination.page = 1
      this.keyword = this.textSearch
      this.searchTable()
    }
  }
}
</script>

<style></style>
