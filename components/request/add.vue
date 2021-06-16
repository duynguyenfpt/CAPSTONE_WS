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
                <input class="form-control" type="text" v-model="row.name" />
              </td>
              <td>
                <input class="form-control" type="text" v-model="row.type" />
              </td>
              <td>
                <input class="form-control" type="text" v-model="row.value" />
              </td>
              <td scope="row" class="text-center">
                <b-btn
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
            Save
          </b-btn>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { getAllDbType } from '@/service/db'
import { getTableByDb } from '~/service/table.service'
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
        { value: '1', text: 'Synchronized' },
        { value: '2', text: 'Add Columns' }
      ],
      opsDb: [
        { value: null, text: 'Please select an option' }
      ],
      opsTb: [
        { value: null, text: 'Please select an option' }
      ],
      min: null,
      rows: [{
        name: '',
        type: '',
        value: ''
      }],
      isSync: false,
      isAdd: false
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
        name: '',
        type: '',
        value: ''
      })
    },
    deleteRow (index, row) {
      const idx = this.rows.indexOf(row)
      if (idx > -1) {
        this.rows.splice(idx, 1)
      }
    },
    showRequest () {
      if (this.request.type === '1') {
        this.isSync = true
        this.isAdd = false
      } else if (this.request.type === '2') {
        this.isSync = false
        this.isAdd = true
      } else {
        this.isSync = false
        this.isAdd = false
      }
    },
    async fillData () {
      const id = this.request.database
      if (id !== null) {
        const res = await getTableByDb(id)
        // eslint-disable-next-line array-callback-return
        res.data.map(item => {
          this.opsTb.push({ value: item.id, text: item.tableName })
        })
      } else {
        this.request.table = null
      }
    },
    addRequest () {
      if (this.isSync) {
        console.log(this.isSync)
      }
      if (this.isAdd) {
        console.log(this.isAdd)
      }
    }
  }
}
</script>

<style></style>
