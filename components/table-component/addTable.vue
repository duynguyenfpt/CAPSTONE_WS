<template>
  <div>
    <b-modal v-model="isVisible" title="Create Table" hide-footer>
      <div v-if="isLoading" class="text-center">
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
      <div v-else>
        <b-row>
          <b-col cols="4">
            <label class="form-lab">Database Name</label>
          </b-col>
          <b-col>
            <b-input size="sm" disabled v-model="dbName"></b-input>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="text-center">Table Name</label>
          </b-col>
          <b-col>
            <b-form-input
              id="input-live"
              size="sm"
              v-model="tableName"
            ></b-form-input>
            <p class="msg-error" v-if="msg">{{ msg }}</p>
          </b-col>
        </b-row>
        <b-row class="text-center pt-3">
          <b-col class="text-right">
            <b-button @click="addTable" variant="primary" size="sm"
              >
              <b-spinner v-if="isLoadingCreate" variant="primary" small></b-spinner>
              Add table</b-button
            >
            <b-button size="sm" variant="light" @click="onClose">
              Cancel
            </b-button>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { addTable } from '@/service/table.service'
import { getDatabaseDetail } from '@/service/db'

export default {
  props: {
    database: {}
  },
  data: () => ({
    isLoading: false,
    tableName: null,
    dbName: null,
    isVisible: false,
    idItem: 0,
    isLoadingCreate: false,
    msg: null
  }),
  watch: {
    tableName (value) {
      this.tableName = value
      this.validateTableName(value)
    }
  },
  methods: {
    validateTableName (value) {
      if (/^[a-zA-Z_][\w-.]{0,127}$/.test(value)) {
        this.msg = ''
      } else {
        this.msg = 'Invalid table name'
      }
    },
    async show (id) {
      this.idItem = id
      this.isVisible = true
      this.isLoading = true
      const res = await getDatabaseDetail(this.idItem)
      this.dbName = res.data.databaseName
      this.msg = null
      this.isLoading = false
    },
    onClose () {
      this.isVisible = false
    },
    async addTable () {
      this.validateTableName(this.tableName)
      if (this.tableName === null) {
        this.msg = 'Invalid table name'
      }
      if (this.msg === '') {
        try {
          this.isLoadingCreate = true
          const body = {
            tableName: this.tableName,
            databaseInforId: this.idItem
          }
          const res = await addTable(body)
          this.$emit('onAdded')
          if (res.code) {
            this.$notify({ type: 'success', text: 'Add table succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Add table failed' })
          }
          this.$router.go()
        } catch (e) {
          this.$notify({ type: 'error', text: e.message })
        } finally {
          this.loading = false
          this.isVisible = false
        }
      }
    }
  }
}
</script>

<style></style>
