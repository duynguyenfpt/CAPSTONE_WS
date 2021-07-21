<template>
  <div>
    <b-row>
      <b-col class="text-center">
        <h1>Create Request</h1>
      </b-col>
    </b-row>

    <div>
      <!--RequestType-->
      <b-row>
        <b-col sm="2"></b-col>
        <b-col sm="4">
          <label>Request Type</label>
          <b-form-select
            v-model="request.type"
            :options="opsType"
            size="sm"
            @change="showRequest"
          >
          </b-form-select>
          <p class="msg-error" v-if="msg.type">{{ msg.type }}</p>
        </b-col>
      </b-row>
      <!-- Database -->
      <b-row class="pt-2">
        <b-col sm="2"></b-col>
        <b-col sm="4">
          <label>Database</label>
          <b-form-select
            v-model="request.database"
            :options="opsDb"
            size="sm"
            @change="fillData"
          >
          </b-form-select>
          <p class="msg-error" v-if="msg.database">{{ msg.database }}</p>
        </b-col>
      </b-row>
      <!-- Table -->
      <b-row class="pt-2">
        <b-col sm="2"></b-col>
        <b-col sm="4">
          <label>Table</label>
          <b-form-select
            v-model="request.table"
            :options="opsTb"
            size="sm"
            @change="fillTable"
          >
          </b-form-select>
          <p class="msg-error" v-if="msg.table">{{ msg.table }}</p>
        </b-col>
        <b-col sm="4" class="pt-2" v-if="isSync">
          <label></label>
          <b-form-checkbox
            v-model="request.isAll"
            name="checkbox-1"
            value="chosen"
            unchecked-value="not_chosen"
            @change="chooseIsAll"
          >
            Is All
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="pt-2" v-if="isSync">
        <b-col sm="2"></b-col>
        <b-col sm="4">
          <label>Unique key</label>
          <div>
            <el-select class="w-100"
              v-model="request.unique"
              multiple
              filterable
              no-match-text="Data search not found"
              placeholder="Choose unique key">
              <el-option
                v-for="item in opsUniqueKey"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </b-col>
      </b-row>
      <b-row class="pt-2" v-if="isSync">
        <b-col sm="2"></b-col>
        <b-col sm="4">
          <label>Partition By</label>
          <div>
            <el-select class="w-100"
              v-model="request.partition"
              multiple
              filterable
              no-match-text="Data search not found"
              placeholder="Choose partition key">
              <el-option
                v-for="item in opsPartitionKey"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </b-col>
      </b-row>
      <b-row class="pt-2" v-if="isSync">
        <b-col sm="2"></b-col>
        <b-col sm="4">
          <label for="example-datepicker">From date</label>
          <b-form-datepicker
            id="date-from"
            :date-format-options="{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }"
            v-model="request.fromDate"
            class="mb-2"
            @context="chooseDateFrom"
          ></b-form-datepicker>
          <p class="msg-error" v-if="msg.fromDate">{{ msg.fromDate }}</p>
        </b-col>
        <b-col sm="4">
          <label for="example-datepicker">To date</label>
          <b-form-datepicker
            id="date-to"
            :date-format-options="{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }"
            :date-disabled-fn="dateDisabled"
            :min="min"
            v-model="request.toDate"
            class="mb-2"
            @context="chooseDateTo"
          ></b-form-datepicker>
          <p class="msg-error" v-if="msg.toDate">{{ msg.toDate }}</p>
        </b-col>
      </b-row>
      <b-row class="pt-2" v-if="isAdd">
        <b-col sm="2"></b-col>
        <b-col sm="8">
          <table
            :items="rows"
            class="table table-striped table-bordered table-sm"
          >
            <thead>
              <td class="text-center">No</td>
              <td class="text-center">Column</td>
              <td class="text-center">Type</td>
              <td class="text-center">Default Value</td>
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
                    :options="opsName"
                    v-model="row.name"
                    size="sm"
                    @input="fillRow(k)"
                  ></v-select>
                </td>
                <td>
                  <b-form-input
                    disabled
                    size="sm"
                    v-model="row.type"
                  ></b-form-input>
                </td>
                <td>
                  <b-form-input
                    disabled
                    size="sm"
                    v-model="row.value"
                  ></b-form-input>
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
      <b-row  v-if="isETL">
        <b-col sm="2"></b-col>
        <b-col sm="8">
          <label>Query</label>
          <b-form-textarea
            id="textarea-small"
            size="sm"
            placeholder="Query..."
            v-model="request.query"
          ></b-form-textarea>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col sm="2"></b-col>
        <b-col sm="8" class="text-center">
          <b-btn
            @click="addRequest"
            size="sm"
            variant="primary"
            class="btn-add-request"
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
import { getAllTableByDb, getColumnByTable } from '~/service/table.service'
import { createRequestSync, createRequestAddColumn } from '~/service/request'
import { getSchemaById } from '@/service/schema'
import Vue from 'vue'
import vSelect from 'vue-select'

