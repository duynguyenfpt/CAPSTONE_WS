<template>
  <div v-if="!isDeny">
    <b-row>
      <b-col class="text-center">
        <h1>Create Synchronized Request</h1>
      </b-col>
    </b-row>
        <!-- Database -->
        <b-row class="pt-2" align-h="center">
          <b-col cols="4">
            <label class="form-label">Database <span class="msg-error">*</span></label>
            <v-select
              :reduce="(text) => text.value"
              label="text"
              v-model="request.database"
              :options="opsDb"
              size="sm"
              placeholder="Please select a database"
              @input="fillData"
            />
            <p class="msg-error" v-if="msg.database">{{ msg.database }}</p>
          </b-col>
          <b-col cols="3">
            <label class="form-label">Table <span class="msg-error">*</span></label>
            <v-select
              :reduce="(text) => text.value"
              label="text"
              v-model="request.table"
              :options="opsTb"
              size="sm"
              placeholder="Please select a table"
              @input="fillTable"
            />
            <p class="msg-error" v-if="msg.table">{{ msg.table }}</p>
          </b-col>
           <b-col cols="1" class="pt-2">
            <label></label>
            <b-form-checkbox
              v-model="request.isAll"
              name="checkbox-1"
              @change="chooseIsAll"
            >
              Is All
            </b-form-checkbox>
          </b-col>
        </b-row>
        <!-- Table -->
        <b-row class="pt-2" align-h="center">

          <b-col cols="4">
            <label>Unique key <span class="msg-error">*</span></label>
            <div>
              <el-select
                class="w-100"
                v-model="request.unique"
                multiple
                filterable
                no-match-text="Data search not found"
                no-data-text="No data"
                placeholder="Choose unique key"
              >
                <el-option
                  v-for="item in opsUniqueKey"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <p class="msg-error" v-if="msg.unique">{{ msg.unique }}</p>
            </div>
          </b-col>
          <b-col cols="4">
            <label>Partition By</label>
            <div>
              <el-select
                class="w-100"
                v-model="request.partition"
                multiple
                filterable
                no-match-text="Data search not found"
                no-data-text="No data"
                placeholder="Choose partition key"
              >
                <el-option
                  v-for="item in opsPartitionKey"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </b-col>
        </b-row>
        <b-row class="pt-2"  align-h="center" v-show="!request.isAll">
          <b-col sm="4">
            <label for="example-datepicker">From date <span class="msg-error">*</span></label>
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
              size="sm"
            ></b-form-datepicker>
            <p class="msg-error" v-if="msg.fromDate">{{ msg.fromDate }}</p>
          </b-col>
          <b-col sm="4">
            <label for="example-datepicker">To date <span class="msg-error">*</span></label>
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
              size="sm"
            ></b-form-datepicker>
            <p class="msg-error" v-if="msg.toDate">{{ msg.toDate }}</p>
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
  <div v-else>
    <common-deny></common-deny>
  </div>
</template>

<script>
import { getAllDbType } from '@/service/db'
import { getAllTableByDb, getColumnByTable } from '~/service/table.service'
import { createRequestSync } from '~/service/request'
import Vue from 'vue'
import vSelect from 'vue-select'
import { checkPermission } from '~/service/right'

