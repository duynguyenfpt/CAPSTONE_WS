<template>
  <div>
    <b-row>
      <b-col class="text-center">
        <h3>Request Management</h3>
      </b-col>
    </b-row>

    <div>
      <b-row>
        <b-col sm="2"></b-col>
        <b-col sm="4">
          <label>Request Type</label>
          <b-form-select
            v-model="request.requestType"
            :options="opsRequestType"
            size="sm"
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
            :options="opsDatabase"
            size="sm"
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
            :options="opsTalbe"
            size="sm"
          >
          </b-form-select>
        </b-col>
        <b-col sm="4" class="pt-2">
          <label></label>
          <b-form-checkbox
            id="checkbox-1"
            v-model="status"
            name="checkbox-1"
            value="accepted"
            unchecked-value="not_accepted"
          >
            IS_All
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col sm="2"></b-col>
        <b-col sm="4">
          <label for="example-datepicker">From date</label>
          <b-form-datepicker
            id="example-datepicker"
            v-model="fromDate"
            class="mb-2"
          ></b-form-datepicker>
          <p>Value: '{{ fromDate }}'</p>
        </b-col>
        <b-col sm="4">
          <label for="example-datepicker">To date</label>
          <b-form-datepicker
            id="example-datepicker"
            v-model="toDate"
            class="mb-2"
          ></b-form-datepicker>
          <p>Value: '{{ toDate }}'</p>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { getAllDbType } from '@/service/db'
export default {
  data () {
    return {
      request: {
        requestType: null,
        database: null,
        table: null
      },
      status: 'not_accepted',
      opsRequestType: [
        { value: null, text: 'Please select an option' },
        { value: '1', text: 'DONG BO' },
        { value: '2', text: 'Add Comlumn' }
      ],
      opsDatabase: [
        { value: null, text: 'Please select an option' }
      ],
      fromDate: null,
      toDate: null
    }
  },
  async mounted () {
    this.isLoading = true
    const res = await getAllDbType()
    // eslint-disable-next-line array-callback-return
    res.data.map(item => {
      this.opsDatabase.push({ value: item.id, text: item.databaseName })
    })
    this.isLoading = false
  }
}
</script>

<style></style>
