<template>
  <div>
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
        <b-form-input size="sm" v-model="table.table_name"></b-form-input>
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
  data: () => ({
    loading: false,
    table: {
      table_name: null
    }
  }),

  methods: {
    async addTable () {
      this.loading = true
      try {
        const body = {
          table_name: this.table.table_name,
          database_infor_id: this.database.id
        }

        /// fake data loi
        if (body.table_name === 'fail_us') { throw new Error('Trung ten table') }

        ///
        const res = await addTable(body)
        const tableID = res.id
        if (tableID) {
          this.$message.success('Success!')
        } else {
          this.$message.error('Add table unsuccessfully')
        }
        this.$router.go()
      } catch (e) {
        this.$message.error(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style></style>
