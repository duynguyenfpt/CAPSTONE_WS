<template>
  <div>
    <b-row>
      <b-col>
        <b-alert variant="danger" v-show="message" show>
          {{message}}
        </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="4">
        <label class="form-lab">Database Name</label>
      </b-col>
      <b-col>
        <b-input
          size="sm"
          disabled
          :placeholder="database.database_name"
        ></b-input>
      </b-col>
    </b-row>
    <b-row class="pt-2">
      <b-col cols="4">
        <label class="text-center">Table Name</label>

      </b-col>
      <b-col>
        <b-form-input id="input-live" :state="validateTable" size="sm" v-model="table.table_name"></b-form-input>
      </b-col>
    </b-row>
    <b-row class="text-center pt-3">
      <b-col>
        <b-button @click="addTable" variant="primary" size="sm"
          >Add table</b-button
        >
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { addTable } from '@/service/table.service'

export default {
  props: {
    database: {}
  },
  computed: {
    validateTable () {
      return /^(\d|\w|_)+$/.test(this.table.table_name || '')
    }
  },
  data: () => ({
    loading: false,
    table: {
      table_name: null
    },
    message: null
  }),

  methods: {
    async addTable () {
      this.loading = true
      this.message = null
      try {
        const body = {
          table_name: this.table.table_name,
          database_infor_id: this.database.id
        }
        if (!this.validateTable) {
          throw new Error('Invalid table name')
        }
        /// fake data loi
        if (body.table_name === 'Huong_test' || body.table_name === 'table name') {
          throw new Error('Table is existed')
        } else {
          ///
          const res = await addTable(body)
          const tableID = res.id
          if (tableID) {
            this.$message.success('Success!')
          } else {
            this.$message.error('Add table unsuccessfully')
          }
          this.$router.go()
        }
      } catch (e) {
        this.message = e.message
        this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style></style>
