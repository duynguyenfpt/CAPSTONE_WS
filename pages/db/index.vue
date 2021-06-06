<template>
  <div>
    <section name="action">
      <b-row>
        <b-col cols="4" class="text-left">
          <b-input-group>
            <b-input size="sm" placeholder="Search" />
            <b-input-group-append>
              <b-btn size="sm" variant="primary">
                <i class="fas fa-search" />
              </b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-col>

        <b-col class="text-right">
          <b-btn v-b-modal.new-db size="sm" variant="primary">
            <i class="fa fa-database pr-1" />
            Create Database Connection
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
          {{ item.index + 1 }}
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
          <b-btn v-b-tooltip="`Edit database config`" size="sm" variant="info">
            <i class="fa fa-pen" />
          </b-btn>
          <b-btn
            v-b-tooltip="`Delete database config`"
            size="sm"
            variant="danger"
            @click='deleteDatabaseDetail(item.item.id)'
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
      <b-modal id="new-db" title="Create Database Connection" hide-footer>
        <Config />
      </b-modal>
    </section>
    <section name="detailDb">
      <b-modal id="detailDb">
        <DatabaseDetail />
      </b-modal>
    </section>
  </div>
</template>

<script>
import Config from '@/components/db/config.vue'
import DatabaseDetail from '@/components/db/dbDetail.vue'

import { deleteDatabaseDetail, getListDatabase } from '@/service/db'

import moment from 'moment'

const TableFields = [
  {
    key: 'no',
    sortable: true
  },
  {
    key: 'database_name'
  },
  {
    key: 'port'
  },
  {
    key: 'username'
  },
  {
    key: 'database_type'
  },
  {
    key: 'created_date'
  },
  {
    key: 'action'
  }
]

export default {
  components: { Config, DatabaseDetail },
  props: {
    id: {}
  },
  data: () => ({
    fields: TableFields,
    pagination: {
      page: 1,
      limit: 4,
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
          e.created_date = moment(e.created_date).format('YYYY-MM-DD')
        })

        this.pagination.total = res.meta.total_item
      } catch (e) {
        this.$message.error(e)
      } finally {
        this.loading = false
      }
    },
    async deleteDatabaseDetail (id) {
      try {
        const res = await deleteDatabaseDetail(id)
        if (res.id) {
          this.$message.error('Dont delete success')
        } else {
          this.$message.success('Success')
        }
        this.getList()
      } catch (e) {
        this.$message.error(e)
      }
    }
  }
}
</script>

<style></style>
