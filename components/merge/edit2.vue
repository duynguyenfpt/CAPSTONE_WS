<template>
  <div>
    <b-row>
      <b-col class="text-center">
        <h1>Update Merge Request</h1>
      </b-col>
    </b-row>
    <div>
      <b-row class="pt-2">
        <b-col sm="1"></b-col>
        <b-col sm="10">
          <el-steps
            :active="active"
            finish-status="success"
            style="width: 100%"
          >
            <el-step title="Step 1"> </el-step>
            <el-step title="Step 2"> </el-step>
          </el-steps>
        </b-col>
      </b-row>
      <b-row class="pt-2" v-if="active === 0">
        <b-col sm="1"></b-col>
        <b-col sm="10">
          <b-row class="my-1">
            <b-col sm="3">
              <h5 for="input-small">New Table Merge:</h5>
            </b-col>
            <b-col sm="9">
              <b-form-input id="input-small" size="sm" placeholder="Enter table name" v-model="mergeTableName"></b-form-input>
              <p class="msg-error" v-if="msg.tableName">{{ msg.tableName }}</p>
            </b-col>
          </b-row>
          <br>
          <table
            :items="rows"
            class="table table-striped table-bordered table-sm"
          >
            <thead>
              <td class="text-center">No</td>
              <td class="text-center">Database</td>
              <td class="text-center">Table</td>
              <td class="text-center">Action</td>
            </thead>
            <tbody>
              <tr v-for="(row, k) in rows" :key="k">
                <td class="text-center">
                  {{ k + 1 }}
                </td>
                <td>
                  <v-select
                    class="select-sm"
                    :reduce="(text) => text.value"
                    label="text"
                    :options="opsDbName"
                    v-model="row.dbName"
                    size="sm"
                    @input="fillTb(row.dbName, k)"
                    placeholder="Please select a database"
                  ></v-select>
                </td>
                <td>
                  <v-select
                    class="select-sm"
                    :reduce="(text) => text.value"
                    label="text"
                    :options="row.opsTbName"
                    v-model="row.tbName"
                    size="sm"
                    @input="addTb(row.tbName, k)"
                    placeholder="Please select a table"
                  ></v-select>
                </td>
                <td scope="row" class="text-center">
                  <b-btn
                    class="btn btn-sm"
                    size="sm"
                    variant="danger"
                    @click="deleteRow(k, row)"
                  >
                    <i class="fa fa-trash"></i>
                  </b-btn>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="text-right">
            <b-btn
              type="button"
              class="btn btn-success"
              @click="addNewRow"
              size="sm"
            >
              <i class="fa fa-plus"></i>
              Add
            </b-btn>
          </div>
        </b-col>
      </b-row>
      <b-row class="pt-2" v-if="active === 1">
        <b-col sm="1"></b-col>
        <b-col sm="10">
          <table
            :items="tables"
            class="table table-striped table-bordered table-sm"
          >
            <thead>
              <td class="text-center">No</td>
              <td class="text-center" v-for="(tb, ke) in tbs" :key="ke">
                {{ tb.text }}
              </td>
              <td class="text-center">Action</td>
            </thead>
            <tbody>
              <tr v-for="(table, k) in tables" :key="k">
                <td class="text-center">
                  {{ k + 1 }}
                </td>
                <td v-for="tb in tbs" :key="tb.value">
                  <v-select
                    class="select-sm"
                    :reduce="(text) => text.value"
                    label="text"
                    :options="col[tb.text]"
                    v-model="table[tb.text]"
                    size="sm"
                    placeholder="Please select a column"
                  ></v-select>
                </td>
                <td scope="row" class="text-center">
                  <b-btn
                    class="btn btn-sm"
                    size="sm"
                    variant="danger"
                    @click="deleteRowCol(k, table)"
                  >
                    <i class="fa fa-trash"></i>
                  </b-btn>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="text-right">
            <b-btn
              type="button"
              class="btn btn-success"
              @click="addNewRowCol"
              size="sm"
            >
              <i class="fa fa-plus"></i>
              Add
            </b-btn>
          </div>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col sm="2"></b-col>
        <b-col sm="8" class="text-center">
           <b-btn
            @click="pre"
            size="sm"
            variant="primary"
            :disabled="active === 0"
            >Prerious step</b-btn
          >
          <b-btn
            @click="next"
            size="sm"
            variant="primary"
            :disabled="active === 1"
            >Next step</b-btn
          >
          <b-btn
            size="sm"
            variant="primary"
            class="btn-add-request"
            :disabled="active === 0"
            @click="addRequest"
          >
            <b-spinner
              v-if="isLoadingCreate"
              variant="primary"
              small
            ></b-spinner>
            Save
          </b-btn>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { getAllDbType } from '@/service/db'