Vue.component('v-select', vSelect)
export default {
  data () {
    return {
      request: {
        type: null,
        database: null,
        table: null,
        fromDate: null,
        toDate: null,
        isAdd: false,
        unique: [],
        partition: []
      },
      status: 'not_chosen',
      opsType: [
        { value: null, text: 'Please select an option' },
        { value: 'SyncTable', text: 'Synchronized' },
        { value: 'AddColumn', text: 'Add Columns' },
        { value: 'ETL', text: 'ETL' }
      ],
      opsDb: [{ value: null, text: 'Please select an option' }],
      opsTb: [{ value: null, text: 'Please select an option' }],
      min: null,
      opsUniqueKey: [],
      opsPartitionKey: [],
      opsName: [{ value: null, text: 'Please select an option' }],
      rows: [
        {
          name: null,
          type: null,
          value: null
        }
      ],
      isSync: false,
      isAdd: false,
      isETL: false,
      isLoadingCreate: false,
      msg: {
        type: null,
        database: null,
        table: null,
        toDate: null,
        fromDate: null
      }
    }
  },
  async mounted () {
    const res = await getAllDbType()
    // eslint-disable-next-line array-callback-return
    res.data.map((item) => {
      this.opsDb.push({ value: item.id, text: item.databaseName })
    })
  },
  methods: {
    dateDisabled () {
      this.min = this.request.fromDate
    },
    addNewRow () {
      this.rows.push({
        name: null,
        type: null,
        value: null
      })
    },
    deleteRow (index, row) {
      const idx = this.rows.indexOf(row)
      if (idx > -1) {
        this.rows.splice(idx, 1)
      }
    },
    chooseDateTo () {
      if (this.request.toDate === null) {
        this.msg.toDate = 'Please select a date'
      } else {
        this.msg.toDate = ''
      }
    },
    chooseDateFrom () {
      if (this.request.fromDate === null) {
        this.msg.fromDate = 'Please select a date'
      } else {
        this.msg.fromDate = ''
      }
    },
    chooseIsAll () {
      console.log('LCC: ', this.request.isAll)
      if (this.request.isAll === 'chosen') {
        this.msg.fromDate = ''
        this.msg.toDate = ''
      } else {
        this.msg.fromDate = 'Please select a date'
        this.msg.toDate = 'Please select a date'
      }
    },
    showRequest () {
      if (this.request.type === 'SyncTable') {
        this.isSync = true
        this.isAdd = false
        this.isETL = false
        this.msg.type = ''
        this.msg.toDate = ''
        this.msg.fromDate = ''
      } else if (this.request.type === 'AddColumn') {
        this.isSync = false
        this.isAdd = true
        this.isETL = false
        this.msg.type = ''
      } else if (this.request.type === 'ETL') {
        this.isSync = false
        this.isAdd = true
        this.isETL = true
        this.msg.type = ''
      } else {
        this.isSync = false
        this.isAdd = false
        this.msg.type = 'Please select type'
      }
    },
    async fillData () {
      this.rows = [
        {
          name: null,
          type: null,
          value: null
        }
      ]
      const id = this.request.database
      if (id !== null) {
        const res = await getAllTableByDb(id, 1, 1000)
        this.opsTb = [{ value: null, text: 'Please select an option' }]
        // eslint-disable-next-line array-callback-return
        res.data.map((item) => {
          this.opsTb.push({ value: item.id, text: item.tableName })
        })
        this.request.table = null
        this.msg.database = ''
      } else {
        this.request.table = null
        this.msg.database = 'Please select database'
      }
    },
    async fillTable () {
      this.rows = [
        {
          name: null,
          type: null,
          value: null
        }
      ]
      const id = this.request.table
      if (id !== null) {
        const res = await getColumnByTable(id)
        this.opsName = res.data.map((item) => {
          return { value: item.id, text: item.rowName }
        })
        this.opsUniqueKey = res.data.map((item) => {
          return { value: item, label: item }
        })
        this.opsPartitionKey = res.data.map((item) => {
          return { value: item, label: item }
        })
        this.msg.table = ''
      } else {
        this.msg.table = 'Please select table'
      }
    },
    async fillRow (index) {
      const id = this.rows[index].name
      if (id !== null) {
        const res = await getSchemaById(id)
        this.rows[index].type = res.data.rowType
        this.rows[index].value = res.data.defaultValue
      }
    },
    async addRequest () {
      if (this.request.type === null) {
        this.msg.type = 'Please select type'
      }
      if (this.request.database === null) {
        this.msg.database = 'Please select database'
      }
      if (this.request.table === null) {
        this.msg.table = 'Please select table'
      }
      if (
        this.msg.type === '' &&
        this.msg.database === '' &&
        this.msg.table === ''
      ) {
        if (this.request.isAll === 'chosen') {
          this.request.isAll = true
          this.msg.toDate = ''
          this.msg.fromDate = ''
        } else {
          this.request.isAll = false
          this.msg.toDate = ''
          this.msg.fromDate = ''
        }
        if (this.isSync) {
          if (this.request.isAll === false) {
            if (this.request.toDate === null) {
              this.msg.toDate = 'Please select a date'
            }
            if (this.request.fromDate === null) {
              this.msg.fromDate = 'Please select a date'
            }
          } else {
            this.msg.toDate = ''
            this.msg.fromDate = ''
          }
          if (this.msg.toDate === '' && this.msg.fromDate === '') {
            try {
              this.isLoadingCreate = true
              const today = new Date()
              const time =
              today.getHours() +
              ':' +
              today.getMinutes() +
              ':' +
              today.getSeconds()
              let partitions = this.request.partition[0]
              const lenPart = this.request.partition.length
              for (let i = 1; i < lenPart; i++) {
                partitions += ', ' + this.request.partition[i]
              }
              let identities = this.request.unique[0]
              const lenIden = this.request.unique.length
              for (let i = 1; i < lenIden; i++) {
                identities += ', ' + this.request.unique[i]
              }
              const req = {
                requestType: this.request.type,
                tableId: this.request.table,
                isAll: this.request.isAll,
                fromDate: this.request.fromDate,
                toDate: this.request.toDate,
                timeRequest: time,
                partitionBy: partitions,
                identityId: identities
              }
              const res = await createRequestSync(req)
              if (res.code === '201') {
                this.$notify({
                  type: 'success',
                  text: 'Create request succeeded'
                })
                this.resetData()
              } else {
                this.$notify({ type: 'error', text: 'Create request failed' })
              }
            } catch (e) {
              this.$notify({ type: 'error', text: e.message })
            } finally {
              this.isLoadingCreate = false
            }
          }
        }
        if (this.isAdd && !this.isETL) {
          try {
            this.isLoadingCreate = true
            const rows = []
            this.rows.forEach((element) => {
              rows.push(element.name)
            })
            const req = {
              requestType: this.request.type,
              rowIds: rows,
              tableId: this.request.table
            }
            const res = await createRequestAddColumn(req)
            this.isLoadingCreate = false
            if (res.code === '201') {
              this.$notify({
                type: 'success',
                text: 'Create request succeeded'
              })
              this.resetData()
            } else {
              this.$notify({ type: 'error', text: 'Create request failed' })
            }
          } catch (e) {
            this.$notify({ type: 'error', text: e.message })
          } finally {
            this.isLoadingCreate = false
          }
        }
      }
    },
    resetData () {
      this.request.type = null
      this.request.database = null
      this.request.table = null
      this.request.isAll = 'not_chosen'
      this.request.fromDate = null
      this.request.toDate = null
      this.request.unique = null
      this.request.partition = null
      this.rows = [
        {
          name: null,
          type: null,
          value: null
        }
      ]
    }
  }
}
</script>

<style>
@import "vue-select/dist/vue-select.css";

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
