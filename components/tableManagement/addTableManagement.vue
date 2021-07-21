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
        <b-form-select size="sm" v-model="host" :options="opsHost" @change="chooseHost"></b-form-select>
        <p class="msg-error" v-if="msg.host">{{ msg.host }}</p>
      </b-col>
      <b-col>
        <label>Port</label>
        <b-input size="sm" v-model="port"></b-input>
        <p class="msg-error" v-if="msg.port">{{ msg.port }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label>Username</label>
        <b-input size="sm" v-model="username"></b-input>
        <p class="msg-error" v-if="msg.username">{{ msg.username }}</p>
      </b-col>
      <b-col>
        <label>Password</label>
        <b-input size="sm" type="password" v-model="password"></b-input>
        <p class="msg-error" v-if="msg.password">{{ msg.password }}</p>
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
        <b-form-select v-model="dbType" :options="opsDbType" size="sm" @change="chooseType">
        </b-form-select>
        <p class="msg-error" v-if="msg.dbType">{{ msg.dbType }}</p>
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
      { value: 'mogodb', text: 'Mongo DB' },
      { value: 'postgresql', text: 'PostgreSQL' },
      { value: 'sql', text: 'SQL-Sever' },
      { value: 'oracal', text: 'Oracle' }
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
      db: '',
      tb: '',
      host: '',
      port: '',
      username: '',
      password: '',
      dbType: ''
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
      this.opsHost.push({ value: item.id, text: item.serverHost + ' - ' + item.serverDomain })
    })
    this.msg.password = ''
    this.msg.port = ''
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
    },
    port (value) {
      this.port = value
      this.validatePortNumber(value)
    },
    username (value) {
      this.username = value
      this.validateUsername(value)
    },
    password (value) {
      this.password = value
      this.validatePassword(value)
    }
  },
  methods: {
    validateDBName (value) {
      if (/^[a-zA-Z_][\w-]{0,127}$/.test(value)) {
        this.msg.db = ''
      } else {
        this.msg.db = 'Invalid database name'
      }
    },
    validateTableName (value) {
      if (/^[a-zA-Z_][\w-]{0,127}$/.test(value)) {
        this.msg.tb = ''
      } else {
        this.msg.tb = 'Invalid table name'
      }
    },
    validatePortNumber (value) {
      if (/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(value) || value === null) {
        this.msg.port = ''
      } else {
        this.msg.port = 'Invalid port number'
      }
    },
    validateUsername (value) {
      console.log('User: ', value)
      if (/^[a-zA-Z_][\w]{0,127}$/.test(value)) {
        this.msg.username = ''
      } else {
        this.msg.username = 'Invalid username'
      }
    },
    validatePassword (value) {
      console.log('Pass: ', value)
      if (/^[\w#@]{6,127}$/.test(value) || value === null) {
        this.msg.password = ''
      } else {
        this.msg.password = 'Invalid password'
      }
    },
    chooseHost () {
      if (this.host === null) {
        this.msg.dbType = 'Please select host'
      } else {
        this.msg.host = ''
      }
    },
    chooseType () {
      if (this.dbType === null) {
        this.msg.dbType = 'Please select type database'
      } else {
        this.msg.dbType = ''
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
      this.msg.db = ''
      this.msg.tb = ''
      this.msg.host = ''
      this.msg.port = ''
      this.msg.username = ''
      this.msg.password = ''
      this.msg.dbType = ''
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
        this.host = res.data.serverInfor.id
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
      this.validateDBName(this.dbName)
      this.validateTableName(this.table)
      this.validatePortNumber(this.port)
      this.validateUsername(this.username)
      this.validatePassword(this.password)
      if (this.databaseName === null) {
        this.msg.db = 'Invalid database name'
      }
      if (this.username === null) {
        this.msg.username = 'Invalid username'
      }
      if (this.table === null) {
        this.msg.tb = 'Invalid table name'
      }
      if (this.host === null) {
        this.msg.host = 'Please select host'
      }
      if (this.dbType === null) {
        this.msg.dbType = 'Please select type database'
      }
      if (this.password === null) {
        this.msg.password = 'Invalid password'
      }
      if (this.port === null) {
        this.msg.port = 'Invalid port number'
      }
      if (id !== null) {
        if (this.msg.db === '' && this.msg.tb === '' && this.msg.port === '' && this.msg.username === '' && this.msg.password === '' && this.msg.host === '' && this.msg.dbType === '') {
          try {
            this.isLoadingCreate = true
            const info = { databaseInforId: id, tableName: this.table }
            const res = await createTable(info)
            this.isLoadingCreate = false
            if (res.code === '201') {
              this.$notify({ type: 'success', text: 'Add table succeeded' })
              this.resetData()
            } else {
              this.$notify({ type: 'error', text: 'Add table failed' })
            }
          } catch (e) {
            this.$notify({ type: 'error', text: e.message })
          }
        }
      } else {
        this.validateDBName(this.dbName)
        if (this.dbName === null) {
          this.msg.db = 'Invalid database name'
        }
        if (this.msg.db === '' && this.msg.tb === '' && this.msg.port === '' && this.msg.username === '' && this.msg.password === '' && this.msg.host === '' && this.msg.dbType === '') {
          try {
            const db = { serverInforId: this.host, port: this.port, databaseName: this.dbName, username: this.username, password: this.password, databaseType: this.dbType }
            const resDb = await createDatabase(db)
            if (resDb.code === '201') {
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
