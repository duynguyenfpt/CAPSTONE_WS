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
        <b-form-select v-model="db" :options="opsDb" size="sm" @change="fillData">
          <b-spinner v-if="isLoadingFill" variant="primary" small></b-spinner>
        </b-form-select>
      </b-col>
      <b-col>
        <label>Database Name</label>
        <b-input size="sm" v-model="dbName"></b-input>
        <p class="msg-error" v-if="msg.db">{{ msg.db }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label>Host</label>
        <b-form-select size="sm" v-model="host" :options="opsHost"></b-form-select>
      </b-col>
      <b-col>
        <label>Port</label>
        <b-input size="sm" v-model="port"></b-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label>Username</label>
        <b-input size="sm" v-model="username"></b-input>
      </b-col>
      <b-col>
        <label>Password</label>
        <b-input size="sm" type="password" v-model="password"></b-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label>Table Name</label>
        <b-input size="sm" v-model="table"></b-input>
        <p class="msg-error" v-if="msg.tb">{{ msg.tb }}</p>
      </b-col>
      <b-col>
        <label>Database Type</label>
        <b-form-select v-model="dbType" :options="opsDbType" size="sm">
        </b-form-select>
      </b-col>
    </b-row>
    <b-row class="pt-2">
      <b-col class="text-right">
        <b-button size="sm" variant="outline-primary" @click="checkConnectionStatus">
            <b-spinner v-if="isLoadingCheck" variant="primary" small></b-spinner>
            Test connection
          </b-button>
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
import { createDatabase, getAllDbType, getDatabaseDetail, checkConnection } from '@/service/db'
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
    db: null,
    dbName: null,
    host: null,
    port: null,
    username: null,
    password: null,
    table: null,
    dbType: null,
    isLoading: false,
    isLoadingCreate: false,
    isLoadingFill: false,
    isLoadingCheck: false,
    msg: {
      db: null,
      tb: null
    }
  }),
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
  watch: {
    table (value) {
      this.table = value
      this.validateTableName(value)
    },
    dbName (value) {
      this.dbName = value
      this.validateDBName(value)
    }
  },
  methods: {
    validateDBName (value) {
      if (/^[a-zA-Z\d][\w#@]{0,127}$/.test(value)) {
        this.msg.db = ''
      } else {
        this.msg.db = 'Invalid database name'
      }
    },
    validateTableName (value) {
      if (/^(\d|\w|_)+$/.test(value)) {
        this.msg.tb = ''
      } else {
        this.msg.tb = 'Invalid table name'
      }
    },
    resetData () {
      this.db = null
      this.dbName = null
      this.host = null
      this.port = null
      this.username = null
      this.password = null
      this.table = null
      this.dbType = null
    },
    async createTableInfo () {
      if (this.msg.db === '' && this.msg.tb === '') {
        try {
          this.isLoadingCreate = true
          const config = {
            port: this.port,
            username: this.username,
            password: this.password,
            databaseName: this.dbName,
            databaseType: this.dbType,
            serverInforId: this.host,
            db: this.db,
            table: this.table
          }
          const res = await createTable(config)
          this.isLoadingCreate = false
          if (res.id) {
            this.$notify({ type: 'success', text: 'Add table succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Add table failed' })
          }
        } catch (e) {
          this.$notify({ type: 'error', text: e.message })
        }
      }
    },
    async fillData () {
      const id = this.db
      if (id !== null) {
        this.isLoadingFill = true
        const res = await getDatabaseDetail(id)
        this.isLoadingFill = false
        this.dbName = res.data.databaseName
        this.host = res.data.host
        this.port = res.data.port
        this.username = res.data.username
        this.password = res.data.password
        this.dbType = res.data.databaseType
      } else {
        this.resetData()
      }
    },
    async createTable () {
      const id = this.db
      if (id !== null) {
        try {
          this.isLoadingCreate = true
          const info = { databaseInforId: id, tableName: this.table }
          const res = await createTable(info)
          this.isLoadingCreate = false
          if (res.code) {
            this.$notify({ type: 'success', text: 'Add table succeeded' })
            this.resetData()
          } else {
            this.$notify({ type: 'error', text: 'Add table failed' })
          }
        } catch (e) {
          this.$notify({ type: 'error', text: e.message })
        }
      } else {
        try {
          const db = { serverInforId: this.host, port: this.port, databaseName: this.dbName, username: this.username, password: this.password, databaseType: this.dbType }
          const resDb = await createDatabase(db)
          if (resDb.code) {
            const tb = { databaseInforId: resDb.data.id, tableName: this.table }
            this.isLoadingCreate = true
            const resq = await createTable(tb)
            this.isLoadingCreate = false
            if (resq.code) {
              this.$notify({ type: 'success', text: 'Add table succeeded' })
              this.resetData()
            } else {
              this.$notify({ type: 'error', text: 'Add table failed' })
            }
          }
        } catch (e) {
          this.$notify({ type: 'error', text: e.message })
        }
      }
    },
    async checkConnectionStatus () {
      try {
        this.isLoadingCheck = true
        const res = await checkConnection(this.config)
        this.isConnected = res.success
        if (this.isConnected) {
          this.$notify({ type: 'success', text: 'Test connection succeeded.' })
        } else {
          this.$notify({ type: 'error', text: 'Test connection failed' })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.isLoadingCheck = false
      }
    }
  }
}
</script>

<style></style>
