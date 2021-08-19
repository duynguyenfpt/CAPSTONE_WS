<template>
  <section>
    <b-row id="title">
      <b-col class="text-center">
        <h2>Update merge request</h2>
      </b-col>
    </b-row>
    <b-row id="step" align-h="center" class="pt-2">
      <b-col cols="6">
        <el-steps finish-status="success" :active="step">
          <el-step title="Select DB" />
          <el-step title="S2" />
          <el-step title="S3" />
        </el-steps>
      </b-col>
    </b-row>
    <b-row align-h="center" id="step-1" v-if="step == 0">
      <b-col cols="10">
        <b-row align-h="center">
          <b-col>
            <table class="b-table table table-bordered">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Database</th>
                  <th>Table</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(table, idx) in tables" :key="idx">
                  <td>{{ idx + 1 }}</td>
                  <td>
                    <VSelect
                      :options="dbs"
                      v-model="table.db_alias"
                      :reduce="(e) => e.alias"
                      label="alias"
                    />
                  </td>
                  <td>
                    <VSelect
                      v-if="table.db_alias"
                      :options="tableOf[table.db_alias]"
                      :reduce="(e) => e.id"
                      v-model="table.table_id"
                      label="tableName"
                    />
                  </td>
                  <td>
                    <b-btn variant="danger" size="sm" @click="deleteTable(idx)">
                      <i class="fa fa-trash"></i>
                    </b-btn>
                    <b-btn variant="success" v-if="idx == tables.length - 1" size="sm" @click="addTable">
                      <i class="fa fa-plus" />
                    </b-btn>
                  </td>
                </tr>
              </tbody>
            </table>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row align-h="center" id="step-2" v-if="step == 1">
      <b-col cols="12">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>No</th>
              <th v-for="table in tables" :key="table.table_id">
                {{tableMap.get(table.table_id).tableName}}
              </th>
              <th>
                Column Name
              </th>
              <th>
                Is Unique
              </th>
              <th>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mapping, idx) in merge.list_mapping" :key="mapping.colName">
              <td>{{idx+1}}</td>
              <td v-for="(col, index) in colOf" :key="col">
                <VSelect
                  :reduce="(e) => e.value"
                  v-model="mapping.listCol[index]"
                  label="text"
                  :options="col"
                  placeholder="Please select a column"
                />
              </td>
              <td>
                <b-input size="sm" v-model="mapping.colName"></b-input>
              </td>
              <td>
                <b-checkbox size="sm" v-model="mapping.is_unique" :checked="mapping.is_unique == 1"></b-checkbox>
              </td>
              <td>
                <b-btn variant="danger" size="sm">
                  <i class="fa fa-trash"></i>
                </b-btn>
                <b-btn variant="success" size="sm" v-if="idx == merge.list_mapping.length - 1">
                  <i class="fa fa-plus" />
                </b-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="4"></b-col>
      <b-col cols="4" class="text-center">
        <b-button-group size="sm" class="w-100">
          <b-btn variant="warning" class="w-50" :disabled="step == 0" @click="prev">Previous</b-btn>
          <b-btn variant="success" class="w-50" :disabled="step == 2" @click="next">Next</b-btn>
        </b-button-group>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import { getAllDbType } from '@/service/db'
import { getMerge } from '@/service/merge'
import { getColumnByTable } from '@/service/table.service'
import VSelect from 'vue-select'

export default {
  components: { VSelect },
  props: {
    id: String
  },
  data: () => ({
    step: 0,
    merge: null,
    dbs: [],
    tableOf: {},
    colOf: [],
    tableMap: new Map(),
    tables: [
      {
        db_alias: null,
        table_id: null,
        table: null
      }
    ],
    columns: [],
    column: {}
  }),

  async created () {
    await this.getAllDB()
    await this.getMergeRequest()
  },
  methods: {
    async getAllDB () {
      this.dbs = (await getAllDbType()).data
      this.dbs.forEach((db) => {
        this.tableOf[db.alias] = db.tables
        db.tables.forEach(table => this.tableMap.set(table.id, table))
      })
    },
    async getMergeRequest () {
      try {
        const res = await getMerge(this.id)
        this.merge = JSON.parse(res.data.latestMetadata)
        this.tables = this.merge.list_tables.map((table) => ({
          db_alias: table.database_alias,
          table_id: table.table_id,
          table: table.table
        }))
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      }
    },
    addTable () {
      this.tables.push({ db_alias: null, table_id: null })
    },
    deleteTable (idx) {
      this.tables = this.tables.filter((_, i) => i !== idx)
    },
    async next () {
      this.colOf = []
      this.merge.list_mapping = this.merge.list_mapping.map(item => {
        const newCol = item.listCol.map(col => {
          return col.split('.').pop()
        })
        return {
          colName: item.colName,
          is_unique: item.is_unique,
          listCol: newCol
        }
      })

      this.tables.forEach(async (table) => {
        const res = await getColumnByTable(table.table_id)
        this.column = res.data.map((item) => {
          return { value: item, text: item }
        })
        this.colOf.push(this.column)
      })
      this.step++
    },
    prev () {
      this.step--
    }
  }
}
</script>

<style>
@import "vue-select/dist/vue-select.css";
</style>
