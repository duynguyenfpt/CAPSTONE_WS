<template>
  <div v-if="!isDeny">
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-row>
        <b-col class="text-center">
          <h1>Add Table</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label>Select Database</label>
          <v-select
            class="select-sm"
            :reduce="(text) => text.value"
            label="text"
            :options="opsDb"
            v-model="db"
            @input="fillData"
            placeholder="Please select an option"
            size="sm"
          >
            <b-spinner v-if="isLoadingFill" variant="primary" small></b-spinner>
          </v-select>
        </b-col>
        <b-col>
          <label>Database Name</label>
          <b-input size="sm" v-model="dbName" :disabled="isChoseDb"></b-input>
          <p class="msg-error" v-if="msg.db">{{ msg.db }}</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">
          <label>Host</label>
          <v-select
            class="select-sm"
            :reduce="(text) => text.value"
            label="text"
            :options="opsHost"
            v-model="host"
            @input="chooseHost"
            size="sm"
            :disabled="isChoseDb"
            placeholder="Please select an option"
          >
          </v-select>
          <p class="msg-error" v-if="msg.host">{{ msg.host }}</p>
        </b-col>
        <b-col cols="3">
          <label>Port</label>
          <b-input size="sm" v-model="port" :disabled="isChoseDb"></b-input>
          <p class="msg-error" v-if="msg.port">{{ msg.port }}</p>
        </b-col>
        <b-col>
          <label>Database Type</label>
          <b-form-select
            v-model="dbType"
            :options="opsDbType"
            size="sm"
            @change="chooseType"
            :disabled="isChoseDb"
          >
          </b-form-select>
          <p class="msg-error" v-if="msg.dbType">{{ msg.dbType }}</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label>Username</label>
          <b-input size="sm" v-model="username" :disabled="isChoseDb"></b-input>
          <p class="msg-error" v-if="msg.username">{{ msg.username }}</p>
        </b-col>
        <b-col>
          <label>Password</label>
          <b-input
            size="sm"
            type="password"
            v-model="password"
            :disabled="isChoseDb"
          ></b-input>
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
          <label>Alias</label>
          <b-input size="sm" v-model="alias" :disabled="isChoseDb"></b-input>
          <p class="msg-error" v-if="msg.alias">{{ msg.alias }}</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="6">
          <label>Default Key</label>
          <b-input size="sm" v-model="defaultKey"></b-input>
          <p class="msg-error" v-if="msg.defaultKey">{{ msg.defaultKey }}</p>
        </b-col>
        <b-col cols="6" v-if="isOracle">
          <label>SID</label>
          <b-input size="sm" v-model="sid" :disabled="isChoseDb"></b-input>
          <p class="msg-error" v-if="msg.sid">{{ msg.sid }}</p>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col class="text-right">
          <b-button
            size="sm"
            variant="outline-primary"
            @click="checkConnectionStatus"
          >
            <b-spinner
              v-if="isLoadingCheck"
              variant="primary"
              small
            ></b-spinner>
            Test connection
          </b-button>
          <b-button size="sm" variant="primary" @click="createTable">
            <b-spinner
              v-if="isLoadingCreate"
              variant="primary"
              small
            ></b-spinner>
            Add Table
          </b-button>
        </b-col>
      </b-row>
    </div>
  </div>
  <div v-else>
    <common-deny/>
  </div>
</template>

<script>
import {
  createDatabase,
  getAllDbType,
  getDatabaseDetail,
  checkConnection
} from '@/service/db'
import { getAllServers } from '@/service/server'
import { checkPermission } from '@/service/right'
import { createTable } from '@/service/table.service'
import Vue from 'vue'
import vSelect from 'vue-select'
Vue.component('v-select', vSelect)

