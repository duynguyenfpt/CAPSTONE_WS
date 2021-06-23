<template>
  <div>
    <b-row>
      <b-col class="text-center">
        <h3>Request Management</h3>
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
        </b-col>
        <b-col sm="4" class="pt-2" v-if="isSync">
          <label></label>
          <b-form-checkbox
            v-model="request.isAll"
            name="checkbox-1"
            value="chosen"
            unchecked-value="not_chosen"
          >
            Is All
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="pt-2" v-if="isSync">
        <b-col sm="2"></b-col>
        <b-col sm="4">
          <label for="example-datepicker">From date</label>
          <b-form-datepicker
            id="date-from"
            :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
            v-model="request.fromDate"
            class="mb-2"
          ></b-form-datepicker>
        </b-col>
        <b-col sm="4">
          <label for="example-datepicker">To date</label>
          <b-form-datepicker
            id="date-to"
            :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
            :date-disabled-fn="dateDisabled"
            :min="min"
            v-model="request.toDate"
            class="mb-2"
          ></b-form-datepicker>
        </b-col>
      </b-row>
      <b-row class="pt-2" v-if="isAdd">
        <b-col sm="2"></b-col>
        <b-col sm="8">
          <table :items="rows" class="table table-striped table-bordered table-sm">
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
                {{k + 1}}
              </td>
              <td>
                <v-select class="select-sm" :reduce="text => text.value" label="text" :options="opsName" v-model="row.name" size="sm" @input="fillRow(k)"></v-select>
              </td>
              <td>
                <b-form-input disabled size="sm" v-model="row.type"></b-form-input>
              </td>
              <td>
                <b-form-input disabled size="sm" v-model="row.value"></b-form-input>
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
            <b-btn type='button' class="btn btn-success" @click="addNewRow" size="sm">
              <i class="fa fa-plus"></i>
              Add
            </b-btn>
          </div>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col sm="2"></b-col>
        <b-col sm="8" class="text-center">
          <b-btn @click="addRequest" size="sm" variant="primary" class="btn-add-request">
            <b-spinner v-if="isLoadingCreate" variant="primary" small></b-spinner>
            Save
          </b-btn>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { getAllDbType } from '@/service/db'
import { getAllTableByDb, getTableSchema } from '~/service/table.service'
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
        toDate: null
      },
      status: 'not_chosen',
      opsType: [
        { value: null, text: 'Please select an option' },
        { value: 1, text: 'Synchronized' },
        { value: 2, text: 'Add Columns' }
      ],
      opsDb: [
        { value: null, text: 'Please select an option' }
      ],
      opsTb: [
        { value: null, text: 'Please select an option' }
      ],
      min: null,
      opsName: [
        { value: null, text: 'Please select an option' }
      ],
      rows: [{
        name: null,
        type: null,
        value: null
      }],
      isSync: false,
      isAdd: false,
      isLoadingCreate: false
    }
  },
  async mounted () {
    const res = await getAllDbType()
    // eslint-disable-next-line array-callback-return
    res.data.map(item => {
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
    showRequest () {
      if (this.request.type === 1) {
        this.isSync = true
        this.isAdd = false
      } else if (this.request.type === 2) {
        this.isSync = false
        this.isAdd = true
      } else {
        this.isSync = false
        this.isAdd = false
      }
    },
    async fillData () {
      this.rows = [{
        name: null,
        type: null,
        value: null
      }]
      const id = this.request.database
      if (id !== null) {
        const res = await getAllTableByDb(id)
        // eslint-disable-next-line array-callback-return
        res.data.map(item => {
          this.opsTb.push({ value: item.id, text: item.tableName })
        })
      } else {
        this.request.table = null
      }
    },
    async fillTable () {
      this.rows = [{
        name: null,
        type: null,
        value: null
      }]
      const id = this.request.table
      if (id !== null) {
        const res = await getTableSchema(id)
        this.opsName = res.data.map(item => {
          return { value: item.id, text: item.rowName }
        })
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
      if (this.request.isAll === 'chosen') {
        this.request.isAll = true
      } else {
        this.request.isAll = false
      }
      if (this.isSync) {
        try {
          this.isLoadingCreate = true
          const today = new Date()
          const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
          const req = {
            requestId: this.request.type,
            tableId: this.request.table,
            isAll: this.request.isAll,
            fromDate: this.request.fromDate,
            toDate: this.request.toDate,
            time: time
          }
          const res = await createRequestSync(req)
          this.isLoadingCreate = false
          if (res.code) {
            this.$notify({ type: 'success', text: 'Create request succeeded' })
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
      if (this.isAdd) {
        try {
          this.isLoadingCreate = true
          const rows = []
          this.rows.forEach(element => {
            rows.push(element.name)
          })
          const req = {
            requestTypeId: this.request.type,
            rowIds: rows,
            tableId: this.request.table
          }
          const res = await createRequestAddColumn(req)
          this.isLoadingCreate = false
          if (res.code) {
            this.$notify({ type: 'success', text: 'Create request succeeded' })
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
    },
    resetData () {
      this.request.type = null
      this.request.database = null
      this.request.table = null
      this.request.isAll = 'not_chosen'
      this.request.fromDate = null
      this.request.toDate = null
      this.rows = [{
        name: null,
        type: null,
        value: null
      }]
    }
  }
}
</script>

<style>
  @import 'vue-select/dist/vue-select.css';

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
