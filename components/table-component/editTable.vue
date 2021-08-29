<template>
  <div>
    <b-modal v-model="isVisible" title="Edit Table" hide-footer>
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
            <b-button @click="editTable" variant="primary" size="sm"
              >
              <b-spinner v-if="isLoadingCreate" variant="primary" small></b-spinner>
              Update</b-button
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
import { editTable, getTableDetail } from '@/service/table.service'
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
      const dataPut = {
        method: 'PUT',
        path: 'table'
      }
      const resPut = await checkPermission(dataPut)
      if (!resGet.data.success || !resPut.data.success) {
        this.$notify({ type: 'error', text: 'Error occurred! - Access Denied' })
      } else {
        this.idItem = id
        this.isVisible = true
        this.isLoading = true
        const res = await getTableDetail(this.idItem)
        if (res.code === '200') {
          this.dbName = res.data.databaseInfo.databaseName
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
    },
    async editTable () {
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
            defaultKey: this.defaultKey
          }
          const res = await editTable(this.idItem, body)
          this.$emit('onUpdated')
          if (res.code === '200') {
            this.$notify({ type: 'success', text: 'Update table succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Update table failed' })
          }
        } catch (e) {
          this.$notify({ type: 'error', text: 'Update table failed' })
        } finally {
          this.isLoadingCreate = false
          this.isVisible = false
        }
      }
    }
  }
}
</script>

<style></style>