export default {
  data: () => ({
    opsDb: [{ value: null, text: 'Please select an option' }],
    opsHost: [{ value: null, text: 'Please select an option' }],
    opsDbType: [
      { value: null, text: 'Please select an option' },
      { value: 'mysql', text: 'MySql' },
      { value: 'postgresql', text: 'PostgreSQL' },
      { value: 'oracle', text: 'Oracle' }
    ],
    db: null,
    dbName: null,
    host: null,
    port: null,
    username: null,
    password: null,
    table: null,
    dbType: null,
    sid: null,
    alias: null,
    defaultKey: null,
    isLoading: false,
    isLoadingCreate: false,
    isLoadingFill: false,
    isLoadingCheck: false,
    isChoseDb: false,
    isOracle: false,
    msg: {
      db: '',
      tb: '',
      host: '',
      port: '',
      username: '',
      password: '',
      dbType: '',
      sid: '',
      alias: '',
      defaultKey: ''
    },
    isDeny: false
  }),
  async created () {
    await this.checkPermission()
    if (!this.isDeny) {
      this.isLoading = true
      await this.getAllServer()
      await this.getAllDb()
      this.resetData()
      this.isLoading = false
    }
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
    },
    sid (value) {
      this.sid = value
      this.validateSid(value)
    },
    alias (value) {
      this.alias = value
      this.validateAlias(value)
    },
    defaultKey (value) {
      this.defaultKey = value
      this.validateKeyDefault(value)
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
      if (/^[a-zA-Z_][\w-.]{0,127}$/.test(value)) {
        this.msg.tb = ''
      } else {
        this.msg.tb = 'Invalid table name'
      }
    },
    validatePortNumber (value) {
      if (
        /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(
          value
        ) ||
        value === null
      ) {
        this.msg.port = ''
      } else {
        this.msg.port = 'Invalid port number'
      }
    },
    validateUsername (value) {
      if (/^[a-zA-Z_][\w]{0,127}$/.test(value)) {
        this.msg.username = ''
      } else {
        this.msg.username = 'Invalid username'
      }
    },
    validatePassword (value) {
      if (/^[\w#@]{6,127}$/.test(value) || value === null || value === '') {
        this.msg.password = ''
      } else {
        this.msg.password = 'Invalid password'
      }
    },
    validateSid (value) {
      if (/^[a-zA-Z_][\w-.]{0,127}$/.test(value)) {
        this.msg.sid = ''
      } else {
        this.msg.sid = 'Invalid sid'
      }
    },
    validateAlias (value) {
      if (/^[a-zA-Z_][\w-.]{1,50}$/.test(value)) {
        this.msg.alias = ''
      } else {
        this.msg.alias = 'Invalid alias'
      }
    },
    validateKeyDefault (value) {
      if (/^[a-zA-Z_][\w-.,]{0,127}$/.test(value)) {
        this.msg.defaultKey = ''
      } else {
        this.msg.defaultKey = 'Invalid key default'
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
      if (this.dbType === 'oracle') {
        this.isOracle = true
      } else {
        this.isOracle = false
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
      this.sid = null
      this.alias = null
      this.isOracle = false
      this.defaultKey = null
      this.msg.db = ''
      this.msg.tb = ''
      this.msg.host = ''
      this.msg.port = ''
      this.msg.username = ''
      this.msg.password = ''
      this.msg.dbType = ''
      this.msg.sid = ''
      this.msg.alias = ''
      this.msg.defaultKey = ''
    },
    async checkPermission () {
      const dataServer = {
        method: 'GET',
        path: 'server_infor'
      }
      const resServer = await checkPermission(dataServer)
      const dataDb = {
        method: 'GET',
        path: 'database_infor'
      }
      const resDb = await checkPermission(dataDb)
      const dataDbCreate = {
        method: 'POST',
        path: 'database_infor'
      }
      const resDbCreate = await checkPermission(dataDbCreate)
      const data = {
        method: 'POST',
        path: 'table'
      }
      const res = await checkPermission(data)
      if (!res.data.success || !resServer.data.success || !resDb.data.success || resDbCreate.data.success) {
        this.isDeny = true
      }
    },
    async getAllDb () {
      const dbs = await getAllDbType()
      if (dbs.code === '200') {
        this.opsDb = dbs.data.map((item) => {
          return { value: item.id, text: item.databaseName }
        })
      }
    },
    async getAllServer () {
      const hosts = await getAllServers()
      if (hosts.code === '200') {
        this.opsHost = hosts.data.map((item) => {
          return {
            value: item.id,
            text: item.serverHost + ' - ' + item.serverDomain
          }
        })
      }
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
            table: this.table,
            sid: this.sid,
            alias: this.alias,
            defaultKey: this.defaultKey
          }
          const res = await createTable(config)
          this.isLoadingCreate = false
          if (res.code === '201') {
            this.$notify({ type: 'success', text: 'Add table succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Add table failed' })
          }
        } catch (e) {
          this.$notify({ type: 'error', text: 'Add table failed' })
        }
      }
    },
    async fillData () {
      const id = this.db
      if (id !== null) {
        this.isLoadingFill = true
        const res = await getDatabaseDetail(id)
        if (res.statusCode === '403') {
          this.isDeny = true
        } else {
          this.isLoadingFill = false
          this.dbName = res.data.databaseName
          this.host = res.data.serverInfor.id
          this.port = res.data.port
          this.username = res.data.username
          this.password = res.data.password
          this.dbType = res.data.databaseType
          this.alias = res.data.alias
          if (this.dbType === 'oracle') {
            this.isOracle = true
            this.sid = res.data.sid
          } else {
            this.isOracle = false
            this.sid = ''
          }
          this.isChoseDb = true
        }
      } else {
        this.resetData()
        this.isChoseDb = false
      }
    },
    async createTable () {
      const id = this.db
      this.validateDBName(this.dbName)
      this.validateTableName(this.table)
      this.validatePortNumber(this.port)
      this.validateUsername(this.username)
      this.validatePassword(this.password)
      this.validateKeyDefault(this.defaultKey)
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
      if (this.alias === null) {
        this.msg.alias = 'Invalid alias'
      }
      if (this.defaultKey === null) {
        this.msg.defaultKey = 'Invalid key default'
      }
      if ((this.sid === null || this.sid === '') && this.isOracle === true) {
        this.msg.sid = 'Invalid sid'
      } else {
        this.msg.sid = ''
      }
      if (id !== null) {
        if (
          this.msg.db === '' &&
          this.msg.tb === '' &&
          this.msg.port === '' &&
          this.msg.username === '' &&
          this.msg.password === '' &&
          this.msg.host === '' &&
          this.msg.dbType === '' &&
          this.msg.sid === '' &&
          this.msg.alias === '' &&
          this.msg.defaultKey === ''
        ) {
          try {
            this.isLoadingCreate = true
            const info = { databaseInforId: id, tableName: this.table, defaultKey: this.defaultKey }
            const res = await createTable(info)
            if (res.statusCode === '403') {
              this.isDeny = true
            } else {
              this.isLoadingCreate = false
              if (res.code === '201') {
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
      } else {
        this.validateDBName(this.dbName)
        if (this.dbName === null) {
          this.msg.db = 'Invalid database name'
        }
        if (
          this.msg.db === '' &&
          this.msg.tb === '' &&
          this.msg.port === '' &&
          this.msg.username === '' &&
          this.msg.password === '' &&
          this.msg.host === '' &&
          this.msg.dbType === '' &&
          this.msg.sid === '' &&
          this.msg.alias === ''
        ) {
          try {
            const db = {
              serverInforId: this.host,
              port: this.port,
              databaseName: this.dbName,
              username: this.username,
              password: this.password,
              databaseType: this.dbType,
              sid: this.sid,
              alias: this.alias
            }
            const resDb = await createDatabase(db)
            if (resDb.statusCode === '403') {
              this.isDeny = true
            } else {
              if (resDb.code === '201') {
                const tb = {
                  databaseInforId: resDb.data.id,
                  tableName: this.table,
                  defaultKey: this.defaultKey
                }
                this.isLoadingCreate = true
                const resq = await createTable(tb)
                if (resq.statusCode === '403') {
                  this.isDeny = true
                } else {
                  this.isLoadingCreate = false
                  if (resq.code) {
                    this.$notify({ type: 'success', text: 'Add table succeeded' })
                    this.resetData()
                  } else {
                    this.$notify({ type: 'error', text: 'Add table failed' })
                  }
                }
              }
            }
          } catch (e) {
            this.$notify({ type: 'error', text: 'Add table failed' })
          }
        }
      }
    },
    async checkConnectionStatus () {
      try {
        this.isLoadingCheck = true
        const data = {
          serverInforId: this.host,
          port: this.port,
          username: this.username,
          password: this.password,
          databaseName: this.dbName,
          databaseType: this.dbType,
          sid: this.sid
        }
        const res = await checkConnection(data)
        if (res.statusCode === '403') {
          this.isDeny = true
        } else {
          if (res.code === '200' && res.data.success) {
            this.$notify({ type: 'success', text: 'Test connection succeeded.' })
          } else {
            this.$notify({ type: 'error', text: 'Test connection failed' })
          }
        }
      } catch (e) {
        this.$notify({ type: 'error', text: 'Test connection failed' })
      } finally {
        this.isLoadingCheck = false
      }
    }
  }
}
</script>

<style>
@import "vue-select/dist/vue-select.css";
.vs--searchable .vs__dropdown-toggle {
  width: 100%;
  min-width: 245.54px;
  white-space: nowrap;
  max-height: 31px;
  height: calc(1.5em + 0.5rem + 2px);
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  font-size: 0.875rem;
}
.vs__selected {
  margin: 0;
  padding-bottom: 3px;
  padding-left: 0;
}
.vs__actions {
  padding: 0;
  margin-right: 5px;
}
.vs__clear {
  margin-bottom: 2px;
}
</style>
