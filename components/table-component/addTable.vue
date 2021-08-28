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
            <p class="msg-error" v-if="msg.tableName">{{ msg.tableName }}</p>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="text-center">Default Key</label>
          </b-col>
          <b-col>
            <b-form-input
              id="input-live"
              size="sm"
              v-model="defaultKey"
            ></b-form-input>
            <p class="msg-error" v-if="msg.defaultKey">{{ msg.defaultKey }}</p>
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
import { checkPermission } from '~/service/right'

export default {
  props: {
    database: {}
  },
  data: () => ({
    isLoading: false,
    tableName: null,
    dbName: null,
    defaultKey: null,
    isVisible: false,
    idItem: 0,
    isLoadingCreate: false,
    msg: {
      tableName: '',
      defaultKey: ''
    }
  }),
  watch: {
    tableName (value) {
      this.tableName = value
      this.validateTableName(value)
    },
    defaultKey (value) {
      this.defaultKey = value
      this.validateDefaultKey(value)
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
    validateDefaultKey (value) {
      if (/^[a-zA-Z_][\w-.,]{0,127}$/.test(value)) {
        this.msg.defaultKey = ''
      } else {
        this.msg.defaultKey = 'Invalid default key'
      }
    },
    async show (id) {
      const dataDb = {
        method: 'GET',
        path: 'database_infor'
      }
      const resDb = await checkPermission(dataDb)
      const dataSer = {
        method: 'POST',
        path: 'server_infor'
      }
      const resSer = await checkPermission(dataSer)
      if (!resDb.data.success || !resSer.data.success) {
        this.$notify({ type: 'error', text: 'Error occurred! - Access Denied' })
      } else {
        this.idItem = id
        this.isVisible = true
        this.isLoading = true
        const res = await getDatabaseDetail(this.idItem)
        if (res.code === '200') {
          this.dbName = res.data.databaseName
          this.tableName = null
          this.defaultKey = null
          this.msg = {
            tableName: '',
            defaultKey: ''
          }
          this.isLoading = false
        }
      }
    },
    onClose () {
      this.isVisible = false
    },
    async addTable () {
      this.validateTableName(this.tableName)
      this.validateDefaultKey(this.defaultKey)
      if (this.tableName === null) {
        this.msg.tableName = 'Invalid table name'
      }
      if (this.defaultKey === null) {
        this.msg.defaultKey = 'Invalid default key'
      }
      if (this.msg.tableName === '' && this.msg.defaultKey === '') {
        try {
          this.isLoadingCreate = true
          const body = {
            tableName: this.tableName,
            databaseInforId: this.idItem,
            defaultKey: this.defaultKey
          }
          const res = await addTable(body)
          this.$emit('onAdded')
          if (res.code === '201') {
            this.$notify({ type: 'success', text: 'Add table succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Add table failed' })
          }
        } catch (e) {
          this.$notify({ type: 'error', text: 'Add table failed' })
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
