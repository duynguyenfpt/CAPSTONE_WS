<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-modal no-close-on-backdrop v-model="isVisible" title="Create Database" hide-footer>
        <b-row>
          <b-col>
            <label class="form-label">Host <span class="msg-error">*</span></label>
            <v-select
              class="select-sm"
              :reduce="(text) => text.value"
              label="text"
              :options="dbHosts"
              v-model="serverInforId"
              @input="chooseHost"
              size="sm"
              placeholder="Please select an option"
            ></v-select>
            <p class="msg-error" v-if="msg.serverInforId">
              {{ msg.serverInforId }}
            </p>
          </b-col>
          <b-col>
            <label class="form-label">Port <span class="msg-error">*</span></label>
            <b-input size="sm" v-model="port" />
            <p class="msg-error" v-if="msg.port">{{ msg.port }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <label class="form-label">Database <span class="msg-error">*</span></label>
            <b-input size="sm" v-model="databaseName" />
            <p class="msg-error" v-if="msg.databaseName">
              {{ msg.databaseName }}
            </p>
            <label class="form-label">Username <span class="msg-error">*</span></label>
            <b-input size="sm" v-model="username" />
            <p class="msg-error" v-if="msg.username">{{ msg.username }}</p>
            <label class="form-label">Password <span class="msg-error">*</span></label>
            <b-input size="sm" v-model="password" type="password" />
            <p class="msg-error" v-if="msg.password">{{ msg.password }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <label class="form-label">Database Type <span class="msg-error">*</span></label>
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
        <b-row>
          <b-col>
            <label class="form-label">Alias <span class="msg-error">*</span></label>
            <b-input size="sm" v-model="alias" />
            <p class="msg-error" v-if="msg.alias">{{ msg.alias }}</p>
          </b-col>
        </b-row>
        <b-row v-if="isOracle">
          <b-col>
            <label class="form-label">SID <span class="msg-error">*</span></label>
            <b-input size="sm" v-model="sid" />
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
import { checkPermission } from '~/service/right'

Vue.component('v-select', vSelect)
export default {
  data: () => ({
    dbHosts: [],
    dbTypes: [
      { value: null, text: 'Please select an option' },
      { value: 'mysql', text: 'MySql' },
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
    alias: null,
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
      sid: null,
      alias: null
    },
    isDeny: false
  }),

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
    },
    alias (value) {
      this.alias = value
      this.validateAlias(value)
    }
  },

  methods: {
    async checkPermission () {
      const dataCon = {
        method: 'POST',
        path: 'test_connection'
      }
      const dataServer = {
        method: 'GET',
        path: 'server_infor'
      }
      const dataDb = {
        method: 'POST',
        path: 'database_infor'
      }
      const resCon = await checkPermission(dataCon)
      const resServer = await checkPermission(dataServer)
      const resDb = await checkPermission(dataDb)
      if (
        !resCon.data.success ||
        !resServer.data.success ||
        !resDb.data.success
      ) {
        this.$notify({
          type: 'error',
          text: 'Error occurred! - Access Denied'
        })
        this.isDeny = true
      }
    },
    async show () {
      await this.checkPermission()
      if (!this.isDeny) {
        const hosts = await getAllServers()
        if (hosts.code === '200') {
          this.dbHosts = hosts.data.map((item) => {
            return {
              value: item.id,
              text: item.serverDomain + ' - ' + item.serverHost
            }
          })
          this.isVisible = true
          this.port = null
          this.username = null
          this.password = null
          this.databaseName = null
          this.databaseType = null
          this.serverInforId = null
          this.sid = null
          this.alias = null
          this.isOracle = false
          this.msg.databaseName = ''
          this.msg.port = ''
          this.msg.username = ''
          this.msg.password = ''
          this.msg.serverInforId = ''
          this.msg.databaseType = ''
          this.msg.sid = ''
          this.msg.alias = ''
        } else {
          this.$notify({ type: 'error', text: 'Error occurred!' })
        }
      }
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
    validateAlias (value) {
      if (/^[a-zA-Z_][\w-.]{1,50}$/.test(value)) {
        this.msg.alias = ''
      } else {
        this.msg.alias = 'Invalid alias'
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
      if (this.alias === null) {
        this.msg.alias = 'Invalid alias'
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
        this.msg.sid === '' &&
        this.msg.alias === ''
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
            sid: this.sid,
            alias: this.alias
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
          this.$notify({ type: 'error', text: 'Create database failed' })
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
          databaseName: this.databaseName,
          databaseType: this.databaseType,
          sid: this.sid
        }
        const res = await checkConnection(data)
        if (res.code === '200' && res.data.success) {
          this.$notify({ type: 'success', text: 'Test connection succeeded.' })
        } else {
          this.$notify({ type: 'error', text: 'Test connection failed' })
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
