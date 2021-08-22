<template>
  <div v-if="!isDeny">
    <b-row id="title">
      <b-col class="text-center">
        <h2>Create merge request</h2>
      </b-col>
    </b-row>
    <b-row class="pt-2" id="step" align-h="center">
        <b-col cols="10">
          <el-steps
            :active="step"
            finish-status="success"
            style="width: 100%"
          >
            <el-step title="Step 1"> </el-step>
            <el-step title="Step 2"> </el-step>
          </el-steps>
        </b-col>
    </b-row>
    <b-row align-h="center" id="step-1" v-if="step == 0">
      <b-col cols="10">
        <b-row class="my-1">
            <b-col sm="3">
              <h5 for="input-small">New Table Merge:</h5>
            </b-col>
            <b-col sm="9">
              <b-form-input id="input-small" size="sm" placeholder="Enter table name" v-model="mergeTableName"></b-form-input>
              <p class="msg-error" v-if="msg.tableName">{{ msg.tableName }}</p>
            </b-col>
          </b-row>
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
                      v-model="table.database_alias"
                      :reduce="(e) => e.alias"
                      label="alias"
                      placeholder="Please select a database"
                      @input="chooseDb(idx)"
                    />
                  </td>
                  <td>
                    <VSelect
                      v-if="table.database_alias"
                      :options="tableOf[table.database_alias]"
                      :reduce="(e) => e.id"
                      v-model="table.table_id"
                      label="tableName"
                      placeholder="Please select a table"
                      @input="chooseTb(table.database_alias, table.table_id, idx)"
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
        <table class="table table-bordered table-responsive" responsive style="max-width: 1300px">
          <thead>
            <tr>
              <th>No</th>
              <th v-for="table in tables" :key="table.table_id">
                {{tableMap.get(table.table_id).tableName}}
              </th>
              <th>
                Column
              </th>
              <th>
                Unique
              </th>
              <th style="min-width: 90px;">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mapping, idx) in listMapping" :key="mapping.colName">
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
                <b-input size="sm" v-model="mapping.colName" :id="mapping.colName"></b-input>
              </td>
              <td>
                <b-checkbox size="sm" v-model="mapping.is_unique"></b-checkbox>
              </td>
              <td>
                <b-btn variant="danger" size="sm" @click="deleteCol(idx)">
                  <i class="fa fa-trash"></i>
                </b-btn>
                <b-btn variant="success" size="sm" v-if="idx == listMapping.length - 1" @click="addCol">
                  <i class="fa fa-plus" />
                </b-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
    <b-row class="pt-2">
      <b-col sm="2"></b-col>
      <b-col sm="8" class="text-center">
        <b-btn variant="primary" size="sm" :disabled="step == 1" @click="next" class="btn-add-request">Next Step</b-btn>
        <b-btn variant="primary" size="sm" :disabled="step == 0" @click="createMerge" class="btn-add-request">
          <b-spinner v-if="isLoadingCreate" variant="primary" small></b-spinner>Create</b-btn>
      </b-col>
    </b-row>
  </div>
  <div v-else>
    <common-deny/>
  </div>
</template>

<script>
import { getAllDbType } from '@/service/db'
import { getColumnByTable } from '@/service/table.service'
import { createMerge } from '@/service/merge'
import VSelect from 'vue-select'

export default {
  components: { VSelect },
  props: {
    id: String
  },
  data: () => ({
    step: 0,
    isLoadingCreate: false,
    listMapping: [],
    dbs: [],
    tableOf: {},
    colOf: [],
    tableMap: new Map(),
    tables: [
      {
        database_alias: null,
        table_id: null,
        table: null
      }
    ],
    columns: [],
    column: {},
    mergeTableName: null,
    msg: {
      tableName: null
    },
    isDeny: false
  }),
  async created () {
    await this.getAllDB()
  },
  watch: {
    mergeTableName (value) {
      this.mergeTableName = value
      this.validateTableName(value)
    }
  },
  methods: {
    validateTableName (value) {
      if (/^[a-zA-Z_][\w-.]{0,127}$/.test(value)) {
        this.msg.tableName = ''
      } else {
        this.msg.tableName = 'Invalid table name'
      }
    },
    async getAllDB () {
      const dbs = await getAllDbType()
      if (dbs.statusCode === '403') {
        this.isDeny = true
      } else {
        this.dbs = dbs.data
        this.dbs.forEach((db) => {
          this.tableOf[db.alias] = db.tables
          db.tables.forEach(table => this.tableMap.set(table.id, table))
        })
      }
    },
    addTable () {
      this.tables.push({ database_alias: null, table_id: null, table: null })
    },
    deleteTable (idx) {
      this.tables = this.tables.filter((_, i) => i !== idx)
    },
    addCol () {
      this.listMapping.push({ colName: null, is_unique: 0, listCol: [] })
    },
    deleteCol (idx) {
      this.listMapping = this.listMapping.filter((_, i) => i !== idx)
    },
    chooseDb (index) {
      this.tables[index].table_id = null
    },
    chooseTb (db, id, index) {
      this.tableOf[db].forEach(tb => {
        if (tb.id === id) {
          this.tables[index].table = tb.tableName
        }
      })
    },
    async next () {
      this.validateTableName(this.mergeTableName)
      if (this.mergeTableName === null || this.mergeTableName === '') {
        this.msg.tableName = 'Invalid table name'
      } else {
        this.msg.tableName = ''
      }
      if (this.msg.tableName === '') {
        this.step++
        this.colOf = []
        const arrCol = []

        const forLoop = async _ => {
          for (let index = 0; index < this.tables.length; index++) {
            const colData = await getColumnByTable(this.tables[index].table_id)
            if (colData.statusCode === '403') {
              this.isDeny = true
            } else {
              const colItem = []
              colData.data.forEach(item => {
                colItem.push({ value: item, text: item })
              })
              arrCol.push(colItem)
            }
          }
        }
        await forLoop()

        for (let index = 0; index < this.tables.length; index++) {
          this.colOf.push(arrCol[index])
        }

        this.listMapping = [{
          colName: null,
          is_unique: 0,
          listCol: []
        }]
      }
    },
    prev () {
      this.step--
    },
    getSelectedCol (tableName, arrData) {
      const result = arrData.filter(reg => reg.includes(tableName))
      if (result.length !== 0) {
        return result[0].split('.').pop()
      }
      return ''
    },
    async createMerge () {
      const listMap = this.listMapping.map(item => {
        const newCol = []
        this.tables.forEach((table, i) => {
          if (item.listCol[i] !== '' && item.listCol[i] !== null && item.listCol[i] !== undefined) {
            const model = table.database_alias + '.' + table.table + '.' + item.listCol[i]
            newCol.push(model)
          }
        })
        return {
          colName: item.colName,
          is_unique: item.is_unique ? 1 : 0,
          listCol: newCol
        }
      })
      const data = {
        merge_table_name: this.mergeTableName,
        list_tables: this.tables,
        list_mapping: listMap
      }
      const dataStr = {
        mergeTableName: this.mergeTableName,
        latestMetadata: JSON.stringify(data)
      }
      try {
        this.isLoadingCreate = true
        const res = await createMerge(dataStr)
        if (res.statusCode === '403') {
          this.isDeny = true
        } else {
          this.isLoadingCreate = false
          if (res.code === '201') {
            this.$notify({ type: 'success', text: 'Create merge request succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Create merge request failed' })
          }
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.isLoadingCreate = false
      }
    }
  }
}
</script>

<style>
@import "vue-select/dist/vue-select.css";
</style>
