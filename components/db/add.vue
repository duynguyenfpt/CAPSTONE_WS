<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-modal v-model="isVisible" title="Create Database" hide-footer>
    <b-row>
      <b-col>
        <label class="form-label">Host</label>
        <b-form-select
          v-model="serverInforId"
          :options="dbHosts"
          @change="chooseHost"
          size="sm"
        ></b-form-select>
        <p class="msg-error" v-if="msg.serverInforId">{{ msg.serverInforId }}</p>
      </b-col>
      <b-col>
        <label class="form-label">Port</label>
        <b-input size="sm" v-model="port" />
        <p class="msg-error" v-if="msg.port">{{ msg.port }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label class="form-label">Database</label>
        <b-input size="sm" v-model="databaseName" />
        <p class="msg-error" v-if="msg.databaseName">{{ msg.databaseName }}</p>
        <label class="form-label">Username</label>
        <b-input size="sm" v-model="username" />
        <p class="msg-error" v-if="msg.username">{{ msg.username }}</p>
        <label class="form-label">Password</label>
        <b-input size="sm" v-model="password" type="password" />
        <p class="msg-error" v-if="msg.password">{{ msg.password }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label class="form-label">Database Type</label>
        <b-form-select
          v-model="databaseType"
          :options="dbTypes"
          size="sm"
          @change="chooseDbType"
        ></b-form-select>
        <p class="msg-error" v-if="msg.databaseType">{{ msg.databaseType }}</p>
      </b-col>
    </b-row>
    <b-row class="pt-3">
      <b-col>
          <b-button size="sm" variant="outline-primary" @click="checkConnectionStatus">
            <b-spinner v-if="isLoadingCheck" variant="primary" small></b-spinner>
            <i v-if="isConnected" class="fas fa-check"></i>
            Test connection
          </b-button>
      </b-col>
      <b-col class="text-right">
          <b-button size="sm" variant="primary" @click='createDatabaseInfo'>
            <b-spinner v-if="isLoadingCreate" variant="primary" small></b-spinner>
            Create
          </b-button>
      </b-col>
    </b-row>
    </b-modal>
    </div>
  </div>
</template>

<script>
import { createDatabase, checkConnection } from '@/service/db'
import { getAllServers } from '@/service/server'

export default {
  data: () => ({
    dbHosts: [
      { value: null, text: 'Please select an option' }
    ],
    dbTypes: [
      { value: null, text: 'Please select an option' },
      { value: 'mysql', text: 'My Sql' },
      { value: 'mogodb', text: 'Mongo DB' },
      { value: 'postgresql', text: 'PostgreSQL' },
      { value: 'sql', text: 'SQL-Sever' },
      { value: 'oracal', text: 'Oracle' }
    ],
    serverInforId: null,
    port: null,
    databaseName: null,
    username: null,
    password: null,
    databaseType: null,
    isLoading: false,
    isLoadingCreate: false,
    isLoadingCheck: false,
    isConnected: false,
    isVisible: false,
    msg: {
      databaseName: null,
      port: null,
      username: null,
      password: null,
      serverInforId: null,
      databaseType: null
    }
  }),

  async mounted () {
    this.isLoading = true
    const hosts = await getAllServers()
    // eslint-disable-next-line array-callback-return
    hosts.data.map(item => {
      this.dbHosts.push({ value: item.id, text: item.serverDomain + ' - ' + item.serverHost })
    })
    this.isLoading = false
  },

  watch: {
    databaseName (value) {
      this.databaseName = value
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
    async show () {
      this.isVisible = true
      this.port = null
      this.username = null
      this.password = null
      this.databaseName = null
      this.databaseType = null
      this.serverInforId = null
      this.msg.databaseName = null
      this.msg.port = null
      this.msg.username = null
      this.msg.password = null
      this.msg.serverInforId = null
      this.msg.databaseType = null
    },
    validateDBName (value) {
      if (/^[a-zA-Z\d][\w#@]{1,127}$/.test(value)) {
        this.msg.databaseName = ''
      } else {
        this.msg.databaseName = 'Invalid database name'
      }
    },
    validatePortNumber (value) {
      if (/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(value)) {
        this.msg.port = ''
      } else {
        this.msg.port = 'Invalid port number'
      }
    },
    validateUsername (value) {
      if (/^[a-zA-Z0-9]+$/.test(value)) {
        this.msg.username = ''
      } else {
        this.msg.username = 'Invalid username'
      }
    },
    validatePassword (value) {
      if (/^[\w#@]{6,127}$/.test(value)) {
        this.msg.password = ''
      } else {
        this.msg.password = 'Invalid password'
      }
    },
    chooseHost () {
      if (this.serverInforId === null) {
        this.msg.serverInforId = 'Please select host'
      } else {
        this.msg.serverInforId = ''
      }
    },
    chooseDbType () {
      if (this.databaseType === null) {
        this.msg.databaseType = 'Please select type database'
      } else {
        this.msg.databaseType = ''
      }
    },
    async createDatabaseInfo () {
      this.validateDBName(this.databaseName)
      this.validatePortNumber(this.port)
      this.validateUsername(this.username)
      this.validatePassword(this.password)
      if (this.databaseName === null) {
        this.msg.databaseName = 'Invalid database name'
      }
      if (this.username === null) {
        this.msg.username = 'Invalid username'
      }
      if (this.serverInforId === null) {
        this.msg.serverInforId = 'Please select host'
      }
      if (this.databaseType === null) {
        this.msg.databaseType = 'Please select type database'
      }
      if (this.msg.databaseName === '' && this.msg.port === '' && this.msg.username === '' && this.msg.password === '' && this.msg.serverInforId === '' && this.msg.databaseType === '') {
        try {
          this.isLoadingCreate = true
          const config = {
            port: this.port,
            username: this.username,
            password: this.password,
            databaseName: this.databaseName,
            databaseType: this.databaseType,
            serverInforId: this.serverInforId
          }
          const res = await createDatabase(config)
          this.isLoadingCreate = false
          this.isVisible = false
          this.$emit('onAdded')
          if (res.code === '201') {
            this.$notify({ type: 'success', text: 'Create database succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Create database failed' })
          }
        } catch (e) {
          this.$notify({ type: 'error', text: e.message })
        }
      }
    },
    async checkConnectionStatus () {
      try {
        this.isLoadingCheck = true
        const res = await checkConnection
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
