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
            <v-select
              class="select-sm"
              :reduce="(text) => text.value"
              label="text"
              :options="dbHosts"
              v-model="serverInforId"
              @input="chooseHost"
              size="sm"
            ></v-select>
            <p class="msg-error" v-if="msg.serverInforId">
              {{ msg.serverInforId }}
            </p>
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
            <p class="msg-error" v-if="msg.databaseName">
              {{ msg.databaseName }}
            </p>
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
            <p class="msg-error" v-if="msg.databaseType">
              {{ msg.databaseType }}
            </p>
          </b-col>
        </b-row>
        <b-row v-if="isOracle">
          <b-col>
            <label class="form-label">SID</label>
            <b-input size="sm" v-model="sid" type="sid" />
            <p class="msg-error" v-if="msg.sid">{{ msg.sid }}</p>
          </b-col>
        </b-row>
        <b-row class="pt-3">
          <b-col>
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
              <i v-if="isConnected" class="fas fa-check"></i>
              Test connection
            </b-button>
          </b-col>
          <b-col class="text-right">
            <b-button size="sm" variant="primary" @click="createDatabaseInfo">
              <b-spinner
                v-if="isLoadingCreate"
                variant="primary"
                small
              ></b-spinner>
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
import Vue from 'vue'
import vSelect from 'vue-select'

Vue.component('v-select', vSelect)
export default {
  data: () => ({
    dbHosts: [{ value: null, text: 'Please select an option' }],
    dbTypes: [
      { value: null, text: 'Please select an option' },
      { value: 'mysql', text: 'My Sql' },
      { value: 'postgresql', text: 'PostgreSQL' },
      { value: 'oracle', text: 'Oracle' }
    ],
    serverInforId: null,
    port: null,
    databaseName: null,
    username: null,
    password: null,
    databaseType: null,
    sid: null,
    isLoading: false,
    isLoadingCreate: false,
    isLoadingCheck: false,
    isConnected: false,
    isVisible: false,
    isOracle: false,
    msg: {
      databaseName: null,
      port: null,
      username: null,
      password: null,
      serverInforId: null,
      databaseType: null,
      sid: null
    }
  }),

  async mounted () {
    this.isLoading = true
    const hosts = await getAllServers()
    // eslint-disable-next-line array-callback-return
    hosts.data.map((item) => {
      this.dbHosts.push({
        value: item.id,
        text: item.serverDomain + ' - ' + item.serverHost
      })
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
    },
    sid (value) {
      this.sid = value
      this.validateSid(value)
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
      this.sid = null
      this.isOracle = false
      this.msg.databaseName = ''
      this.msg.port = ''
      this.msg.username = ''
      this.msg.password = ''
      this.msg.serverInforId = ''
      this.msg.databaseType = ''
      this.msg.sid = ''
    },
    validateDBName (value) {
      if (/^[a-zA-Z_][\w-]{0,127}$/.test(value)) {
        this.msg.databaseName = ''
      } else {
        this.msg.databaseName = 'Invalid database name'
      }
    },
    validatePortNumber (value) {
      if (
        /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(
          value
        )
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
      if (this.databaseType === 'oracle') {
        this.isOracle = true
      } else {
        this.isOracle = false
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
      if ((this.sid === null || this.sid === '') && this.isOracle === true) {
        this.msg.sid = 'Invalid sid'
      }
      if (this.serverInforId === null) {
        this.msg.serverInforId = 'Please select host'
      }
      if (this.databaseType === null) {
        this.msg.databaseType = 'Please select type database'
      }
      if (
        this.msg.databaseName === '' &&
        this.msg.port === '' &&
        this.msg.username === '' &&
        this.msg.password === '' &&
        this.msg.serverInforId === '' &&
        this.msg.databaseType === '' &&
        this.msg.sid === ''
      ) {
        try {
          this.isLoadingCreate = true
          const config = {
            port: this.port,
            username: this.username,
            password: this.password,
            databaseName: this.databaseName,
            databaseType: this.databaseType,
            serverInforId: this.serverInforId,
            sid: this.sid
          }
          const res = await createDatabase(config)
          this.isLoadingCreate = false
          this.isVisible = false
          this.$emit('onAdded')
          if (res.code === '201') {
            this.$notify({
              type: 'success',
              text: 'Create database succeeded'
            })
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
        const data = {
          serverInforId: this.serverInforId,
          port: this.port,
          username: this.username,
          password: this.password,
          database_name: this.databaseName,
          database_type: this.databaseType
        }
        const res = await checkConnection(data)
        if (res.code === '200') {
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
