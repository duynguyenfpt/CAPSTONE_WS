<template>
<div>
  <b-modal v-model="isVisible" title="Edit Database" hide-footer>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-row>
        <b-col>
          <label class="form-label">Host</label>
          <v-select
            class="select-sm"
            :reduce="(text) => text.value"
            label="text"
            :options="options"
            v-model="serverInforId"
            size="sm"
          ></v-select>
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
          <label class="form-label">Database Type</label>
          <b-form-select
            v-model="databaseType"
            :options="dbTypes"
            size="sm"
            @change="chooseDbType"
          ></b-form-select>
        </b-col>
      </b-row>
      <b-row>
          <b-col>
            <label class="form-label">Alias</label>
            <b-input size="sm" v-model="alias" />
            <p class="msg-error" v-if="msg.alias">{{ msg.alias }}</p>
          </b-col>
        </b-row>
      <b-row v-if="isOracle">
      <b-col>
        <label class="form-label">SID</label>
        <b-input size="sm" v-model="sid" />
        <p class="msg-error" v-if="msg.sid">{{ msg.sid }}</p>
      </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="primary" @click="onUpdateDB">
            <b-spinner v-if="isLoadingUpdate" variant="primary" small></b-spinner>Update</b-button>
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
import { getDatabaseDetail, updateDatabase } from '@/service/db'
import { getAllServers } from '@/service/server'

export default {
  data: () => ({
    options: [],
    dbTypes: [
      { value: 'mysql', text: 'MySql' },
      { value: 'postgresql', text: 'PostgreSQL' },
      { value: 'oracle', text: 'Oracle' }
    ],
    serverInforId: 0,
    port: null,
    databaseName: null,
    username: null,
    password: null,
    databaseType: null,
    sid: null,
    alias: null,
    isVisible: false,
    idItem: 0,
    isLoading: false,
    isLoadingUpdate: false,
    isOracle: false,
    msg: {
      databaseName: null,
      port: null,
      username: null,
      password: null,
      sid: null,
      alias: null
    },
    isDeny: false
  }),

  async mounted () {
    this.isLoading = true
    const hosts = await getAllServers()
    if (hosts.statusCode === '403') {
      this.$notify({ type: 'error', text: 'Error occurred! - Access Denied' })
      this.isVisible = false
    } else {
      this.options = hosts.data.map(item => {
        return { value: item.id, text: item.serverDomain + ' - ' + item.serverHost }
      })
    }
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
    },
    alias (value) {
      this.alias = value
      this.validateAlias(value)
    }
  },

  methods: {
    async show (id) {
      this.idItem = id
      this.isVisible = true
      this.isLoading = true
      const res = await getDatabaseDetail(id)
      if (res.statusCode === '403') {
        this.$notify({ type: 'error', text: 'Error occurred! - Access Denied' })
        this.isVisible = false
      } else {
        this.serverInforId = res.data.serverInfor.id
        this.port = res.data.port
        this.databaseName = res.data.databaseName
        this.username = res.data.username
        this.password = res.data.password
        this.databaseType = res.data.databaseType
        this.alias = res.data.alias
        if (this.databaseType === 'oracle') {
          this.isOracle = true
          this.sid = res.data.sid
        } else {
          this.isOracle = false
          this.sid = ''
        }
        this.isLoading = false
        this.msg.databaseName = ''
        this.msg.port = ''
        this.msg.username = ''
        this.msg.password = ''
        this.msg.sid = ''
        this.msg.alias = null
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
      if (/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(value)) {
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
    chooseDbType () {
      if (this.databaseType === 'oracle') {
        this.isOracle = true
        this.msg.sid = ''
      } else {
        this.isOracle = false
      }
    },
    onClose () {
      this.isVisible = false
    },
    async onUpdateDB () {
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
      if (this.alias === null) {
        this.msg.alias = 'Invalid alias'
      }
      if (this.msg.databaseName === '' && this.msg.port === '' && this.msg.username === '' && this.msg.password === '' && this.msg.sid === '' && this.alias === '') {
        try {
          this.isLoadingUpdate = true
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
          const data = await updateDatabase(this.idItem, config)
          if (data.statusCode === '403') {
            this.$notify({ type: 'error', text: 'Error occurred! - Access Denied' })
            this.isVisible = false
          } else {
            this.isLoadingUpdate = false
            this.isVisible = false
            this.$emit('onUpdated', data)
            if (data.code === '200') {
              this.$notify({ type: 'success', text: 'Update database succeeded' })
            } else {
              this.$notify({ type: 'error', text: 'Update database failed' })
            }
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
