<template>
  <div v-if="!isDeny">
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
            <p class="msg-error" v-if="msg">{{ msg }}</p>
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
  <div v-else>
    <common-deny/>
  </div>
</template>

<script>
import { editTable, getTableDetail } from '@/service/table.service'

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
    msg: null,
    isDeny: false
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
      const res = await getTableDetail(this.idItem)
      if (res.statusCode === '403') {
        this.isDeny = true
      } else {
        this.dbName = res.data.databaseInfo.databaseName
        this.tableName = res.data.tableName
        this.msg = null
        this.isLoading = false
        this.isLoadingCreate = false
      }
    },
    onClose () {
      this.isVisible = false
    },
    async editTable () {
      this.validateTableName(this.tableName)
      if (this.tableName === null) {
        this.msg = 'Invalid table name'
      }
      if (this.msg === '') {
        try {
          this.isLoadingCreate = true
          const res = await editTable(this.tableName)
          if (res.statusCode === '403') {
            this.isDeny = true
          } else {
            this.$emit('onUpdated')
            if (res.code === '200') {
              this.$notify({ type: 'success', text: 'Update table succeeded' })
            } else {
              this.$notify({ type: 'error', text: 'Update table failed' })
            }
            this.$router.go()
          }
        } catch (e) {
          this.$notify({ type: 'error', text: e.message })
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
