<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
    <h1>Add table</h1>
     <b-row>
      <b-col>
        <label>Select Database</label>
        <b-form-select v-model="config.db" :options="opsDb" size="sm" @change="fillData">
          <b-spinner v-if="isLoadingFill" variant="primary" small></b-spinner>
        </b-form-select>
      </b-col>
      <b-col>
        <label>Database Name</label>
        <b-input size="sm" v-model="config.dbName"></b-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label>Host</label>
        <b-form-select size="sm" v-model="config.host" :options="opsHost"></b-form-select>
      </b-col>
      <b-col>
        <label>Port</label>
        <b-input size="sm" v-model="config.port"></b-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label>Username</label>
        <b-input size="sm" v-model="config.username"></b-input>
      </b-col>
      <b-col>
        <label>Password</label>
        <b-input size="sm" v-model="config.password"></b-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label>Table Name</label>
        <b-input size="sm" v-model="config.table" :state="validateTable"></b-input>
      </b-col>
      <b-col>
        <label>Database Type</label>
        <b-form-select v-model="config.dbType" :options="opsDbType" size="sm">
        </b-form-select>
      </b-col>
    </b-row>
    <b-row class="pt-2">
      <b-col class="text-right">
        <b-button size="sm" variant="primary" @click="createTable">
          <b-spinner v-if="isLoadingCreate" variant="primary" small></b-spinner>
          Add Table
        </b-button>
      </b-col>
    </b-row>
    </div>
  </div>
</template>

<script>
import { createDatabase, getAllDbType, getDatabaseDetail } from '@/service/db'
import { getAllServers } from '@/service/server'
import { createTable } from '@/service/table.service'

export default {
  data: () => ({
    opsDb: [
      { value: null, text: 'Please select an option' }
    ],
    opsHost: [
      { value: null, text: 'Please select an option' }
    ],
    opsDbType: [
      { value: null, text: 'Please select an option' },
      { value: 'mysql', text: 'My Sql' },
      { value: 'mongoDB', text: 'Mongo DB' },
      { value: 'PostgreSQL', text: 'PostgreSQL' },
      { value: 'SQL-Sever', text: 'SQL-Sever' }
    ],
    config: {
      db: null,
      dbName: null,
      host: null,
      port: null,
      username: null,
      password: null,
      table: null,
      dbType: null
    },
    isLoading: false,
    isLoadingCreate: false,
    isLoadingFill: false
  }),
  computed: {
    validateTable () {
      return /^(\d|\w|_)+$/.test(this.config.table || '')
    }
  },
  async mounted () {
    this.isLoading = true
    const dbs = await getAllDbType()
    // eslint-disable-next-line array-callback-return
    dbs.data.map(item => {
      this.opsDb.push({ value: item.id, text: item.databaseName })
    })
    const hosts = await getAllServers()
    // eslint-disable-next-line array-callback-return
    hosts.data.map(item => {
      this.opsHost.push({ value: item.id, text: item.serverHost })
    })
    this.isLoading = false
  },

  methods: {
    resetData () {
      this.config.db = null
      this.config.dbName = null
      this.config.host = null
      this.config.port = null
      this.config.username = null
      this.config.password = null
      this.config.table = null
      this.config.dbType = null
    },
    async createTableInfo () {
      try {
        this.isLoadingCreate = true
        const res = await createTable(this.config)
        this.isLoadingCreate = false
        if (res.id) {
          this.$notify({ type: 'success', text: 'Add successful' })
        } else {
          this.$notify({ type: 'error', text: 'Add failed' })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      }
    },
    async fillData () {
      const id = this.config.db
      if (id !== null) {
        this.isLoadingFill = true
        const res = await getDatabaseDetail(id)
        this.isLoadingFill = false
        this.config.dbName = res.data.databaseName
        this.config.host = res.data.host
        this.config.port = res.data.port
        this.config.username = res.data.username
        this.config.password = res.data.password
        this.config.dbType = res.data.databaseType
      } else {
        this.resetData()
      }
    },
    async createTable () {
      const id = this.config.db
      if (id !== null) {
        try {
          this.isLoadingCreate = true
          const res = await createTable(this.config)
          this.isLoadingCreate = false
          if (res.code) {
            this.$notify({ type: 'success', text: 'Add successful' })
          } else {
            this.$notify({ type: 'error', text: 'Add failed' })
          }
        } catch (e) {
          this.$notify({ type: 'error', text: e.message })
        }
      } else {
        try {
          const db = [this.config.host, this.config.port, this.config.dbName, this.config.username, this.config.password, this.config.dbType]
          const resDb = await createDatabase(db)
          if (resDb.code) {
            const tb = [this.config.dbName, this.config.table]
            await createTable(tb)
          }
        } catch (e) {
          this.$notify({ type: 'error', text: e.message })
        }
      }
    }
  }
}
</script>

<style></style>
