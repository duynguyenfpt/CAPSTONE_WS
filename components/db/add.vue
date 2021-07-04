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
          size="sm"
        ></b-form-select>
      </b-col>
      <b-col>
        <label class="form-label">Port</label>
        <b-input size="sm" v-model="port" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label class="form-label">Database</label>
        <b-input size="sm" v-model="databaseName" />
        <p class="msg-error" v-if="msg">{{ msg }}</p>
        <label class="form-label">User</label>
        <b-input size="sm" v-model="username" />
        <label class="form-label">Password</label>
        <b-input size="sm" v-model="password" type="password" />
        <label class="form-label">Database Type</label>
        <b-form-select
          v-model="databaseType"
          :options="dbTypes"
          size="sm"
        ></b-form-select>
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
      { value: 'mongoDB', text: 'Mongo DB' },
      { value: 'PostgreSQL', text: 'PostgreSQL' },
      { value: 'SQL-Sever', text: 'SQL-Sever' }
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
    msg: null
  }),

  async mounted () {
    this.isLoading = true
    const hosts = await getAllServers()
    // eslint-disable-next-line array-callback-return
    hosts.data.map(item => {
      this.dbHosts.push({ value: item.id, text: item.serverHost })
    })
    this.isLoading = false
  },

  watch: {
    databaseName (value) {
      this.databaseName = value
      this.validateDBName(value)
    }
  },

  methods: {
    async show () {
      this.isVisible = true
    },
    validateDBName (value) {
      if (/^[a-zA-Z\d][\w#@]{0,127}$/.test(value)) {
        this.msg = ''
      } else {
        this.msg = 'Invalid database name'
      }
    },
    async createDatabaseInfo () {
      if (this.msg === '') {
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
