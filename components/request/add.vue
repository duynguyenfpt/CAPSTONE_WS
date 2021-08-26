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
            <label class="form-label">Database</label>
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
            <label class="form-label">Table</label>
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
            <label>Unique key</label>
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
              size="sm"
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
        fromDate: null
      },
      isDeny: false
    }
  },
  async mounted () {
    const res = await getAllDbType()
    if (res.statusCode === '403') {
      this.isDeny = true
    } else {
      // eslint-disable-next-line array-callback-return
      res.data.map((item) => {
        this.opsDb.push({ value: item.id, text: item.databaseName })
      })
      this.resetData()
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
    async fillData () {
      const id = this.request.database
      if (id !== null) {
        const res = await getAllTableByDb(id, 1, 1000)
        if (res.statusCode === '403') {
          this.isDeny = true
        } else {
          this.opsTb = [{ value: null, text: 'Please select an option' }]
          // eslint-disable-next-line array-callback-return
          res.data.map((item) => {
            this.opsTb.push({ value: item.id, text: item.tableName })
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
      const id = this.request.table
      if (id !== null) {
        const res = await getColumnByTable(id)
        if (res.statusCode === '403') {
          this.isDeny = true
        } else {
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
      if (this.request.type === null) {
        this.msg.type = 'Please select type'
      }
      if (this.request.database === null) {
        this.msg.database = 'Please select database'
      }
      if (this.request.table === null) {
        this.msg.table = 'Please select table'
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
              requestType: 'SyncTable',
              tableId: this.request.table,
              isAll: this.request.isAll,
              fromDate: this.request.fromDate,
              toDate: this.request.toDate,
              timeRequest: time,
              partitionBy: partitions,
              identityId: identities
            }
            const res = await createRequestSync(req)
            if (res.statusCode === '403') {
              this.isDeny = true
            } else {
              if (res.code === '201') {
                this.$notify({
                  type: 'success',
                  text: 'Create request succeeded'
                })
                this.resetData()
              } else {
                this.$notify({ type: 'error', text: 'Create request failed' })
              }
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