import { createMerge, getMerge } from '@/service/merge'
import {
  getAllTableByDb,
  getTableDetail,
  getColumnByTable
} from '@/service/table.service'
import Vue from 'vue'
import vSelect from 'vue-select'
Vue.component('v-select', vSelect)
export default {
  props: {
    id: {}
  },
  data () {
    return {
      mapping: {},
      opsDbName: [],
      opsColName: [],
      rows: [
        {
          dbName: null,
          tbName: null,
          opsTbName: []
        }
      ],
      tables: [],
      tbs: [],
      colName: [],
      isLoadingCreate: false,
      active: 0,
      col: {},
      mergeTableName: null,
      msg: {
        tableName: ''
      },
      listTables: [
        {
          table_id: null,
          table: null,
          database_alias: null
        }
      ],
      listMapping: []
    }
  },
  async created () {
    await this.getAllDB()
    await this.getMergeRequest()
  },
  watch: {
    mergeTableName (value) {
      this.mergeTableName = value
      this.validateTableName(value)
    }
  },
  methods: {

    async getAllDB () {
      const res = await getAllDbType()
      this.opsDbName = res.data.map((item) => {
        return { value: item.id, text: item.alias }
      })
    },

    async getMergeRequest () {
      try {
        const res = await getMerge(this.id)
        const dbTypes = await getAllDbType()
        console.log(dbTypes)

        const obj = JSON.parse(res.data.latestMetadata)
        console.log(obj)
        this.mergeTableName = obj.merge_table_name
        obj.list_tables.forEach((item, i) => {
          this.opsDbName.forEach(async ele => {
            if (item.database_alias === ele.text) {
              const resTb = await getAllTableByDb(ele.value)
              const opsTbs = resTb.data.map((item) => {
                return { value: item.id, text: item.tableName }
              })
              this.rows[i] = {
                dbName: ele.value,
                tbName: item.table,
                opsTbName: opsTbs
              }
            }
          })
        })
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      }
    },
    validateTableName (value) {
      if (/^[a-zA-Z_][\w-.]{0,127}$/.test(value)) {
        this.msg.tableName = ''
      } else {
        this.msg.tableName = 'Invalid table name'
      }
    },
    addNewRow () {
      this.rows.push({
        dbName: null,
        tbName: null,
        opsTbName: []
      })
    },
    addNewRowCol () {
      const tb = {}
      this.tbs.forEach(e => {
        tb[e.text] = null
      })
      this.tables.push(tb)
    },
    deleteRow (index, row) {
      const idx = this.rows.indexOf(row)
      if (idx > -1) {
        this.rows.splice(idx, 1)
      }
    },
    deleteRowCol (index, table) {
      const idx = this.tables.indexOf(table)
      if (idx > -1) {
        this.tables.splice(idx, 1)
      }
    },
    resetData () {
      this.rows = [
        {
          dbName: null,
          tbName: null
        }
      ]
    },
    async fillTb (db, index) {
      const res = await getAllTableByDb(db)
      this.rows[index].dbName = db
      this.rows[index].tbName = ''
      this.rows[index].opsTbName = res.data.map((item) => {
        return { value: item.id, text: item.tableName }
      })
    },
    async addTb (tb, index) {
      const res = await getTableDetail(tb)
      this.tbs[index] = { value: tb, text: res.data.tableName }
    },
    async next () {
      this.validateTableName(this.mergeTableName)
      if (this.mergeTableName === null || this.mergeTableName === '') {
        this.msg.tableName = 'Invalid table name'
      } else {
        this.msg.tableName = ''
      }
      if (this.msg.tableName === '') {
        if (this.active++ > 1) this.active = 0
      }
      this.tables = []
      this.listTables = [
        {
          table_id: null,
          table: null,
          database_alias: null
        }
      ]
      const newArr = this.tbs.map(async (item, i) => {
        const res = await getColumnByTable(item.value)
        this.col[item.text] = res.data.map((item) => {
          return { value: item, text: item }
        })
        const resTb = await getTableDetail(item.value)
        const rawTable = {
          table_id: resTb.data.id,
          table: resTb.data.tableName,
          database_alias: resTb.data.databaseInfo.alias
        }
        this.listTables[i] = rawTable
      })
      await Promise.all(newArr)
      this.addNewRowCol()
      this.opsColName = this.col
    },
    pre () {
      if (this.active-- < 0) this.active = 1
    },
    async addRequest () {
      const mapping = []
      this.tables.forEach((item, i) => {
        this.listTables.forEach((element, idx) => {
          mapping[idx] = element.database_alias + '.' + element.table + '.' + item[element.table]
        })
        this.listMapping[i] = mapping
      })
      const data = {
        mergeTableName: this.mergeTableName,
        listTables: this.listTables,
        listMapping: this.listMapping
      }
      try {
        this.isLoadingCreate = true
        const res = await createMerge(data)
        if (res.code === '201') {
          this.$notify({ type: 'success', text: 'Create merge request succeeded' })
        } else {
          this.$notify({ type: 'error', text: 'Create merge request failed' })
        }
        this.isLoadingCreate = false
        this.reset()
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.isLoadingCreate = true
      }
    },
    reset () {
      this.mergeTableName = null
      this.listTables = null
      this.listMapping = null
      this.active = 0
      this.rows = [
        {
          dbName: null,
          tbName: null,
          opsTbName: []
        }
      ]
    }
  }
}
</script>

<style>
@import "vue-select/dist/vue-select.css";
.vs__search,
.vs__search:focus {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  line-height: 1.4;
  font-size: 1em;
  border: 1px solid transparent;
  border-left: none;
  outline: none;
  margin: 0;
  padding: 0 7px;
  background: none;
  box-shadow: none;
  width: 0;
  max-width: 100%;
  flex-grow: 1;
  z-index: 1;
}
.vs--searchable .vs__dropdown-toggle {
  width: 100%;
  min-width: 245.54px;
  white-space: nowrap;
  max-height: 31px;
  height: calc(1.5em + 0.5rem + 2px);
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  font-size: 0.875rem;
}
.vs__selected {
  margin: 0;
  padding-bottom: 3px;
  padding-left: 0;
}
.vs__actions {
  padding: 0;
  margin-right: 5px;
}
.vs__clear {
  margin-bottom: 2px;
}
</style>
