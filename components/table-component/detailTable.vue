<template>
  <div>
    <b-modal no-close-on-backdrop v-model="isVisible" title="Detail Table" hide-footer>
      <div v-if="isLoading" class="text-center">
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
      <div v-else>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="form-lab">Database Name</label>
          </b-col>
          <b-col>
            <b-input size="sm" disabled v-model="dbName"></b-input>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="form-lab">Database Type</label>
          </b-col>
          <b-col>
            <b-input size="sm" disabled v-model="dbType"></b-input>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="text-center">Table Name</label>
          </b-col>
          <b-col>
            <b-form-input
              disabled
              size="sm"
              v-model="tableName"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="text-center">Default Key</label>
          </b-col>
          <b-col>
            <b-form-input
              disabled
              size="sm"
              v-model="defaultKey"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row class="text-center pt-3">
          <b-col class="text-right">
            <b-button size="sm" variant="light" @click="onClose">
              Close
            </b-button>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { getTableDetail } from '@/service/table.service'
import { checkPermission } from '~/service/right'

export default {
  props: {
    database: {}
  },
  data: () => ({
    isLoading: false,
    tableName: null,
    defaultKey: null,
    dbName: null,
    dbType: null,
    isVisible: false,
    idItem: 0,
    isLoadingCreate: false,
    msg: {
      tableName: null,
      defaultKey: null
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
      const dataGet = {
        method: 'GET',
        path: 'table'
      }
      const resGet = await checkPermission(dataGet)
      if (!resGet.data.success) {
        this.$notify({ type: 'error', text: 'Error occurred! - Access Denied' })
      } else {
        this.idItem = id
        this.isVisible = true
        this.isLoading = true
        const res = await getTableDetail(this.idItem)
        if (res.code === '200') {
          this.dbName = res.data.databaseInfo.databaseName
          if (res.data.databaseInfo.databaseType === 'mysql') {
            res.data.databaseInfo.databaseType = 'MySql'
          }
          if (res.data.databaseInfo.databaseType === 'postgresql') {
            res.data.databaseInfo.databaseType = 'PostgreSQL'
          }
          if (res.data.databaseInfo.databaseType === 'oracle') {
            res.data.databaseInfo.databaseType = 'Oracle'
          }
          this.dbType = res.data.databaseInfo.databaseType
          this.tableName = res.data.tableName
          this.defaultKey = res.data.defaultKey
          this.msg.tableName = null
          this.msg.defaultKey = null
          this.isLoading = false
          this.isLoadingCreate = false
        }
      }
    },
    onClose () {
      this.isVisible = false
    }
  }
}
</script>

<style></style>
