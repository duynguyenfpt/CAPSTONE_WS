<template>
  <div class="container-fluid" v-if="!isDeny">
    <section>
      <b-row id="title">
        <b-col class="text-center">
          <h2>Update merge request</h2>
        </b-col>
      </b-row>
      <b-row class="pt-2" id="step" align-h="center">
        <b-col cols="10">
          <el-steps :active="step" finish-status="success" style="width: 100%">
            <el-step title="Choose table"> </el-step>
            <el-step title="Mapping column"> </el-step>
            <el-step title="Done" />
          </el-steps>
        </b-col>
      </b-row>
      <b-row align-h="center" id="step-1" v-if="step == 0">
        <b-col cols="10">
          <b-row class="my-1">
            <b-col sm="3">
              <h5 for="input-small">Table name <span class="msg-error">*</span></h5>
            </b-col>
            <b-col sm="9">
              <b-form-input
                id="input-small"
                size="sm"
                placeholder="Enter table name"
                v-model="mergeTableName"
              ></b-form-input>
              <p class="msg-error" v-if="msg.tableName">{{ msg.tableName }}</p>
            </b-col>
          </b-row>
          <hr />
          <b-row align-h="center">
            <b-col>
              <table class="b-table table table-bordered table-sm">
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
                        @input="
                          chooseTb(table.database_alias, table.table_id, idx)
                        "
                        @option:selected="
                          (e) => {
                            e.selected = true;
                          }
                        "
                        @option:deselected="
                          (e) => {
                            e.selected = false;
                          }
                        "
                      />
                    </td>
                    <td>
                      <b-btn
                        variant="danger"
                        size="sm"
                        @click="deleteTable(idx)"
                      >
                        <i class="fa fa-trash"></i>
                      </b-btn>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="100%">
                      <b-btn
                        variant="success"
                        block
                        size="sm"
                        @click="addTable"
                      >
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
      <b-row
        no-gutters
        align-h="center"
        id="step-2"
        v-if="step == 1"
        class="pt-2"
      >
        <b-col cols="12" class="table-responsive">
          <table
            v-if="!isLoading"
            class="
              table
              b-table
              table-striped table-hover table-bordered table-sm
            "
          >
            <thead>
              <tr>
                <th>No</th>
                <th v-for="table in tables" :key="`${table.table_id}-${idx}`">
                  {{ tableMap.get(table.table_id).tableName }}
                </th>
                <th>Column</th>
                <th>Unique</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(mapping, idx) in merge.list_mapping"
                :key="`mp-${idx}`"
              >
                <td>{{ idx + 1 }}</td>
                <td v-for="(col, index) in colOf" :key="`${idx}-${index}`">
                  <VSelect
                    :appendToBody="true"
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
                  <b-checkbox
                    size="sm"
                    v-model="mapping.is_unique"
                  ></b-checkbox>
                </td>
                <td>
                  <b-btn variant="danger" size="sm" @click="deleteCol(idx)">
                    <i class="fa fa-trash"></i>
                  </b-btn>
                </td>
              </tr>
              <tr>
                <td colspan="100%">
                  <b-btn variant="success" size="sm" block @click="addCol">
                    <i class="fa fa-plus" />
                  </b-btn>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else>
            <content-placeholders class="article-card-block">
              <content-placeholders-text :lines="2" />
              <content-placeholders-text :lines="6" />
            </content-placeholders>
          </div>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col sm="2"></b-col>
        <b-col sm="8" class="text-center">
          <b-btn variant="warning" size="sm" v-show="step == 1" @click="prev">
            <i class="fa fa-arrow-left" />
            Back
          </b-btn>
          <b-btn
            variant="info"
            size="sm"
            v-show="step == 0"
            @click="next"
            class="btn-add-request"
          >
            Continue <i class="fa fa-arrow-right" />
          </b-btn>
          <b-btn
            variant="success"
            size="sm"
            v-show="step == 1"
            @click="updateRequest"
            class="btn-add-request"
          >
            <b-spinner v-if="isLoadingUpdate" variant="primary" small>
            </b-spinner>
            <i class="fa fa-check" />
            Update
          </b-btn>
        </b-col>
      </b-row>
    </section>
  </div>
  <div v-else>
    <common-deny />
  </div>
</template>

<script>
import { getAllDbType } from '@/service/db'
import { getMerge, updateMerge } from '@/service/merge'
import { getColumnByTable } from '@/service/table.service'
import VSelect from 'vue-select'
import { checkPermission } from '~/service/right'