Vue.component('v-select', vSelect)
export default {
  data () {
    return {
      request: {
        database: null,
        table: null,
        fromDate: null,
        toDate: null,
        isAll: true,
        unique: [],
        partition: []
      },
      status: 'not_chosen',
      opsDb: [],
      opsTb: [],
      min: null,
      opsUniqueKey: [],
      opsPartitionKey: [],
      opsName: [],
      isLoadingCreate: false,
      msg: {
        database: null,
        table: null,
        toDate: null,
        fromDate: null,
        unique: null
      },
      isDeny: false,
      tableId: null,
      tableName: null
    }
  },
  async created () {
    await this.checkPermission()
    if (!this.isDeny) {
      const res = await getAllDbType()
      if (res.code === '200') {
        this.opsDb = res.data.map((item) => {
          return { value: item.id, text: item.databaseName }
        })
        this.resetData()
      }
    }
  },
  methods: {
    dateDisabled () {
      this.min = this.request.fromDate
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
      if (this.request.isAll) {
        this.msg.fromDate = ''
        this.msg.toDate = ''
      } else {
        this.msg.fromDate = 'Please select a date'
        this.msg.toDate = 'Please select a date'
      }
    },
    async checkPermission () {
      const dataDb = {
        method: 'GET',
        path: 'database_infor'
      }
      const dataTb = {
        method: 'GET',
        path: 'table'
      }
      const dataCol = {
        method: 'GET',
        path: 'column'
      }
      const dataReq = {
        method: 'POST',
        path: 'requests'
      }
      const resDb = await checkPermission(dataDb)
      const resTb = await checkPermission(dataTb)
      const resCol = await checkPermission(dataCol)
      const resReq = await checkPermission(dataReq)
      if (!resDb.data.success || !resTb.data.success || !resCol.data.success || !resReq.data.success) {
        this.isDeny = true
      }
    },
    async fillData () {
      const id = this.request.database
      if (id !== null) {
        const res = await getAllTableByDb(id, 1, 1000)
        if (res.code === '200') {
          this.opsTb = res.data.map((item) => {
            return { value: item.id + '-' + item.tableName, text: item.tableName }
          })
          this.request.table = null
          this.msg.database = ''
        }
      } else {
        this.request.table = null
        this.msg.database = 'Please select database'
      }
    },
    async fillTable () {
      const table = this.request.table.split('-')
      this.tableId = table[0]
      this.tableName = table[1]
      if (this.tableId !== null) {
        const res = await getColumnByTable(this.tableId)
        if (res.code === '200') {
          this.opsUniqueKey = res.data.map((item) => {
            return { value: item, label: item }
          })
          this.opsPartitionKey = res.data.map((item) => {
            return { value: item, label: item }
          })
          this.msg.table = ''
        }
      } else {
        this.msg.table = 'Please select table'
      }
    },
    async addRequest () {
      if (this.request.database === null) {
        this.msg.database = 'Please select database'
      }
      if (this.request.table === null) {
        this.msg.table = 'Please select table'
      }
      if (this.request.unique === null) {
        this.msg.unique = 'Please select unique key'
      } else {
        this.msg.unique = ''
      }
      if (this.msg.database === '' && this.msg.table === '') {
        if (!this.request.isAll) {
          if (this.request.toDate == null) {
            this.msg.toDate = 'Please select a date'
          }
          if (this.request.fromDate == null) {
            this.msg.fromDate = 'Please select a date'
          }
        } else {
          this.msg.toDate = ''
          this.msg.fromDate = ''
        }
        if (this.msg.toDate === '' && this.msg.fromDate === '' && this.msg.unique === '') {
          try {
            this.isLoadingCreate = true
            const today = new Date()
            const time =
              today.getHours() +
              ':' +
              today.getMinutes() +
              ':' +
              today.getSeconds()
            let partitions = null
            if (this.request.partition !== null) {
              partitions = this.request.partition[0]
              const lenPart = this.request.partition.length
              for (let i = 1; i < lenPart; i++) {
                partitions += ', ' + this.request.partition[i]
              }
            }
            let identities = this.request.unique[0]
            const lenIden = this.request.unique.length
            for (let i = 1; i < lenIden; i++) {
              identities += ', ' + this.request.unique[i]
            }
            const req = {
              requestType: 'SyncTable',
              tableId: this.tableId,
              isAll: this.request.isAll,
              fromDate: this.request.fromDate,
              toDate: this.request.toDate,
              timeRequest: time,
              partitionBy: partitions,
              identityId: identities,
              description: 'Sync ' + this.tableName
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
            this.$notify({ type: 'error', text: 'Create request failed' })
          } finally {
            this.isLoadingCreate = false
          }
        }
      }
    },
    resetData () {
      this.request.database = null
      this.request.table = null
      this.request.isAll = true
      this.request.fromDate = null
      this.request.toDate = null
      this.request.unique = null
      this.request.partition = null
      this.msg.database = ''
      this.msg.table = ''
      this.msg.toDate = ''
      this.msg.fromDate = ''
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
