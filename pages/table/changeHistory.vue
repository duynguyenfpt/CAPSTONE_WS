<template>
<div v-if="!isDeny">
  <div v-if="schemaChanges">
    <b-row>
      <b-col sm="10" class="text-center">
        <h1>Table schema change log</h1>
      </b-col>
      <b-col sm="2" class="text-right">
        <b-btn @click="onReload" size="sm" class="ml-2" variant="success">
          <i class="fa fa-sync pr-1" />
          Reload
        </b-btn>
      </b-col>
    </b-row>

    <!-- Select Database from api -->
    <b-row>
      <b-col>
        <label>Database</label>
        <b-form-select
          size="sm"
          v-model="db"
          :options="databaseOps"
          @change="getTableToDB"
        ></b-form-select>
      </b-col>
      <!-- Select table theo DB -->
      <b-col>
        <label>Table</label>
        <b-form-select
          size="sm"
          v-model="tableOfDb"
          :options="tableOps"
        ></b-form-select>
      </b-col>
      <!-- Select Type Change fix data -->
      <b-col>
        <label>Type Changes</label>
        <b-form-select
          size="sm"
          v-model="typeChange"
          :options="typeChangeOps"
        ></b-form-select>
      </b-col>
      <!-- Filter search -->
      <b-col class="pt-4 text-right">
        <b-button size="sm" variant="primary" @click="filter" class="btn-fliter">
          Filter
        </b-button>
      </b-col>
    </b-row>
    <!-- Get list Tables change history -->
    <b-row class="pt-4">
      <b-table
      responsive
      hover
      striped
      :items="schemaChanges"
      :fields="fields"
      :busy="loading">
        <template #cell(no)="item">
          {{ countRecord(item.index) }}
        </template>
        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>
      </b-table>
    </b-row>
    <section>
      <b-pagination
        size="sm"
        v-model="pagination.page"
        :per-page="pagination.limit"
        :total-rows="pagination.total"
        align="right"
        @input="getAllChangeHistory"
      />
    </section>
  </div>
</div>
<div v-else>
  <common-deny/>
</div>
</template>

<script>
import {
  getAllChangeHistory,
  filterByTableIdAndTypeChange
} from '@/service/tableSchemaChangeHistory'
import { getListDatabase } from '@/service/db'
import { getAllTableByDb } from '@/service/table.service'
const fields = [
  { key: 'no' },
  { key: 'tableInfo.databaseInfo.databaseName', label: 'Database' },
  { key: 'tableInfo.tableName', label: 'Table' },
  { key: 'fieldChange' },
  { key: 'changeType' },
  { key: 'oldValue' },
  { key: 'newValue' },
  { key: 'modifiedDate' }
]
export default {
  data: () => ({
    pagination: {
      page: 1,
      limit: 4,
      total: 0
    },
    fields: fields,
    databaseOps: [
      { value: null, text: 'Please select a database' }
    ],
    tableOps: [
      { value: null, text: 'Please select a table' }
    ],
    typeChangeOps: [
      { value: null, text: 'Please select a type' },
      { value: 'added', text: 'Added' },
      { value: 'deleted', text: 'Deleted' },
      { value: 'changeType', text: 'Change Type' },
      { value: 'changeSize', text: 'Change Size' },
      { value: 'changeDefault', text: 'Change Defautl' },
      { value: 'changePossibleValues', text: 'Change Possible Values' }
    ],
    db: null,
    tableOfDb: null,
    typeChange: null,
    schemaChanges: [],
    loading: false,
    isDeny: false
  }),

  created () {
    this.getAllChangeHistory()
  },
  methods: {
    async getAllChangeHistory () {
      try {
        this.loading = true
        console.log('api')
        const res = await getAllChangeHistory(
          this.pagination.page,
          this.pagination.limit
        )
        if (res.statusCode === '403') {
          this.isDeny = true
        } else {
          this.schemaChanges = res.data
          this.pagination.total = res.metaData.totalPage
          const dbRes = await getListDatabase(1, 1000)
          if (dbRes.statusCode === '403') {
            this.isDeny = true
          } else {
          // eslint-disable-next-line array-callback-return
            dbRes.data.map((item) => {
              this.databaseOps.push({ value: item.id, text: item.databaseName })
            })
          }
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loading = false
      }
    },
    async getTableToDB (db) {
      try {
        if (db != null) {
          const resTable = await getAllTableByDb(db, 1, 1000)
          if (resTable.statusCode === '403') {
            this.isDeny = true
          } else {
          // eslint-disable-next-line array-callback-return
            resTable.data.map((item) => {
              this.tableOps.push({ value: item.id, text: item.tableName })
            })
          }
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      }
    },
    countRecord (index) {
      return (this.pagination.page - 1) * this.pagination.limit + index + 1
    },
    async filter (tableOfDb, typeChange) {
      try {
        this.loading = true
        const res = await filterByTableIdAndTypeChange(
          this.tableOfDb,
          this.pagination.page,
          this.pagination.limit,
          this.typeChange
        )
        if (res.statusCode === '403') {
          this.isDeny = true
        } else {
          this.schemaChanges = res.data
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loading = false
      }
    },
    onReload () {
      this.db = null
      this.tableOfDb = null
      this.typeChange = null
      this.getAllChangeHistory()
    }
  }
}
</script>

<style></style>