export default {
  components: { VSelect },
  props: {
    id: String
  },
  data: () => ({
    step: 0,
    isLoadingUpdate: false,
    merge: null,
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
    isDeny: false,
    isLoading: false,
    list_mapping: []
  }),

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
    validateTableName (value) {
      if (/^[a-zA-Z_][\w-.]{0,127}$/.test(value)) {
        this.msg.tableName = ''
      } else {
        this.msg.tableName = 'Invalid table name'
      }
    },
    async checkPermission () {
      const data = {
        method: 'PUT',
        path: 'merge_request'
      }
      const res = await checkPermission(data)
      const dataGet = {
        method: 'PUT',
        path: 'merge_request'
      }
      const resGet = await checkPermission(dataGet)
      const dataDb = {
        method: 'GET',
        path: 'database_infor'
      }
      const resDb = await checkPermission(dataDb)
      const dataCol = {
        method: 'GET',
        path: 'column'
      }
      const resCol = await checkPermission(dataCol)
      if (!res.data.success || !resDb.data.success || resCol.data.success || resGet.data.success) {
        this.isDeny = true
      }
    },
    async getAllDB () {
      const dbs = await getAllDbType()
      if (dbs.code === '200') {
        this.dbs = dbs.data
        this.dbs.forEach((db) => {
          this.tableOf[db.alias] = db.tables.map((e) => {
            e.selected = false
            return e
          })
          db.tables.forEach((table) => this.tableMap.set(table.id, table))
        })
      }
    },
    async getMergeRequest () {
      try {
        const res = await getMerge(this.id)
        if (res.code === '200') {
          this.mergeTableName = res.data.mergeTableName
          this.merge = JSON.parse(res.data.latestMetadata)
          this.tables = this.merge.list_tables.map((table) => ({
            database_alias: table.database_alias,
            table_id: table.table_id,
            table: table.table
          }))
          this.list_mapping = this.merge.list_mapping
        }
      } catch (e) {
        this.$notify({ type: 'error', text: 'Error occurred!' })
      }
    },
    addTable () {
      this.tables.push({ database_alias: null, table_id: null, table: null })
    },
    deleteTable (idx) {
      this.tables = this.tables.filter((_, i) => i !== idx)
    },
    addCol () {
      this.merge.list_mapping.push({
        colName: null,
        is_unique: 0,
        listCol: []
      })
    },
    deleteCol (idx) {
      this.merge.list_mapping = this.merge.list_mapping.filter(
        (_, i) => i !== idx
      )
    },
    chooseDb (index) {
      this.tables[index].table_id = null
    },
    chooseTb (db, id, index) {
      this.tableOf[db].forEach((tb) => {
        if (tb.id === id) {
          this.tables[index].table = tb.tableName
        }
      })
    },
    async next () {
      this.list_mapping = this.merge.list_mapping
      this.isLoading = true
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

        const forLoop = async (_) => {
          for (let index = 0; index < this.tables.length; index++) {
            const colData = await getColumnByTable(this.tables[index].table_id)
            if (colData.code === '200') {
              const colItem = []
              colData.data.forEach((item) => {
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

        this.merge.list_mapping = this.merge.list_mapping.map((item) => {
          const newCol = []
          this.tables.forEach((table) => {
            const model = this.getSelectedCol(table.table, item.listCol)
            newCol.push(model)
          })
          return {
            colName: item.colName,
            is_unique: item.is_unique === 1,
            listCol: newCol
          }
        })
      }
      this.isLoading = false
    },
    prev () {
      this.merge.list_mapping = this.list_mapping
      this.step--
    },
    getSelectedCol (tableName, arrData) {
      const result = arrData.filter((reg) => reg.includes(tableName))
      if (result.length !== 0) {
        return result[0].split('.').pop()
      }
      return ''
    },
    async updateRequest () {
      const listMap = this.merge.list_mapping.map((item) => {
        const newCol = []
        this.tables.forEach((table, i) => {
          if (
            item.listCol[i] !== '' &&
            item.listCol[i] !== null &&
            item.listCol[i] !== undefined
          ) {
            const model =
              table.database_alias + '.' + table.table + '.' + item.listCol[i]
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
        latestMetadata: JSON.stringify(data)
      }
      try {
        this.isLoadingUpdate = true
        const res = await updateMerge(this.id, dataStr)
        this.isLoadingUpdate = false
        if (res.code === '200') {
          this.$notify({
            type: 'success',
            text: 'Update merge request succeeded'
          })
        } else {
          this.$notify({
            type: 'error',
            text: 'Update merge request failed'
          })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: 'Update merge request failed' })
      } finally {
        this.isLoadingUpdate = false
      }
    }
  }
}
</script>

<style>
@import "vue-select/dist/vue-select.css";
</style>
